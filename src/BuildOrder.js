import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { isBuffer } from 'util';

import { allAbilities, allUnits, allUpgrades, createAbilityLink, createUnitLink, getUnitLink, createUnitIcon, createUpgradeLink, createWeaponLink, strToArray } from './shared';

const StateMachine = require('javascript-state-machine');

const Game = StateMachine.factory({
    init: 'waitForResources',
    transitions: [
      { name: 'build',     from: 'waitForResources',  to: 'build' },
      { name: 'waitForResources',   from: 'build', to: 'waitForResources'}
    ]
});

const Unit = StateMachine.factory({
    init: 'init',
    transitions: [
      { name: 'work',     from: 'building',  to: 'working' },
      { name: 'maynard',   from: 'working', to: 'maynarding'},
      { name: 'work', from: 'maynarding', to: 'working' },
      
      { name: 'idle', from:'training', to:'idling' },
      { name: 'idle', from:'building', to:'idling' },
      { name: 'build', from: 'init', to: 'building' }, // for every unit, their build time
      { name: 'train', from: 'init', to: 'training' }, // for barracks etc.
      { name: 'train', from: 'idling', to: 'training' }, // for barracks etc.
      { name: 'train', from:'working', to:'training' }, //for scvs on mineral lines
      { name: 'work', from:'training', to:'working' }, //for scvs finished building
      { name: 'idle', from:'init', to:'idling' }, //for initial units
      { name: 'work', from:'init', to:'working' }, //for initial units
      
      

    ]
});

const createUnitInstance = (unitName, cb) => { 
    const unit = Object.assign({},allUnits.filter(unit => unit.Name === unitName)[0]);
    unit.frame = -1;
    unit.sm = new Unit();
    cb && cb(unit);
    return unit;
}

const getSupply = (units) => {
    
    const supplyProvided = units
        .filter(unit => unit['Supply Provided'])
        .map(unit => Number(unit['Supply Provided']))
        .reduce((sum, val) => sum + val);

    const supplyTaken = units
        .filter(unit => unit['Supply Cost'])
        .map(unit => Number(unit['Supply Cost']))
        .reduce((sum, val) => sum + val);

    return {
        supplyProvided, supplyTaken
    };
};

const supplyIsAvailable = (units, unitName) => {
    const unitInfo = createUnitInstance(unitName);
    const { supplyProvided, supplyTaken} = getSupply(units);
    return ( supplyProvided - supplyTaken) >= unitInfo['Supply Cost'];
}

const canAffordUnit = (minerals, vespine, unitName) => {
    const unitInfo = createUnitInstance(unitName);
    return minerals >= unitInfo['Mineral Cost'] && vespine >= unitInfo['Vespine Cost'];
}

const someUnitInInit = (units) => {
    return !!units.filter(unit => unit.sm.state === 'init').length;
}

const buildUnit = (units, minerals, vespine, unitName) => {
    // units = units.slice(0);
    if (!supplyIsAvailable(units, unitName) || !canAffordUnit(minerals, vespine, unitName) || someUnitInInit(units)) {
        return null;
    }
    const unitInfo = createUnitInstance(unitName);
    return {
        units: units.concat([unitInfo]),
        minerals: minerals - unitInfo['Mineral Cost'],
        vespine: vespine - unitInfo['Vespine Cost']
    };
}

const fps = 23.81;

// user build order vs system intent and priority
const updateGame = (units, map, minerals, vespine, time) => {
    return {
        units,
        map,
        minerals,
        vespine,
        time
    };
};

const miningRate = [
    // 0 - 9 = 1.0
    0, 59, 59, 59, 59, 59, 59, 59, 59, 59, 
    // 10-11 = 1.1
    56, 56,
    // 12, 13, 14 = 1.3
    54, 54, 54,
    // 15, 16, 17 = 1.6
    50, 50, 50,
    // 18, 19 = 2
    47, 47,
    // 20, 21, 22 = 2.2 
    45, 45, 45,
    // 23, 24, 25 = 2.5
    43, 43, 43,
    // 26 = 2.8++
    41, 41, 41, 41, 41, 41, 41, 41
];

const fpm = 79.95;
const fpg = 36.75;

// 79.95 frames per 8 minerals (probe)
// 36.75 per 8 gas (probe)

const friendlyTime = (frame) => {
    if (frame / fps > 60) {
        const time = frame / fps / 60;
        const min = Math.round(time);
        const sec = Math.round((time - min) * 60);
        return `${min}:${sec}`;
    } else {
        return `${Math.round(frame / fps, 0)}s`;
    }
}
const action = (name, state) => {
    const { supplyTaken, supplyProvided} = getSupply(state.units);
    return <div><p>{`${name} - ${friendlyTime(state.frame)}/${state.frame} - (${supplyTaken}/${supplyProvided}) - $${state.minerals}/${state.allConsumedMinerals()}`}</p>
    <ul>
    {
            state.units.map(unit => <li>{unit.Name} - {unit.sm.state} - {unit.frame}</li>)
            }</ul></div>
};

const simulate = (startUnits, bo, mp, mins, vesp) => {

    const state = {
        units: startUnits.slice(0),
        frame: 0,
        buildOrder: bo,
        map: mp,
        minerals: mins,
        allConsumedMinerals: function(){
            return mins - this.map.minerals;
        },
        vespine: vesp,
        actionsTaken: []
    };

    while (state.frame < 10000 && state.map.minerals > 0) {
        state.frame++;
        // rough model
        // x amount of minerals
        // y amount of scvs
        // z amount of bases, will treat as one blob of minerals except for maynarding gaps
        // eventually need to model individual base mineral lines due to saturation
        // build units in order

        // mini game loop
        state.units.forEach(unit => {
            if (unit.sm.state === 'init') {
                // find idle building that can make this unit otherwise wait till next frame
                if (unit.isBuilding){
                    const trainers = state.units.filter(trainer => 
                        trainer.Name === unit["Created By"] && (trainer.sm.state === 'idling' || trainer.sm.state === 'working') );
                    if (trainers[0]) {
                        const trainer = trainers[0];
                        trainer.sm.train();
                        trainer.frame = state.frame + unit['Build Time Frames'];
                        unit.sm.build();
                        unit.frame = state.frame + unit['Build Time Frames'];
                        state.actionsTaken.push(action('build ' + unit.Name, state));
                    }
                    return;
                }
                const trainers = state.units.filter(trainer => 
                    trainer.Name === unit["Created By"] && trainer.sm.state === 'idling' );
                if (trainers[0]) {
                    const trainer = trainers[0];
                    trainer.sm.train();
                    trainer.frame = state.frame + unit['Build Time Frames'];
                    unit.sm.build();
                    unit.frame = state.frame + unit['Build Time Frames'];
                    state.actionsTaken.push(action('build ' + unit.Name, state));
                }
            } else if (unit.sm.state === 'training') {
                if (state.frame > unit.frame) {
                    if (unit.isWorker) { // finished building a building
                        unit.frame = state.frame;
                        unit.sm.work();                  
                    } else {
                        unit.sm.idle();
                    }
                }
            } else if (unit.sm.state === 'building') {
                if (state.frame > unit.frame) {
                    state.actionsTaken.push(action('complete ' + unit.Name, state));
                    if (unit.isWorker) {
                        unit.frame = state.frame;
                        unit.sm.work();                  
                    } else {
                        unit.sm.idle();
                    }
                }
            } else if (unit.sm.state === 'working') { //workersonly
                // naive impl assumes no saturation deficit
                if (state.frame - unit.frame > fpm) {
                    unit.frame = state.frame;
                    state.minerals += 8;
                    state.map.minerals -= 8;
                    // state.actionsTaken.push(action('mined +8m', state));                    
                }
                // update mineral / vespine depending on base
            } else if (unit.sm.state === 'maynarding') {
                // update travel time and transition to mining
            }
        })


        // handle build order
        const instr = state.buildOrder[0];
        if (!instr) {
            ;
        }
        else if (instr.meta) {
            // build order can issue changes to meta instructions (eg. constantly pump scvs)
            break;
        } else if (instr.unit) {
            if (instr.supply) {
                const currentSupply = getSupply(state.units);
                if (currentSupply.supplyTaken !== instr.supply) {
                    state.actionsTaken.push(action('wait to build ' + currentSupply.supplyTaken + ' != ' + instr.supply, state));
                    continue;
                }
            }
            const result = buildUnit(state.units, state.minerals, state.vespine,instr.unit);
            if (result) {
                state.units = result.units;
                state.minerals = result.minerals;
                state.vespine = result.vespine;
                state.buildOrder.shift();                
            }
            
        } else if (instr.kill) {
            let killCount = 0;
            state.units = state.units.map(unit => {
                if (killCount < instr.amount && unit.Name === instr.kill ) {
                    killCount++;
                    state.actionsTaken.push(action('died ' + unit.Name, state));
                    return null;
                }
                return unit;
            })
            state.units = state.units.filter(unit => unit);
            state.buildOrder.shift();
        }
    }
    return state;
}

class BuildOrder extends Component {
    constructor(props) {
        super(props);

        const units = [
            createUnitInstance('Terran Command Center', unit => unit.sm.idle()),
            createUnitInstance('Terran SCV', unit => unit.sm.work()),
            createUnitInstance('Terran SCV', unit => unit.sm.work()),
            createUnitInstance('Terran SCV', unit => unit.sm.work()),
            createUnitInstance('Terran SCV', unit => unit.sm.work())
        ];
        
        const buildOrder = [
            // {special:'constantly-make-workers'},
            {unit:'Terran SCV'},
            {unit:'Terran SCV'},
            {unit:'Terran SCV'},
            {unit:'Terran SCV'},
            {unit:'Terran SCV'},
            {unit:'Terran Supply Depot'},
            {unit:'Terran SCV'},
            {unit:'Terran SCV'},
            {unit:'Terran SCV'},
            {supply:12, unit:'Terran Barracks'},
            {supply:12, unit:'Terran Refinery'},
            {kill:'Terran SCV', amount:3}
        ];

        const map = {
            minerals: 5000
        };

        const simulation = simulate(units, buildOrder, map, 50, 0);
        
        this.state = simulation;
        this.state.supply = getSupply(simulation.units);
    }

    componentWillReceiveProps(props) {
        this.setState((prevState) => {
            return {...prevState}
        });
    }


    render() {
        return <div> 
            <div>{this.state.supply.supplyTaken} / {this.state.supply.supplyProvided}  - final frame {this.state.frame}</div>
            <ul>
            {
                this.state.actionsTaken.map(item => <li>{item}</li>)
            }
            </ul>

            <ul>
            {
                this.state.units.map(unit => <li>{unit.Name} - {unit.sm.state} - {unit.frame}</li>)
            }
            </ul>
        </div>;
    }
}

export default BuildOrder;