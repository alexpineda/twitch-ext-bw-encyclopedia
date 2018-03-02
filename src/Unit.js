import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { allUnits, createDescriptionContent, createUnitLink, createWeaponLink, createUpgradeLink, createAbilityLink, strToArray } from './shared';
import * as ImagesPromise from 'react-images-preload';

const Unit = ({match, history}) => {
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
        if (!showAdvanced) {
            return <div className="unit-stats-page-selector">
                <img src='resources/arrow-left.svg' className="unit-stats-page-selector--active" alt="Page 1"/>
                <Link to={`/race/${match.params.race}/unit/${unit.Name}/stats`}><img src='resources/arrow-right.svg' alt="Page 2"/></Link>
            </div>;
        } else if (showAdvanced === 'stats') {
            return <div className="unit-stats-page-selector">
                <Link to={`/race/${match.params.race}/unit/${unit.Name}/`}><img src='resources/arrow-left.svg' alt="Page 2"/></Link>
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

    return <div className='unit'>
       <span className='unit-header'><Link to={`/race/${match.params.race}/units`}>{unit.isBuilding ? 'Building' : 'Unit'}</Link></span>
        {statSwitcher()}
        {/* <div >{backLink()}</div> */}
        <div><a href="#back" onClick={goBack}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></a></div>

        <div className="unit__title" ><i className={unit.Icon}></i> <span>{unit.Name}</span></div> 

        <div style={{display: !showAdvanced ? 'inherit':'none'}}> 
        <p  dangerouslySetInnerHTML={{__html:createDescriptionContent(unit)}} className="unit__description"></p>
        <div className="unit-image"> 
            <img src={`resources/Units/${unit.Name}.gif`} alt={unit.Name} />
        </div>
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
                    <td>{""+(unit['Supply Provided'])}</td>
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

export default Unit;