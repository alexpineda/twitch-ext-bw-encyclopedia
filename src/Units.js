import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import history from './history';
import { isBuffer } from 'util';

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

const createDescriptionContent= (unit) => {
    if (!unit.Description) return '';
    if (!unit.Link) return unit.Description;
    return unit.Description + ` <a target="_top" href="${unit.Link}">[1]</a>`;
}

const createWeaponLink = (unitName, weaponName, race) => {
    
    const weapon = allWeapons.find(weapon => weapon.Name === weaponName);
    if (!weapon) return "N/A";

    let extra = '';
    if (weapon.Multiplier) {
        extra = ` (x${weapon.Multiplier})`
    }
    return <Link to={`/race/${race}/unit/${unitName}/weapon/${weapon.Name}`} title={weapon.Name} data-tip={weapon.Name}><i className={weapon.Icon}></i>{extra}</Link>
};

const createUpgradeLink = (unitName, upgradeName, race) => {
    const upgrade = allUpgrades.find(upgrade => upgrade.Name === upgradeName);
    if (!upgrade) return "";
    return <Link to={`/race/${race}/unit/${unitName}/upgrade/${upgrade.Name}`} title={upgrade.Name} data-tip={upgrade.Name}><i className={upgrade.Icon}></i></Link>
};

const createAbilityLink = (unitName, abilityName, race) => {
    const ability = allAbilities.find(ability => ability.Name === abilityName);
    return <Link to={`/race/${race}/unit/${unitName}/ability/${ability.Name}`} title={ability.Name} data-tip={ability.Name}><i className={ability.Icon}></i></Link>
};

const createUnitLink = (unitName, race) => {
    if (!unitName) return '';

    let extra = '';
    switch (unitName){
        case '2 x Protoss High Templar':
            unitName = 'Protoss High Templar';
            extra = ' (x2)';
            break;
        case '2 x Protoss Dark Templar':
            unitName = 'Protoss Dark Templar';
            extra = ' (x2)';
            break;
        default:
    }
    const unit = allUnits.find(unit => unit.Name == unitName);

    return <Link to={`/race/${race}/unit/${unitName}/stats`} title={unitName} data-tip={unit.Name} ><i className={unit.Icon}></i>{extra}</Link>
};


const Ability = ({match}) => {
    const ability = allAbilities.find(ability => ability.Name == match.params.ability);

    return <div className='ability'>
            <div><Link to={`/race/${match.params.race}/unit/${match.params.unit}`}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></Link></div>
            <span className='unit-header'>Ability</span>
            <div className="ability__title"><i className={ability.Icon}></i> <span>{ability.Name}</span></div>
            <p className="ability__description" dangerouslySetInnerHTML={{__html:createDescriptionContent(ability)}}></p>
            <table>
                <tbody>
                    <tr>
                        <td>Cost</td>
                        <td>
                            <img src="resources/Mineral.gif" alt="Minerals"/> {ability['Mineral Cost']}&nbsp;
                            <img src="resources/Vespine.gif" alt="Vespine" /> {ability['Vespine Cost']} &nbsp;
                        </td>
                    </tr>
                    <tr style={{display:ability['Research Time'] ? '':'none'}}>
                        <td>Research Time</td>
                        <td>{ability['Research Time']} seconds</td>
                    </tr>
                    <tr style={{display:ability['Energy Cost'] ? '':'none'}}>
                        <td>Energy Cost</td>
                        <td>{ability['Energy Cost']}</td>
                    </tr>
                    <tr style={{display:ability['Duration'] ? '':'none'}}>
                        <td>Duration</td>
                        <td>{ability.Duration}</td>
                    </tr>
                    <tr style={{display:ability['Researched at'] ? '':'none'}}>
                        <td>Researched at</td>
                        <td>{createUnitLink(ability['Researched at'], match.params.race)}</td>
                    </tr>
                    <tr style={{display:ability['Targets'] ? '':'none'}}>
                        <td>Targets</td>
                        <td>{ability['Targets']}</td>
                    </tr>

                </tbody>
            </table>
        </div>;
}

const Weapon = ({match}) => {
    const weapon = allWeapons.find(weapon => weapon.Name == match.params.weapon);

    return <div className='weapon'>
            <div><Link to={`/race/${match.params.race}/unit/${match.params.unit}`}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></Link></div>
            <span className='unit-header'>Weapon</span>
            <div className="weapon__title"><i className={weapon.Icon}></i> <span>{weapon.Name}</span></div>

            <table>
                <tbody>
                    <tr>
                        <td>Damage</td>
                        <td>{weapon['Damage']}</td>
                    </tr>

                    <tr>
                        <td>Damage Bonus</td>
                        <td>{weapon['Damage Bonus']}</td>
                    </tr>

                    <tr>
                        <td>Base Cooldown</td>
                        <td>{weapon['Base Cooldown']}</td>
                    </tr>

                    <tr>
                        <td>Damage Factor</td>
                        <td>{weapon['Damage Factor']}</td>
                    </tr>

                    <tr style={{display:weapon['Upgrade'] ? '':'none'}}>
                        <td>Upgrade</td>
                        <td>{createUpgradeLink(match.params.unit,weapon['Upgrade'],match.params.race)}</td>
                    </tr>

                    <tr>
                        <td>Damage Type</td>
                        <td>{weapon['DamageType']}</td>
                    </tr>

                    <tr>
                        <td>Explosion Type</td>
                        <td>{weapon['ExplosionType']}</td>
                    </tr>

                    <tr>
                        <td>Maximum Range</td>
                        <td>{weapon['Maximum Range']}</td>
                    </tr>

                    <tr>
                        <td>Target Attributes</td>
                        <td>{weapon['Target Attributes']}</td>
                    </tr>
                </tbody>
            </table>

        </div>;
}

const Upgrade = ({match}) => {
    const upgrade = allUpgrades.find(upgrade => upgrade.Name == match.params.upgrade);

    const getLevelLabel = (level) => {
        if (upgrade['Maximum Level'] == 1)  {
            return '';
        }
        return <span className='upgrade-stats-page-selector-label'>{level}</span>;
    }

    const getDownLevelLink = ({race, unit, more}) => {
        const level = Number(more || 1);

        if (upgrade['Maximum Level'] == 1)  {
            return '';
        }

        if (level > 1) {
            return <span className="upgrade-stats-page-selector"><Link to={`/race/${match.params.race}/unit/${unit}/upgrade/${upgrade.Name}/${level - 1 }`}><img src='resources/arrow-left.svg' alt="Page 2"/></Link></span>
        }

        return <span className="upgrade-stats-page-selector">
             <img src='resources/arrow-left.svg' className="upgrade-stats-page-selector--active" alt="Page 1"/></span>;
    }   

    const getUpLevelLink = ({race, unit, more}) => {
        const level = Number(more || 1);
        if (upgrade['Maximum Level'] == 1)  {
            return '';
        }

        if (level < upgrade['Maximum Level']) {
            return <span className="upgrade-stats-page-selector"><Link to={`/race/${match.params.race}/unit/${unit}/upgrade/${upgrade.Name}/${level + 1 }`}><img src='resources/arrow-right.svg' alt="Page 2"/></Link></span>
        }

        return <span className="upgrade-stats-page-selector">
             <img src='resources/arrow-right.svg' className="upgrade-stats-page-selector--active" alt="Page 1"/></span>;
    }

    const getLevelLink = (level) => {
        if (level > upgrade['Maximum Level'] || upgrade['Maximum Level'] == 1)  {
            return '';
        }

        return <Link to={`/race/${match.params.race}/unit/${match.params.unit}/upgrade/${upgrade.Name}/${level}`} className='action-item'><span>{level} </span></Link>;
    }
    
    return <div className='upgrade'>
            <span className='unit-header'>Upgrade</span>
            <div style={{float:'right', display:upgrade['Maximum Level'] == 1 ? 'none' : 'block'}}>
                {getDownLevelLink(match.params)}
                {getLevelLabel(match.params.more || 1)}
                {getUpLevelLink(match.params)}
            </div>

            <div><Link to={`/race/${match.params.race}/unit/${match.params.unit}`}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></Link></div>
            

            <div className='upgrade__title'><i className={upgrade.Icon}></i> <span>{upgrade.Name}</span></div> 
            <p className="upgrade__description" dangerouslySetInnerHTML={{__html:createDescriptionContent(upgrade)}}></p>
            
            <table>
                <tbody>
                    <tr>
                        <td>Cost</td>
                        
                        <td>
                            <img src="resources/Mineral.gif" alt="Minerals"/> {upgrade.getMineralCost(match.params.more || 1)}&nbsp;
                            <img src="resources/Vespine.gif" alt="Vespine" /> {upgrade.getVespineCost(match.params.more || 1)} &nbsp;
                        </td>
                    </tr>

                    <tr>
                        <td>Upgrade Time</td>
                        <td>{upgrade.getUpgradeTime(match.params.more || 1)} seconds</td>
                    </tr>

                    <tr>
                        <td>Maximum Level</td>
                        <td>{upgrade['Maximum Level']}</td>
                    </tr>

                    <tr>
                        <td>Upgraded at</td>
                        <td>{createUnitLink(upgrade['Upgraded at'], match.params.race)}</td>
                    </tr>

                    <tr style={{display:upgrade['Maximum Level'] == 1 ? 'none' : 'table-row'}}>
                        <td>Level 2 Requires</td>
                        <td>{createUnitLink(upgrade['Level 2 Requires'], match.params.race)}</td>
                    </tr>

                    <tr style={{display:upgrade['Maximum Level'] == 1 ? 'none' : 'table-row'}}>
                        <td>Level 3 Requires</td>
                        <td>{createUnitLink(upgrade['Level 3 Requires'], match.params.race)}</td>
                    </tr>

                </tbody>
            </table>

        </div>;
}

const Unit = ({match}) => {
    const unit = allUnits.find(unit => unit.Name === match.params.unit);
    const showAdvanced = match.params.more;

    const goBack = (event) => {
        event.preventDefault();
        history.goBack();
    }
    const backLink = () => {
        if (showAdvanced === 'stats') {
            return <Link to={`/race/${match.params.race}/units`}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></Link>;
            // return <Link to={`/race/${match.params.race}/unit/${unit.Name}`}><img className='back-button' src='/resources/backarrow.svg' alt='Back'/></Link>;
        } else if (showAdvanced === 'more') {
            return <Link to={`/race/${match.params.race}/unit/${unit.Name}/stats`}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></Link>;
        } else {
            return <Link to={`/race/${match.params.race}/units`}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></Link>;
        }
    }

    const statSwitcher = () => {
        if (showAdvanced === 'stats') {
        return <div className="unit-stats-page-selector">
            <img src='resources/arrow-left.svg' className="unit-stats-page-selector--active" alt="Page 1"/>
            <Link to={`/race/${match.params.race}/unit/${unit.Name}/more`}><img src='resources/arrow-right.svg' alt="Page 2"/></Link>
        </div>;

        } else if (showAdvanced === 'more') {
            return <div className="unit-stats-page-selector">
                <Link to={`/race/${match.params.race}/unit/${unit.Name}/stats`}><img src='resources/arrow-left.svg' alt="Page 1"/></Link>
                <img src='resources/arrow-right.svg' className="unit-stats-page-selector--active" alt="Page 2"/>
                </div>;
        }
        return '';
    }

    const getDescription = () => {
        if (!unit.Description) return '';
        if (!unit.Link) return unit.Description;
        return unit.Description + ` <a target="_top" href="${unit.Link}">[1]</a>`;
    }

    const tempRedirect = () => {
        if (!showAdvanced) {
            return <Redirect to={`/race/${match.params.race}/unit/${unit.Name}/stats`} />
        }
        return '';
    }

    return <div className='unit'>
        {/* <div><a onClick={goBack} href='#'>Back</a></div> */}
       {tempRedirect()}
       <span className='unit-header'>{unit.isBuilding ? 'Building' : 'Unit'}</span>
        {statSwitcher()}
        <div >{backLink()}</div>
        

        <div className="unit__title" ><i className={unit.Icon}></i> <span>{unit.Name}</span></div> 
        <p style={{display: !showAdvanced ? 'block':'none'}} dangerouslySetInnerHTML={{__html:createDescriptionContent(unit)}}></p>

        <div style={{textAlign:'center'}}>
        <Link className='action-item' to={`/race/${match.params.race}/unit/${unit.Name}/stats`} style={{display: !showAdvanced ? 'block':'none'}}> Show Stats</Link>
        </div>

        <table style={{display:showAdvanced === 'stats' ? 'table':'none'}}>
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

            {
                unit['Ground Weapon'] ? 
                <tr>
                    <td>Ground Weapon</td>
                    <td>{createWeaponLink(unit.Name, unit['Ground Weapon'], match.params.race)}</td>
                </tr> : ''
            }
            
            {
                unit['Air Weapon'] ?
                <tr >
                    <td>Air Weapon</td>
                    <td>{createWeaponLink(unit.Name, unit['Air Weapon'], match.params.race)}</td>
                </tr> : ''
            }
            
            {
                unit['Supply Provided'] ?
                <tr>
                    <td>Supply Provided</td>
                    <td>{""+(unit['Supply Provided']/2)}</td>
                </tr> : ''
            }

            

            <tr>
                <td>Armor</td>
                <td>{unit['Armor']}</td>
            </tr>
            
            { strToArray(unit['Upgrades']).length ? 
                 <tr >
                        <td>Upgrades</td>
                        <td>
                            {
                                strToArray(unit['Upgrades']).map(upgrade => {
                                return <span key={upgrade}>{createUpgradeLink(unit.Name, upgrade, match.params.race)} </span>
                            })}
                        </td>
                </tr> : '' 
            }

            </tbody>
        </table>

        <table style={{display:showAdvanced === 'more' ? 'table':'none'}}>
            <tbody>
                { strToArray(unit['Abilities']).length ?
                    <tr >
                        <td>Abilities</td>
                        <td>
                        {
                            strToArray(unit['Abilities']).map(ability => {
                            return <span key={ability}>{createAbilityLink(unit.Name, ability, match.params.race)}</span>
                        })}
                        </td>
                    </tr> : ''
                }
                <tr>
                    <td>Size</td>
                    <td>{unit['SizeType']}</td>
                </tr>
                { strToArray(unit['Top Speed']).length ?
                    <tr>
                        <td>Speed</td>
                        <td>{unit['Top Speed']}</td>
                    </tr> : ''
                }

                { unit['Sight Range'] ?
                    <tr>
                        <td>Sight Range</td>
                        <td>{unit['Sight Range']}</td>
                    </tr> : ''
                }

                { strToArray(unit['Attributes']).length ? 
                    <tr>
                        <td>Attributes</td>
                        <td><small>{strToArray(unit['Attributes']).join(', ')}</small></td>
                    </tr> : ''
                }

                { strToArray(unit['Required Units']).length ?
                    <tr>
                        <td>Required Units</td>
                        <td>
                        {
                            strToArray(unit['Required Units']).map(requiredUnit => {
                            return <span key={requiredUnit}>{createUnitLink(requiredUnit, match.params.race)} </span>
                        })}</td>
                    </tr> : ''
                }

                { unit['Created By'] ?
                    <tr>
                        <td>Created By</td>
                        <td>{createUnitLink(unit['Created By'], unit.Race)}</td>
                    </tr> : ''
                }

            </tbody>
        </table>

    </div>;
}





const getBuildingListForRace = (race) => {
    const units = allUnits.filter(unit => unit.Race === race);
    return units.filter(unit => unit.isBuilding).map(unit => <span  key={unit.Name} className="text" data-tip={unit.Name}>{createUnitLink(unit.Name, unit.Race)}</span>);
};

const getUnitListForRace = (race) => {
    const units = allUnits.filter(unit => unit.Race === race);
    return units.filter(unit => !unit.isBuilding).map(unit => <span  key={unit.Name} className="text" data-tip={unit.Name}>{createUnitLink(unit.Name, unit.Race)}</span>);
};
const getAbilityListForRace = (race) => {
    
    const abilities = allAbilities.filter(unit => unit.Race === race);
    return abilities.map(ability => <span  key={ability.Name} className="text" data-tip={ability.Name}>{createAbilityLink(ability['Researched at'],ability.Name, ability.Race)}</span>);
}

const getUpgradeListForRace = (race) => {
    
    const upgrades = allUpgrades.filter(unit => unit.Race === race);
    return upgrades.map(upgrade => <span  key={upgrade.Name} className="text" data-tip={upgrade.Name}>{createUpgradeLink(upgrade['Upgraded at'],upgrade.Name, upgrade.Race)}</span>);

}

const Units = ({match}) => {
    const units = allUnits.filter(unit => unit.Race == match.params.race);
    const page = Number(match.params.page || 1);
    
    return <div className='unit-labels-container'>
    <span class="unit-header">{match.params.race.toUpperCase()}</span>
        <Link to={`/race/${match.params.race}`}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></Link>

        <div className="unit-labels-container__switcher">
            <ul>
                <li><Link to={`/race/${match.params.race}/units/1`} className={page === 1 ? 'active':''}>Units</Link></li>
                <li><Link to={`/race/${match.params.race}/units/2`} className={page === 2 ? 'active':''}>Buildings</Link></li>
                <li><Link to={`/race/${match.params.race}/units/3`} className={page === 3 ? 'active':''}>Abilities</Link></li>
                <li><Link to={`/race/${match.params.race}/units/4`} className={page === 4 ? 'active':''}>Upgrades</Link></li>
            </ul>
        </div>

        { page === 1 ? 
            <div className='unit-labels'>
                {getUnitListForRace(match.params.race)}
            </div> : ''
        }

        { page === 2 ? 
            <div className='unit-labels'>
                {getBuildingListForRace(match.params.race)}
            </div> : ''
        }

        { page === 3 ? 
            <div className="unit-labels">
            {getAbilityListForRace(match.params.race)}
            </div>: ''
        }

        { page === 4 ? 
            <div className="unit-labels">
            {getUpgradeListForRace(match.params.race)}
            </div> : ''
        }
        

    </div>;
};

export {
    Units,
    Unit,
    Weapon,
    Upgrade,
    Ability
}