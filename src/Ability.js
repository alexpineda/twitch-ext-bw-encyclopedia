import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { allAbilities, createUnitLink, createDescriptionContent } from './shared';

const Ability = ({match, history}) => {
    const ability = allAbilities.find(ability => ability.Name == match.params.ability);
    const showAdvanced = match.params.more;

    const statSwitcher = () => {
        if (!showAdvanced) {
            return <div className="unit-stats-page-selector">
                <img src='resources/arrow-left.svg' className="unit-stats-page-selector--active" alt="Page 1"/>
                <Link to={`/race/${match.params.race}/unit/${match.params.unit}/ability/${ability.Name}/more`}><img src='resources/arrow-right.svg' alt="Page 2"/></Link>
            </div>;
        } else if (showAdvanced === 'more') {
            return <div className="unit-stats-page-selector">
                <Link to={`/race/${match.params.race}/unit/${match.params.unit}/ability/${ability.Name}`}><img src='resources/arrow-left.svg' alt="Page 1" /></Link>
                <img src='resources/arrow-right.svg' className="unit-stats-page-selector--active" alt="Page 2"/>
                </div>;
        }
        return '';
    }

    const goBack = (event) => {
        event.preventDefault();
        history.goBack();   
    }

    const abilityRows = [
        <tr key="cost">
            <td>Cost</td>
            <td>
                <img src="resources/Mineral.gif" alt="Minerals"/> {ability['Mineral Cost']}&nbsp;
                <img src="resources/Vespine.gif" alt="Vespine" /> {ability['Vespine Cost']} &nbsp;
            </td>
        </tr>,
        ability['Research Time'] ? <tr  key="rt">
            <td>Research Time</td>
            <td>{ability['Research Time']} seconds</td>
        </tr> : null,
        ability['Energy Cost'] ? <tr  key="ec">
            <td>Energy Cost</td>
            <td>{ability['Energy Cost']}</td>
        </tr> : null,
        ability['Duration'] ? <tr  key="d">
            <td>Duration</td>
            <td>{ability.Duration}</td>
        </tr> : null,
        ability['Researched at'] ? <tr  key="ra">
            <td>Researched at</td>
            <td>{createUnitLink(ability['Researched at'], match.params.race)}</td>
        </tr> : null,
        ability['Targets'] ? <tr  key="t">
            <td>Targets</td>
            <td>{ability['Targets']}</td>
        </tr> : null
    ];

    return <div className='ability'>
            {statSwitcher()}
            <div><a href="#back" onClick={goBack}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></a></div>
            
            <span className='unit-header'><Link to={`/race/${match.params.race}/units`}>Ability</Link></span>
            <div className="ability__title"><i className={ability.Icon}></i> <span>{ability.Name}</span></div>

            <div style={{display: !showAdvanced ? 'inherit':'none'}}> 
                <p  dangerouslySetInnerHTML={{__html:createDescriptionContent(ability)}} className="ability__description"></p>
                <div className="ability-image"> 
                    <img src={`resources/Abilities/${ability.Name}.gif`} alt={ability.Name} />
                </div>
            </div>
                
            <table style={{display: showAdvanced ? 'inherit':'none'}}>
                <tbody>
                    {abilityRows.filter(x => x).map(x=>x)}
                </tbody>
            </table>
        </div>;
}

export default Ability;