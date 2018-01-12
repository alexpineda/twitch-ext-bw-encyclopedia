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

const createWeaponLink = (unitName, weaponName, race) => {
    console.log('weaponName', weaponName);
    const weapon = allWeapons.find(weapon => weapon.Name === weaponName);
    if (!weapon) return "N/A";

    return <Link to={`/race/${race}/unit/${unitName}/weapon/${weapon.Name}`} title={weapon.Name}><i className={weapon.Icon}></i></Link>
};

const createUpgradeLink = (unitName, upgradeName, race) => {
    const upgrade = allUpgrades.find(upgrade => upgrade.Name === upgradeName);
    return <Link to={`/race/${race}/unit/${unitName}/upgrade/${upgrade.Name}`} title={upgrade.Name}><i className={upgrade.Icon}></i></Link>
};

const createAbilityLink = (unitName, abilityName, race) => {
    const ability = allAbilities.find(ability => ability.Name === abilityName);
    return <Link to={`/race/${race}/unit/${unitName}/ability/${ability.Name}`} title={ability.Name}><i className={ability.Icon}></i></Link>
};

const createUnitLink = (unitName, race) => {
    const unit = allUnits.find(unit => unit.Name == unitName);

    return <Link to={`/race/${race}/unit/${unitName}`} title={unitName}><i className={unit.Icon}></i></Link>
};


const Ability = ({match}) => {
    const ability = allAbilities.find(ability => ability.Name == match.params.ability);

    return <div>
            <div><Link to={`/race/${match.params.race}/unit/${match.params.unit}`}>Back</Link></div>
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
            <div><Link to={`/race/${match.params.race}/unit/${match.params.unit}`}>Back</Link></div>
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
            <div><Link to={`/race/${match.params.race}/unit/${match.params.unit}`}>Back</Link></div>
            <span><i className={upgrade.Icon}></i>{upgrade.Name}</span>
            <dl>
                <dt>Cost</dt>
                <dd>{upgrade['Cost']}</dd>

                <dt>Upgrade Time</dt>
                <dd>{upgrade['Upgrade Time']}</dd>

                <dt>Maximum Level</dt>
                <dd>{upgrade['Maximum Level']}</dd>

                <dt>Upgraded at</dt>
                <dd><span><Link to={`/race/${match.params.race}/unit/${upgrade['Upgraded at']}`} >{upgrade['Upgraded at']}</Link> </span>
                </dd>

                <dt>Level 2 Requires</dt>
                <dd><span><Link to={`/race/${match.params.race}/unit/${upgrade['Level 2 Requires']}`} >{upgrade['Level 2 Requires']}</Link> </span></dd>

                <dt>Level 3 Requires</dt>
                <dd><span><Link to={`/race/${match.params.race}/unit/${upgrade['Level 3 Requires']}`} >{upgrade['Level 2 Requires']}</Link> </span></dd>

            </dl>
        </div>;
}

const Unit = ({match}) => {
    const unit = allUnits.find(unit => unit.Name === match.params.unit);
    const showAdvanced = match.params.more;

    const backLink = () => {
        if (showAdvanced) {
            return <Link to={`/race/${match.params.race}/unit/${unit.Name}`}>Back</Link>;
        } else {
            return <Link to={`/race/${match.params.race}/units`}>Back</Link>;
        }
    }
    return <div >
        <div>{backLink()}</div>
        <span><i className={unit.Icon}></i>{unit.Name}</span> 
        <table style={{display:showAdvanced ? 'none':'block'}}>
            <tbody>
            <tr>
                <td>Hit Points</td>
                <td>{unit['Hit Points']}</td>
            </tr>

            <tr style={{display:unit['Cost']?'':'none'}}>
                <td>Cost</td>
                <td>{unit['Cost']}</td>
            </tr>

            <tr>
                <td>Build Time</td>
                <td>{unit['Build Time']}</td>
            </tr>

            <tr style={{display:unit['Ground Weapon']?'':'none'}}>
                <td>Ground Weapon</td>
                <td>{createWeaponLink(unit.Name, unit['Ground Weapon'], match.params.race)}</td>
            </tr>

            <tr style={{display:unit['Air Weapon']?'':'none'}}>
                <td>Air Weapon</td>
                <td>{createWeaponLink(unit.Name, unit['Air Weapon'], match.params.race)}</td>
            </tr>

            <tr style={{display:strToArray(unit['Abilities']).length ? '' : 'none'}}>
                <td>Abilities</td>
                <td>
                {
                    strToArray(unit['Abilities']).map(ability => {
                    return <span key={ability}>{createAbilityLink(unit.Name, ability, match.params.race)}</span>
                })}
                </td>
            </tr>

            <tr style={{display:strToArray(unit['Required Units']).length ? '' : 'none'}}>
                <td>Required Units</td>
                <td>
                {
                    strToArray(unit['Required Units']).map(requiredUnit => {
                    return <span key={requiredUnit}>{createUnitLink(requiredUnit, match.params.race)} </span>
                })}</td>
            </tr>
            </tbody>
        </table>

        <Link to={`/race/${match.params.race}/unit/${unit.Name}/more`} style={{display:showAdvanced ? 'none':'block'}}> Show Advanced</Link>

        <table style={{display:showAdvanced ? 'block':'none'}}>
            <tbody>
                <tr style={{display:strToArray(unit['Upgrades']).length ? '' : 'none'}}>
                    <td>Upgrades</td>
                    <td>
                        {
                            strToArray(unit['Upgrades']).map(upgrade => {
                            return <span key={upgrade}>{createUpgradeLink(unit.Name, upgrade, match.params.race)} </span>
                        })}
                    </td>
                </tr>

                <tr>
                    <td>Armor</td>
                    <td>{unit['Armor']}</td>
                </tr>

                <tr>
                    <td>Size</td>
                    <td>{unit['SizeType']}</td>
                </tr>
                <tr style={{display:strToArray(unit['Top Speed']).length ? '' : 'none'}}>
                    <td>Speed</td>
                    <td>{unit['Top Speed']}</td>
                </tr>
                <tr style={{display:unit['Sight Range']?'':'none'}}>
                    <td>Sight Range</td>
                    <td>{unit['Sight Range']}</td>
                </tr>
                <tr style={{display:unit['Seek Range']?'':'none'}}>
                    <td>Seek Range</td>
                    <td>{unit['Seek Range']}</td>
                </tr>
                <tr style={{display:strToArray(unit['Attributes']).length ? '' : 'none'}}>
                    <td>Attributes</td>
                    <td><small>{strToArray(unit['Attributes']).join(', ')}</small></td>
                </tr>

                <tr>
                    <td>Created By</td>
                    <td>{createUnitLink(unit['Created By'], unit.Race)}</td>
                </tr>

            </tbody>
        </table>


    </div>;
}

const getUnitList = (units, start, match) => {
return units.map(unit => <span className="text">{createUnitLink(unit.Name, unit.Race)}</span>);
    // const showUnits =  units.slice(start, start+3);
    
    // return showUnits.map(unit => {
    //     return <div className='unit-label' key={unit.Name} ><Link to={`/race/${match.params.race}/unit/${unit.Name}`} ><span><i className={unit.Icon}></i>{unit.Name}</span></Link></div>
    // });

};

const Units = ({match}) => {
    const units = allUnits.filter(unit => unit.Race == match.params.race);
    const page = Number(match.params.page || 0);
    const nextPage = page+1;
    const prevPage = Math.max(0,page-1);

    return <div className='unit-labels-container'>
        <Link to={`/race/${match.params.race}`}>Back</Link>
        <div className='unit-labels'>
            {getUnitList(units, page, match)}
        </div>

        <Link to={`/race/${match.params.race}/units/${prevPage}`}>Prev</Link>
        <Link to={`/race/${match.params.race}/units/${nextPage}`}>Next</Link>
    </div>;
};

export {
    Units,
    Unit,
    Weapon,
    Upgrade,
    Ability
}