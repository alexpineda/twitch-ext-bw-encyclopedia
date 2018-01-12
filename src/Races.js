import React from 'react';
import { Link } from 'react-router-dom';
const races = require('./bwapi-data/json/races.json');

const RaceItem = ({name, match}) => {
    const race = races.find(race => race.Name === name);

    return <div class='races-list-item'>
        <Link to={`/race/${name}`} style={{color:race.Color}} className='action-item'>{ name }</Link>
    </div>;
}

const Races = (props) => {
    return <div class='races-container'>
        <h6 style={{textAlign:'center',padding:'1em 0 0 0', margin:'0'}}>Learn about </h6>
        <h1 style={{textAlign:'center', marginTop:'0'}}>StarCraft</h1>
        <p className='race-description'>A player can pick one of three unique Races with which to play: The Protoss, Zerg and Terran. All three races have their own qualities and weaknesses as well as units, abilities and gameplay mechanics. <small><a href="http://liquipedia.net/starcraft/StarCraft" target="_top">-Liquipedia</a></small></p>
        <div class='races'>
    
                <RaceItem name="Terran" {...props} />
                <RaceItem name="Protoss" {...props}/>
                <RaceItem name="Zerg" {...props}/>
        </div>
        {/* <p style={{textAlign:'center'}}>Join <a href="https://discord.gg/4BUCZuk">Our Broodwar Discord!</a></p> */}
        </div>
};

const state = {
    showMore: false
};

const Race = ({match}) => {

    const race = races.find(race => race.Name == match.params.race);
    
    const name = '', description = '', liquipedia = '';

    return <div className='race'>
            <Link to="/"><img className='back-button' src='/resources/backarrow.svg' alt='Back'/></Link><Link to={`/race/${race.Name}/units`} className='action-item'>See {race.Name} Units</Link>
            <h1 style={{textAlign:'center'}}>{race.Name}</h1>
            <p>{race.Description}</p>
            <p style={{textAlign:'center'}}><Link to={`/race/${race.Name}/units`} className='action-item'>See {race.Name} Units</Link></p>
            <p style={{textAlign:'center'}}>or</p>
            <p className="action-item" style={{textAlign:'center'}}><Link to={`/compare/${race.Name}`}>Compare Units</Link></p>
        </div>;
}

export {
    Race,
    Races
};