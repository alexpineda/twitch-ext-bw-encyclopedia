import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Race, Races } from './Races';
import { Unit, Units, Weapon, Upgrade, Ability } from './Units';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const races = require('broodwar-json/json/races.json');
const units = require('broodwar-json/json/units.json');
const upgrades = require('broodwar-json/json/upgrades.json');
const weapons = require('broodwar-json/json/weapons.json');

class App extends Component {
  render() {
    return (
      <Router>
        <div>
         <Route exact path="/" component={Races}/>
         <Route exact path="/race/:race" component={Race}/>
         <Route exact path="/race/:race/units" component={Units}/>
         <Route exact path="/race/:race/units/:unit" component={Unit}/>
         <Route exact path="/race/:race/units/:unit/weapon/:weapon" component={Weapon}/>
         <Route exact path="/race/:race/units/:unit/upgrade/:upgrade" component={Upgrade}/>
         <Route exact path="/race/:race/units/:unit/ability/:ability" component={Ability}/>
        </div>
      </Router>
    );
  }
}

export default App;