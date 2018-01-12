import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const allUnits = require('./bwapi-data/json/units.json')
    .filter(unit=>unit.Race !== 'None')
    .map(unit => {
        const cost = unit.Cost.match(/([0-9]+)\s+([0-9]+)\s+([0-9]+)/);
        unit['Mineral Cost'] = cost[1];
        unit['Vespine Cost'] = cost[2];
        unit['Supply Cost'] = cost[3]/2;

        unit['Build Time'] = Math.round(((unit['Build Time']||'').match(/([0-9]+)\s+frames/)[1] || 0)/24,2) + ' s';
        unit['Seek Range'] = unit['Seek Range']/32;
        unit['Sight Range'] = unit['Sight Range']/32;
        return unit;
    });

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
        compare: 'Hit Points',
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
          <Link to={`/`}><img className='back-button' src='/resources/backarrow.svg' alt='Back'/></Link>
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