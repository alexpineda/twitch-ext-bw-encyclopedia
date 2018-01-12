import React from 'react';
import { Link } from 'react-router-dom';

const allUnits = require('./bwapi-data/json/units.json');
const allWeapons = require('./bwapi-data/json/weapons.json');
const allUpgrades = require('./bwapi-data/json/upgrades.json');
const allAbilities = require('./bwapi-data/json/abilities.json');

const strToArray = (strOrArray) => {
    if (!strOrArray) return [];

    if (typeof strOrArray === 'string') {
        return  [strOrArray];
    }
    return strOrArray;
}

// const getOrHide = (field) => {
//     const data = strToArray(unit[field]);
//     if (field.length) {
//         return [<dt>{field}</dt>
//         <dd>{strToArray(unit[field]).join(',')}</dd>];
//     }
//     return '';
// }

const Ability = ({match}) => {
    const ability = allAbilities.find(ability => ability.Name == match.params.ability);

    return <div>
            <div><Link to={`/race/${match.params.race}/units/${match.params.unit}`}>Back</Link></div>
            <span><i className={ability.Icon}></i>{ability.Name}</span>
            <dl>
                <dt>Cost</dt>
                <dd>{ability['Cost']}</dd>

                <dt>Research Time</dt>
                <dd>{ability['Research Time']}</dd>

                <dt>Energy Cost</dt>
                <dd>{ability['Energy Cost']}</dd>

                <dt>Researched at</dt>
                <dd>{ability['Researched at']}</dd>

                <dt>Targets</dt>
                <dd>{ability['Targets']}</dd>
           
            </dl>
        </div>;
}

const Weapon = ({match}) => {
    const weapon = allWeapons.find(weapon => weapon.Name == match.params.weapon);

    return <div>
            <div><Link to={`/race/${match.params.race}/units/${match.params.unit}`}>Back</Link></div>
            <span><i className={weapon.Icon}></i>{weapon.Name}</span>
            <dl>
                <dt>Damage</dt>
                <dd>{weapon['Damage']}</dd>

                <dt>Damage Bonus</dt>
                <dd>{weapon['Damage Bonus']}</dd>

                <dt>Base Cooldown</dt>
                <dd>{weapon['Base Cooldown']}</dd>

                <dt>Damage Factor</dt>
                <dd>{weapon['Damage Factor']}</dd>

                <dt>Upgrade</dt>
                <dd>{weapon['Upgrade']}</dd>

                <dt>Damage Type</dt>
                <dd>{weapon['DamageType']}</dd>

                <dt>Explosion Type</dt>
                <dd>{weapon['ExplosionType']}</dd>

                <dt>Maximum Range</dt>
                <dd>{weapon['Maximum Range']}</dd>
                
                <dt>Can Attack</dt>
                <dd>{weapon['Target Attributes']}</dd>
            </dl>
        </div>;
}

const Upgrade = ({match}) => {
    const upgrade = allUpgrades.find(upgrade => upgrade.Name == match.params.upgrade);

    return <div>
            <div><Link to={`/race/${match.params.race}/units/${match.params.unit}`}>Back</Link></div>
            <span><i className={upgrade.Icon}></i>{upgrade.Name}</span>
            <dl>
                <dt>Cost</dt>
                <dd>{upgrade['Cost']}</dd>

                <dt>Upgrade Time</dt>
                <dd>{upgrade['Upgrade Time']}</dd>

                <dt>Maximum Level</dt>
                <dd>{upgrade['Maximum Level']}</dd>

                <dt>Upgraded at</dt>
                <dd><span><Link to={`/race/${match.params.race}/units/${upgrade['Upgraded at']}`} >{upgrade['Upgraded at']}</Link> </span>
                </dd>

                <dt>Level 2 Requires</dt>
                <dd><span><Link to={`/race/${match.params.race}/units/${upgrade['Level 2 Requires']}`} >{upgrade['Level 2 Requires']}</Link> </span></dd>

                <dt>Level 3 Requires</dt>
                <dd><span><Link to={`/race/${match.params.race}/units/${upgrade['Level 3 Requires']}`} >{upgrade['Level 2 Requires']}</Link> </span></dd>

            </dl>
        </div>;
}

const Unit = ({match}) => {
    const unit = allUnits.find(unit => unit.Name == match.params.unit);

    return <div >
        <div><Link to={`/race/${match.params.race}/units`}>Back</Link></div>
        <span><i className={unit.Icon}></i>{unit.Name}</span> 
        <table>
            <tbody>
            <tr>
                <td>Hit Points</td>
                <td>{unit['Hit Points']}</td>
            </tr>

            <tr>
                <td>Cost</td>
                <td>{unit['Cost']}</td>
            </tr>

            <tr>
                <td>Build Time</td>
                <td>{unit['Build Time']}</td>
            </tr>

            <tr>
                <td>Ground Weapon</td>
                <td><Link to={match.url+'/weapon/'+unit['Ground Weapon']}>{unit['Ground Weapon']}</Link></td>
            </tr>

            <tr>
                <td>Air Weapon</td>
                <td><Link to={match.url+'/weapon/'+unit['Air Weapon']}>{unit['Air Weapon']}</Link></td>
            </tr>

            <tr>
                <td>Abilities</td>
                <td>
                {
                    strToArray(unit['Abilities']).map(ability => {
                    return <span><Link to={`/race/${unit.Race}/units/${unit.Name}/ability/${ability}`} key={ability}>{ability}</Link> </span>
                })}
                </td>
            </tr>

            <tr>
                <td>Required Units</td>
                <td>
                {
                    strToArray(unit['Required Units']).map(requiredUnit => {
                    return <span><Link to={`/race/${unit.Race}/units/${requiredUnit}`} key={requiredUnit}>{requiredUnit}</Link> </span>
                })}</td>
            </tr>
            </tbody>
        </table>

        <div>Advanced</div>

        <dl>
            
            <dt>Upgrades</dt>
            <dd>
                {
                    strToArray(unit['Upgrades']).map(upgrade => {
                    return <span><Link to={`/race/${unit.Race}/units/${unit.Name}/upgrade/${upgrade}`} key={upgrade}>{upgrade}</Link> </span>
                })}
            </dd>

            <dt>Armor</dt>
            <dd>{unit['Armor']}</dd>

            <dt>Size</dt>
            <dd>{unit['SizeType']}</dd>

            <dt>Speed</dt>
            <dd>{unit['Top Speed']}</dd>

            <dt>Sight Range</dt>
            <dd>{unit['Sight Range']}</dd>

            <dt>Seek Range</dt>
            <dd>{unit['Seek Range']}</dd>

            <dt>Attributes</dt>
            <dd>{strToArray(unit['Attributes']).join(', ')}</dd>

            <dt>Created By</dt>
            <dd>{unit['Created By']}</dd>

        </dl>


    </div>;
}

const getUnitList = (units, start, match) => {
    return units.map(unit => {
        return <div class='unit-label' key={unit.Name} ><Link to={`/race/${match.params.race}/units/${unit.Name}`} ><span><i className={unit.Icon}></i>{unit.Name}</span></Link></div>
    }).slice(start, start+5);
};

let unitStartPos = 0;

const Units = ({match}) => {
    const units = allUnits.filter(unit => unit.Race == match.params.race);

    return <div class='unit-labels-container'>
        <Link to={`/race/${match.params.race}`}>Back</Link>
        <div class='unit-labels'>
            {getUnitList(units, unitStartPos, match)}
        </div>
        <div onClick={_=>{console.log(unitStartPos); unitStartPos++;}}>More</div>
    </div>;
};

export {
    Units,
    Unit,
    Weapon,
    Upgrade,
    Ability
}