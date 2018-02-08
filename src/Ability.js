import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { allAbilities, createUnitLink, createDescriptionContent } from './shared';

const Ability = ({match}) => {
    const ability = allAbilities.find(ability => ability.Name == match.params.ability);

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
            <div><Link to={`/race/${match.params.race}/unit/${match.params.unit}`}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></Link></div>
            <span className='unit-header'>Ability</span>
            <div className="ability__title"><i className={ability.Icon}></i> <span>{ability.Name}</span></div>
            <p className="ability__description" dangerouslySetInnerHTML={{__html:createDescriptionContent(ability)}}></p>
            <table>
                <tbody>
                    {abilityRows.filter(x => x).map(x=>x)}
                </tbody>
            </table>
        </div>;
}

export default Ability;