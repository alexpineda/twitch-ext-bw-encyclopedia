import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { isBuffer } from 'util';

import { allAbilities, allUnits, allUpgrades, createAbilityLink, createUnitLink, getUnitLink, createUnitIcon, createUpgradeLink, createWeaponLink, strToArray } from './shared';

const getBuildingListForRace = (race) => allUnits.filter(unit => unit.Race === race).filter(unit => unit.isBuilding);
const getUnitListForRace = (race) => allUnits.filter(unit => unit.Race === race).filter(unit => !unit.isBuilding);  
const getAbilityListForRace = (race) => allAbilities.filter(unit => unit.Race === race);
const getUpgradeListForRace = (race) => allUpgrades.filter(unit => unit.Race === race);

class Units extends Component {
    constructor(props) {
        super(props);
        this.state = {
            units : getUnitListForRace(props.match.params.race),
            buildings: getBuildingListForRace(props.match.params.race),
            abilities: getAbilityListForRace(props.match.params.race),
            upgrades: getUpgradeListForRace(props.match.params.race),
            race: props.match.params.race,
            page: Number(props.match.params.page || 1),
            selectedUnit: null
        };

        this.onUnitClick = this.onUnitClick.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState((prevState) => {
            return {...prevState, 
                units : getUnitListForRace(props.match.params.race),
                buildings: getBuildingListForRace(props.match.params.race),
                abilities: getAbilityListForRace(props.match.params.race),
                upgrades: getUpgradeListForRace(props.match.params.race),
                race: props.match.params.race,
                page: Number(props.match.params.page || 1),
                selectedUnit: null }
        })
    }

    onUnitClick(unit) {
        this.setState((prevState) => {
            return {
                ...prevState,
                selectedUnit: unit
            }
        });
    }

    render() {
        const unit = this.state.selectedUnit;

        return <div className='unit-labels-container'>
        <span class="unit-header">{this.state.race.toUpperCase()}</span>
            <Link to={`/race/${this.state.race}`}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></Link>
    
            <div className="unit-labels-container__switcher">
                <ul>
                    <li><Link to={`/race/${this.state.race}/units/1`} className={this.state.page === 1 ? 'active':''}>Units</Link></li>
                    <li><Link to={`/race/${this.state.race}/units/2`} className={this.state.page === 2 ? 'active':''}>Buildings</Link></li>
                    <li><Link to={`/race/${this.state.race}/units/3`} className={this.state.page === 3 ? 'active':''}>Abilities</Link></li>
                    <li><Link to={`/race/${this.state.race}/units/4`} className={this.state.page === 4 ? 'active':''}>Upgrades</Link></li>
                </ul>
            </div>
    
            { this.state.page === 1 ? 
                <div className='unit-labels'>
                {this.state.units
                        .map(unit => 
                            <span  key={unit.Name} className="text" data-tip={unit.Name} >{createUnitLink(unit.Name, unit.Race)}</span>)}
                    {/* {this.state.units
                        .map(unit => 
                            <span  key={unit.Name} className="text" data-tip={unit.Name} onClick={_=>this.onUnitClick(unit)}>{createUnitIcon(unit.Name, unit.Race)}</span>)} */}
                </div> : ''
            }
    
            { this.state.page === 2 ? 
                <div className='unit-labels'>
                    {this.state.buildings
                        .map(unit => 
                            <span  key={unit.Name} className="text" data-tip={unit.Name}>{createUnitLink(unit.Name, unit.Race)}</span>)}
                </div> : ''
            }
    
            { this.state.page === 3 ? 
                <div className="unit-labels">
                {this.state.abilities
                    .map(ability => 
                        <span  key={ability.Name} className="text" data-tip={ability.Name}>{createAbilityLink(ability['Researched at'],ability.Name, ability.Race)}</span>)}
                </div>: ''
            }
    
            { this.state.page === 4 ? 
                <div className="unit-labels">
                {this.state.upgrades    
                    .map(upgrade => 
                        <span  key={upgrade.Name} className="text" data-tip={upgrade.Name}>{createUpgradeLink(upgrade['Upgraded at'],upgrade.Name, upgrade.Race)}</span>)
                }
                </div> : ''
            }
            
            { this.state.selectedUnit ? <div>
                <div style={{textAlign:'center'}}>
                    <div className="unit-stats-page-selector" style={{float:'left'}}>
                        <img src="resources/arrow-left.svg" alt="Previous Stats"/>
                    </div>
                    <div className="unit-stats-page-selector" style={{float:'right'}}>
                        <img src="resources/arrow-right.svg" alt="Next Stats"/>
                    </div>
                    <p>{unit.Name.replace(unit.Race, '')} {createUnitIcon(unit.Name, unit.Race)} <Link to={getUnitLink(unit.Name, unit.Race)}>(expand)</Link></p>
                    
                </div>
                <div>
                <table>
                    <tbody>
                    <tr>
                        <td>Hit Points</td>
                        <td>{unit['Hit Points']}</td>
                    </tr>

                    {
                        unit['Shields'] ?
                        <tr style={{display:unit['Shields']?'':'none'}}>
                            <td>Shields</td>
                            <td>{unit['Shields']}</td>
                        </tr> : ''
                    }

                    {
                        unit['Cost'] ?
                        <tr >
                            <td>Cost</td>
                            <td>
                            <img src="resources/Mineral.gif" alt="Minerals"/> {unit['Mineral Cost']}&nbsp;
                            <img src="resources/Vespine.gif" alt="Vespine" /> {unit['Vespine Cost']} &nbsp;
                            <img src={`resources/Supply_${unit.Race}.png`} alt="Supply" /> {unit['Supply Cost']}</td>
                        </tr> : ''
                    }
                    
                    <tr>
                        <td>Build Time</td>
                        <td>{unit['Build Time']} seconds</td>
                    </tr>
                    <tr>
                        <td colspan="2" style={{textAlign:'center'}}>
                        
                        </td>
                    </tr> 
                    </tbody>
                </table>
                </div>
            </div> : '' }
    
        </div>;
    }
}

export default Units;