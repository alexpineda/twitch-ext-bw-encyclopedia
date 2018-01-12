import React from 'react';
import { Link } from 'react-router-dom';

const Links = () => {
    return <div>
        <Link to="/">Back</Link>
        <ul>
            
            <li><a href="http://liquipedia.net/starcraft/Main_Page">Liquipedia</a></li>
            <li><a href="http://www.teamliquid.net/">Team Liquid</a></li>
            <li><a href="http://reddit.com/r/broodwar">/r/broodwar</a></li>
            <li><a href="http://sctools.tv">SCTools.TV</a></li>
            <li><a href="https://discord.gg/4BUCZuk">Foreign Broodwar Discord</a></li>
            <li><a href="https://discord.gg/4BUCZuk">Foreign Rankings</a></li>

        </ul>

    </div>
}

export {
    Links
}