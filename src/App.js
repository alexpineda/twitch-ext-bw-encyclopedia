import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Race, Races } from './Races';
import { Unit, Units, Weapon, Upgrade, Ability } from './Units';
import { Links } from './Extra';
import Compare from './Compare';

import { HashRouter as Router, Route, Link } from 'react-router-dom'
import history from './history';
import ReactGA from 'react-ga';
import logger from 'redux-logger';
import Thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {
  ConnectedRouter,
  routerMiddleware,
} from 'react-router-redux';

import reducers from './reducers';



const allWeapons = require('./bwapi-data/json/weapons.json');
const allUpgrades = require('./bwapi-data/json/upgrades.json');
const allAbilities = require('./bwapi-data/json/abilities.json');

const allUnits = require('./bwapi-data/json/units.json')
    .filter(unit=>unit.Race !== 'None')
    .map(unit => {
        const cost = unit.Cost.match(/([0-9]+)\s+([0-9]+)\s+([0-9]+)/);
        unit['Mineral Cost'] = cost[1];
        unit['Vespine Cost'] = cost[2];
        unit['Supply Cost'] = cost[3]/2;

        unit['Build Time'] = Math.round(((unit['Build Time']||'').match(/([0-9]+)\s+frames/)[1] || 0)/24,2);
        unit['Seek Range'] = unit['Seek Range']/32;
        unit['Sight Range'] = unit['Sight Range']/32;
        return unit;
    });

// history

// commenting for dev :)
// history.listen((location, action) => {
//   logPageView(location);
// });

// store
const store = createStore(
  reducers,
  applyMiddleware(Thunk, routerMiddleware(history), logger)
);

// good for debugging
window.store = store;

// analytics
ReactGA.initialize('UA-107337039-1');
function logPageView(location) {
  ReactGA.set({ page: location.pathname + location.search });
  ReactGA.pageview(location.pathname + location.search);
}


class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <Router>
        <div id='twitch-extension'>
         <Route exact path="/" component={Races}/>
         <Route exact path="/links" component={Links}/>
         <Route exact path="/race/:race" component={Race}/>
         <Route exact path="/race/:race/units" component={Units}/>
         <Route exact path="/race/:race/units/:page" component={Units}/>
         <Route exact path="/race/:race/unit/:unit" component={Unit}/>
         <Route exact path="/race/:race/unit/:unit/:more" component={Unit}/>
         <Route exact path="/race/:race/unit/:unit/weapon/:weapon" component={Weapon}/>
         <Route exact path="/race/:race/unit/:unit/weapon/:weapon/:more" component={Weapon}/>
         <Route exact path="/race/:race/unit/:unit/upgrade/:upgrade" component={Upgrade}/>
         <Route exact path="/race/:race/unit/:unit/upgrade/:upgrade/:more" component={Upgrade}/>
         <Route exact path="/race/:race/unit/:unit/ability/:ability" component={Ability}/>
         <Route exact path="/race/:race/unit/:unit/ability/:ability/:more" component={Ability}/>
         <Route exact path="/compare" component={Compare}/>
         <Route exact path="/compare/:race" component={Compare}/>
        </div>
      </Router>
      </Provider>
    );
  }
}

export default App;