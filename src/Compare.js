import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const allUnits = require('./bwapi-data/json/units.json');

const allWeapons = require('./bwapi-data/json/weapons.json');
const allUpgrades = require('./bwapi-data/json/upgrades.json');
const allAbilities = require('./bwapi-data/json/abilities.json');

const compareOptions = [
    "Hit Points",
    "Armor",
    "Mineral Cost",
    "Vespine Cost",
    "Supply Cost",
    "Build Time",
    "Top Speed",
    "SizeType",
    "Seek Range",
    "Sight Range"];

const getUnitList = (filter, compare, scroll) => {
    return allUnits
        .filter(unit => {
            let pass = true;
            Object.keys(filter).forEach(key => {
                console.log(key,unit[key],filter[key]);
                if (filter[key] && filter[key]!=='All' && (unit[key] !== filter[key])) {
                    pass = false;
                }
            })
            return pass;
        })
        .map(unit => <tr className='compare-unit'  key={unit.Name}>
            <td><i className={unit.Icon}></i> {unit.Name}</td>
            <td>{unit[compare]}</td>
        </tr>)    
    .slice(scroll, scroll+5);
};

class Compare extends Component {
    constructor(props) {
      super(props);
      this.state = {
        filter: {
            Race: props.match.params.race || 'Terran'
        },
        compare: 'Supply Cost',
        scroll:0
      };
        
      this.toggleUnit = this.toggleUnit.bind(this);
      this.toggleCompare = this.toggleCompare.bind(this);
      this.scroll = this.scroll.bind(this);

    }
  
    async componentWillMount() {
      
    }
  
    componentWillReceiveProps(nextProps) {
      
    }

    toggleUnit(event) {
        event.preventDefault();
    }

    toggleCompare(event) {
        event.preventDefault();
    }

    scroll(dir) {
        this.setState(state => {
            return {...state, scroll: state.scroll+=dir}
        });
    }
  
    render() {
      return <div class='compare-container'>
          <Link to={`/`}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></Link>
          <span onClick={_=>this.scroll(-1)}>Up</span> <span onClick={_=>this.scroll(1)}>Down</span>
      <table>
          <thead>
              <tr>
              <th><a href="#noop" onClick={this.toggleUnit}>Unit</a></th>
              <th><a href="#noop" onClick={this.toggleCompare}>{this.state.compare}</a></th>
              </tr>
          </thead>
          <tbody>
              {getUnitList(this.state.filter,this.state.compare, this.state.scroll)}
          </tbody>
      </table>
      
      
      </div>;
    }
  }

  export default Compare;