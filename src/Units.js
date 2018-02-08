import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { isBuffer } from 'util';

import { allAbilities, allUnits, allUpgrades, createAbilityLink, createDescriptionContent, createUnitLink, createUpgradeLink, createWeaponLink, strToArray } from './shared';

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
        
        <div>
            <p>Quick Facts</p>
            <div>

            </div>
        </div>

    </div>;
};

export default Units;