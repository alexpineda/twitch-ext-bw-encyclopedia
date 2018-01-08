import React from 'react';
import { Link } from 'react-router-dom'
const races = require('broodwar-json/json/races.json');

const RaceItem = ({name, match}) => {
    return <p><Link to={`/race/${name}`}>{ name }</Link></p>;
}

const Races = (props) => {
    return <div>
                <RaceItem name="Terran" {...props} />
                <RaceItem name="Protoss" {...props}/>
                <RaceItem name="Zerg" {...props}/>
        </div>
};

const state = {
    showMore: false
};

const Race = ({match}) => {

    const race = races.find(race => race.Name == match.params.race);
    
    const name = '', description = '', liquipedia = '';

    return <div>
            <Link to="/">Back</Link>
            <p>{race.Name}</p>
            <p>{race.Description}</p>
            <div><Link to={`/race/${race.Name}/units`}>Units</Link></div>
            <div><Link to="{liquipedia}">Liquipedia</Link></div>
            <div>More..</div>
            <dl>
                <dt>Refinery</dt>
                <dd>{race.Refinery}</dd>
                <dt>Resource Depot</dt>
                <dd>{race['Resource Depot']}</dd>
                <dt>Supply Provider</dt>
                <dd>{race['Supply Provider']}</dd>
                <dt>Transport</dt>
                <dd>{race.Transport}</dd>
                <dt>Worker</dt>
                <dd>{race.Worker}</dd>
            </dl>
        </div>;
}

export {
    Race,
    Races
};