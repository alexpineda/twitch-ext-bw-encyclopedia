
import React from 'react';
import { Link, Redirect } from 'react-router-dom';

const FPS = 23.81;

export const allWeapons = require('./bwapi-data/json/weapons.json');
  

export const allUpgrades = require('./bwapi-data/json/upgrades.json')
  .map(upgrade => {
    upgrade['Maximum Level'] = upgrade['Maximum Level'] || 1;


    ///4000 + lvl*480 frames
    const upgradeTime = upgrade['Upgrade Time'].match(/([0-9]+)\s+[+]\s+lvl\*([0-9]+)/);
    if (upgradeTime) {
      upgrade['Upgrade Time Base'] = Number(upgradeTime[1]);
      upgrade['Upgrade Time Multiplier'] = Number(upgradeTime[2]);
    } else {
      const upgradeTime = upgrade['Upgrade Time'].match(/([0-9]+)\s+frames/);
      upgrade['Upgrade Time Base'] = Number(upgradeTime[1]);
      upgrade['Upgrade Time Multiplier'] = 0;
    }

    upgrade.getUpgradeTime = (level) => {
      if (level > upgrade['Maximum Level']) {
        return null;
      }
      return Math.ceil((upgrade['Upgrade Time Base'] + ((level-1) * upgrade['Upgrade Time Multiplier']))/FPS);
    }

    const cost = upgrade.Cost.match(/([0-9]+)\s+[+]\slvl\*([0-9]+)\s+([0-9]+)\s+[+]\slvl\*([0-9]+)/);

    if (cost) {
      upgrade['Base Mineral Cost'] = Number(cost[1]);
      upgrade['Mineral Cost Multiplier'] = Number(cost[2]);
      upgrade['Base Vespine Cost'] = Number(cost[3]);
      upgrade['Vespine Cost Multiplier'] = Number(cost[4]);
    } else {
      const cost = upgrade.Cost.match(/([0-9]+)\s+([0-9]+)/);
      upgrade['Base Mineral Cost'] = Number(cost[1]);
      upgrade['Mineral Cost Multiplier'] = 0;
      upgrade['Base Vespine Cost'] = Number(cost[2]);
      upgrade['Vespine Cost Multiplier'] = 0;
    }

    upgrade.getMineralCost = (level) => {
      if (level > upgrade['Maximum Level']) {
        return null;
      }

      return upgrade['Base Mineral Cost'] + ((level-1) * upgrade['Mineral Cost Multiplier']);
    }

    upgrade.getVespineCost = (level) => {
      if (level > upgrade['Maximum Level']) {
        return null;
      }

      return upgrade['Base Vespine Cost'] + ((level-1) * upgrade['Vespine Cost Multiplier']);
    }

    return upgrade;
  });

export const allAbilities = require('./bwapi-data/json/abilities.json')
  .map(ability => {

    if (ability.Cost) {
      const cost = ability.Cost.match(/([0-9]+)\s+([0-9]+)/);
      ability['Mineral Cost'] = cost[1];
      ability['Vespine Cost'] = cost[2];
    } else {
      ability['Mineral Cost'] = 0;
      ability['Vespine Cost'] = 0;
    }

    

    if (ability['Research Time']) {
      const researchTime = ability['Research Time'].match(/([0-9]+)\s+frames/);
      ability['Research Time'] = researchTime ? Math.round(Number(researchTime[1])/FPS) : 0;
    }

    return ability;
  })

const isBuilding = (unit) => {
    if (!unit.Attributes) {
        return false;
    }
    if (!Array.isArray(unit.Attributes)){
        unit.Attributes = [unit.Attributes];
    }
    return !!unit.Attributes.filter(attr => attr === 'Building').length;
};

const isWorker = (unit) => {
  if (!unit.Attributes) {
      return false;
  }
  if (!Array.isArray(unit.Attributes)){
      unit.Attributes = [unit.Attributes];
  }
  return !!unit.Attributes.filter(attr => attr === 'Worker').length;
};

export const allUnits = require('./bwapi-data/json/units.json')
    .filter(unit=>unit.Race !== 'None')
    .map(unit => {
        const cost = unit.Cost.match(/([0-9]+)\s+([0-9]+)\s+([0-9]+)/);
        unit['Mineral Cost'] = cost[1];
        unit['Vespine Cost'] = cost[2];
        unit['Supply Cost'] = cost[3]/2;
        if (unit['Supply Provided']) {
          unit['Supply Provided'] = unit['Supply Provided']/2;
        }

        unit['Build Time Frames'] = Number((unit['Build Time']||'').match(/([0-9]+)\s+frames/)[1] || 0);
        unit['Build Time'] = Math.round(((unit['Build Time']||'').match(/([0-9]+)\s+frames/)[1] || 0)/FPS,2);
        unit['Seek Range'] = unit['Seek Range']/32;
        unit['Sight Range'] = unit['Sight Range']/32;
        unit.isBuilding = isBuilding(unit);
        unit.isWorker = isWorker(unit);

        if (unit['Ground Weapon']) {
          unit.groundWeapon = allWeapons.find(weapon => weapon.Name === unit['Ground Weapon']);
        }
        if (unit['Air Weapon']) {
          unit.airWeapon = allWeapons.find(weapon => weapon.Name === unit['Air Weapon']);
        }
        return unit;
    });


    allUnits.map(unit => {
      if (unit.isBuilding) {
        unit.Builds = allUnits.filter(unit => unit["Created By"] === unit.Name);
      } 
      return unit;
    });

export const strToArray = (strOrArray) => {
    if (!strOrArray) return [];

    if (typeof strOrArray === 'string') {
        return  [strOrArray];
    }
    return strOrArray;
}
    
export const createDescriptionContent= (unit) => {
    if (!unit.Description) return '';
    if (!unit.Link) return unit.Description;
    return unit.Description + ` <a target="_top" href="${unit.Link}">[1]</a>`;
}
    
export const createWeaponLink = (unitName, weaponName, race) => {
    
    const weapon = allWeapons.find(weapon => weapon.Name === weaponName);
    if (!weapon) return "N/A";

    let extra = '';
    if (weapon.Multiplier) {
        extra = ` (x${weapon.Multiplier})`
    }
    return <Link to={`/race/${race}/unit/${unitName}/weapon/${weapon.Name}`} title={weapon.Name} data-tip={weapon.Name}><i className={weapon.Icon}></i>{extra}</Link>
};

export const createUpgradeLink = (unitName, upgradeName, race) => {
    const upgrade = allUpgrades.find(upgrade => upgrade.Name === upgradeName);
    if (!upgrade) return "";
    return <Link to={`/race/${race}/unit/${unitName}/upgrade/${upgrade.Name}`} title={upgrade.Name} data-tip={upgrade.Name}><i className={upgrade.Icon}></i></Link>
};
    
export const createAbilityLink = (unitName, abilityName, race) => {
    const ability = allAbilities.find(ability => ability.Name === abilityName);
    return <Link to={`/race/${race}/unit/${unitName}/ability/${ability.Name}`} title={ability.Name} data-tip={ability.Name}><i className={ability.Icon}></i></Link>
};
    
export const createUnitLink = (unitName, race) => {
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

    return <Link to={`/race/${race}/unit/${unitName}`} title={unitName} data-tip={unit.Name} >{createUnitIcon(unitName, race)}{extra}</Link>;
};

export const createUnitIcon = (unitName, race) => {
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

  return <i className={unit.Icon}></i>;
};

export const getUnitLink = (unitName, race) => {
  if (!unitName) return '';
  return `/race/${race}/unit/${unitName}/stats`;
};
    
