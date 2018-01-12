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

const createWeaponLink = (unitName, weaponName, race) => {
    let extra = '';
    switch (weaponName){
        case 'Psi Blades x 2':
            weaponName = 'Psi Blades';
            extra = ' (x2)';
            break;
        case 'Flame Thrower x 3':
            weaponName = 'Flame Thrower';
            extra = ' (x3)';
            break;
        case 'Halo Rockets x 4':
            weaponName = 'Halo Rockets';
            extra = ' (x4)';
            break;
        default:
    }
    const weapon = allWeapons.find(weapon => weapon.Name === weaponName);
    if (!weapon) return "N/A";

    return <Link to={`/race/${race}/unit/${unitName}/weapon/${weapon.Name}`} title={weapon.Name}><i className={weapon.Icon}></i>{extra}</Link>
};

const createUpgradeLink = (unitName, upgradeName, race) => {
    const upgrade = allUpgrades.find(upgrade => upgrade.Name === upgradeName);
    if (!upgrade) return "";
    return <Link to={`/race/${race}/unit/${unitName}/upgrade/${upgrade.Name}`} title={upgrade.Name}><i className={upgrade.Icon}></i></Link>
};

const createAbilityLink = (unitName, abilityName, race) => {
    const ability = allAbilities.find(ability => ability.Name === abilityName);
    return <Link to={`/race/${race}/unit/${unitName}/ability/${ability.Name}`} title={ability.Name}><i className={ability.Icon}></i></Link>
};

const createUnitLink = (unitName, race) => {
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

    return <Link to={`/race/${race}/unit/${unitName}`} title={unitName}><i className={unit.Icon}></i>{extra}</Link>
};


const Ability = ({match}) => {
    const ability = allAbilities.find(ability => ability.Name == match.params.ability);

    return <div className='ability'>
            <div><Link to={`/race/${match.params.race}/unit/${match.params.unit}`}><img className='back-button' src='/resources/backarrow.svg' alt='Back'/></Link></div>
            <div className="ability__title"><i className={ability.Icon}></i> {ability.Name}</div>
            <dl>
                <dt>Cost</dt>
                <dd>{ability['Cost']}</dd>

                <dt>Research Time</dt>
                <dd>{ability['Research Time']}</dd>

                <dt>Energy Cost</dt>
                <dd>{ability['Energy Cost']}</dd>

                <dt>Researched at</dt>
                <dd>{createUnitLink(ability['Researched at'], match.params.race)}</dd>

                <dt>Targets</dt>
                <dd>{ability['Targets']}</dd>
           
            </dl>
        </div>;
}

const Weapon = ({match}) => {
    const weapon = allWeapons.find(weapon => weapon.Name == match.params.weapon);

    return <div className='weapon'>
            <div><Link to={`/race/${match.params.race}/unit/${match.params.unit}`}><img className='back-button' src='/resources/backarrow.svg' alt='Back'/></Link></div>
            <div className="weapon__title"><i className={weapon.Icon}></i> {weapon.Name}</div>

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

    return <div className='upgrade'>
            <div><Link to={`/race/${match.params.race}/unit/${match.params.unit}`}><img className='back-button' src='/resources/backarrow.svg' alt='Back'/></Link></div>
            <div className='upgrade__title'><i className={upgrade.Icon}></i> {upgrade.Name}</div> 
            <dl>
                <dt>Cost</dt>
                <dd>{upgrade['Cost']}</dd>

                <dt>Upgrade Time</dt>
                <dd>{upgrade['Upgrade Time']}</dd>

                <dt>Maximum Level</dt>
                <dd>{upgrade['Maximum Level']}</dd>

                <dt>Upgraded at</dt>
                <dd>{createUnitLink(upgrade['Upgraded at'], match.params.race)}</dd>

                <dt>Level 2 Requires</dt>
                <dd>{createUnitLink(upgrade['Level 2 Requires'], match.params.race)}</dd>

                <dt>Level 3 Requires</dt>
                <dd>{createUnitLink(upgrade['Level 3 Requires'], match.params.race)}</dd>

            </dl>
        </div>;
}

const Unit = ({match}) => {
    const unit = allUnits.find(unit => unit.Name === match.params.unit);
    const showAdvanced = match.params.more;

    const backLink = () => {
        if (showAdvanced) {
            return <Link to={`/race/${match.params.race}/unit/${unit.Name}`}><img className='back-button' src='/resources/backarrow.svg' alt='Back'/></Link>;
        } else {
            return <Link to={`/race/${match.params.race}/units`}><img className='back-button' src='/resources/backarrow.svg' alt='Back'/></Link>;
        }
    }

    ///24 frames per second fastest
    console.log('bt',unit['Build Time']);

    const cost = unit.Cost.match(/([0-9]+)\s+([0-9]+)\s+([0-9]+)/);
    // const buildTime = Math.round(((unit['Build Time']||'0 frames').match(/([0-9]+)\s+frames/)[1] || 0)/24,2);

    return <div className='unit'>
        <div>{backLink()}</div>
        <div className="unit__title" ><i className={unit.Icon}></i> {unit.Name}</div> 
        <table style={{display:showAdvanced ? 'none':'block'}}>
            <tbody>
            <tr>
                <td>Hit Points</td>
                <td>{unit['Hit Points']}</td>
            </tr>

            <tr style={{display:unit['Cost']?'':'none'}}>
                <td>Cost</td>
                <td>
                <img src="/resources/Mineral.gif" alt="Minerals"/> {unit['Mineral Cost']}&nbsp;
                <img src="/resources/Vespine.gif" alt="Vespine" /> {unit['Vespine Cost']} &nbsp;
                <img src={`/resources/Supply_${unit.Race}.png`} alt="Supply" /> {unit['Supply Cost']}</td>
            </tr>

            <tr>
                <td>Build Time</td>
                <td>{unit['Build Time']} seconds (fastest)</td>
            </tr>

            <tr style={{display:unit['Ground Weapon']?'':'none'}}>
                <td>Ground Weapon</td>
                <td>{createWeaponLink(unit.Name, unit['Ground Weapon'], match.params.race)}</td>
            </tr>

            <tr style={{display:unit['Air Weapon']?'':'none'}}>
                <td>Air Weapon</td>
                <td>{createWeaponLink(unit.Name, unit['Air Weapon'], match.params.race)}</td>
            </tr>

            <tr style={{display:unit['Supply Provided'] ? '' :'none'}}>
                <td>Supply Provided</td>
                <td>{""+(unit['Supply Provided']/2)}</td>
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
return units.map(unit => <span  key={unit.Name} className="text">{createUnitLink(unit.Name, unit.Race)}</span>);
};

const Units = ({match}) => {
    const units = allUnits.filter(unit => unit.Race == match.params.race);
    const page = Number(match.params.page || 0);
    
    return <div className='unit-labels-container'>
        <Link to={`/race/${match.params.race}`}><img className='back-button' src='/resources/backarrow.svg' alt='Back'/></Link>

        <div className='unit-labels'>
            {getUnitList(units, page, match)}
        </div>

    </div>;
};

export {
    Units,
    Unit,
    Weapon,
    Upgrade,
    Ability
}