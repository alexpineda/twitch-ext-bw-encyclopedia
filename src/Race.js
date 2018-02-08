import React from 'react';
import { Link } from 'react-router-dom';
const races = require('./bwapi-data/json/races.json');

const Race = ({match}) => {

    const race = races.find(race => race.Name === match.params.race);
    
    const name = '', description = '', liquipedia = '';

    return <div className={`race ${race.Name}`}>
            <Link to="/"><img className='back-button' src='resources/backarrowwhite.svg' alt='Back'/></Link>
            <p className="race__title">{race.Name}</p>
            <div className='race__description'>
                <p>{race.Description}</p> 
                <p style={{textAlign:'center'}}><Link to={`/race/${race.Name}/units`} className='action-item action-item--negative'>See {race.Name} Units, Buildings, Abilities and Upgrades</Link></p>
            </div>
            
            {/* <p style={{textAlign:'center'}}>or</p>
            <p className="action-item" style={{textAlign:'center'}}><Link to={`/compare/${race.Name}`}>Compare Units</Link></p> */}
        </div>;
}

export default Race;