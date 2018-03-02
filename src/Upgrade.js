import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { allUpgrades, createDescriptionContent, createUnitLink } from './shared';

const Upgrade = ({match, history}) => {
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
    
    const goBack = (event) => {
        event.preventDefault();
        history.goBack();   
    }

    return <div className='upgrade'>
            <span className='unit-header'><Link to={`/race/${match.params.race}/units`}>Upgrade</Link></span>
            <div style={{float:'right', display:upgrade['Maximum Level'] == 1 ? 'none' : 'block'}}>
                {getDownLevelLink(match.params)}
                {getLevelLabel(match.params.more || 1)}
                {getUpLevelLink(match.params)}
            </div>

            <div><a href="#back" onClick={goBack}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></a></div>
            
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

export default Upgrade;