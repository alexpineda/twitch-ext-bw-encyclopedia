import React, { Component } from "react";
import { allUnits } from './shared';
import { Link, Redirect } from 'react-router-dom';

const selectableUnits = allUnits.filter(unit => !unit.isBuilding);

class Battle extends Component {
    
    constructor() {
        super();
        const unit1 = Object.assign({},allUnits.filter(unit => unit.Name==='Terran Marine')[0]);
        const unit2 = Object.assign({},allUnits.filter(unit => unit.Name==='Terran Marine')[0]);

        this.state = {
            state: 'battle',
            selectingFor: 1,
            unit1,
            unit2
        }
    }

    showUnitSelector() {
        if (this.state.state !== 'selectUnit') {
            return '';
        }
        return 'Unit Selector';
    }

    showUpgradeSelector() {
        if (this.state.state !== 'selectUpgrades') {
            return '';
        }
        return 'Upgrade Selector';
    }

    showEffectsSelector() {
        if (this.state.state !== 'selectEffects') {
            return '';
        }
        return 'Effects Selector';
    }

    showResults() {
        if (this.state.state !== 'battle') {
            return '';
        }
        return 'Results';
    }

    render() {
        const goBack = (event) => {
            event.preventDefault();
            this.props.history.goBack();   
        }

        const match = this.props.match;
        
        return <div className='unit'>
            <span className='unit-header'><Link to={`/`}>Battle</Link></span>
            
            {/* <div >{backLink()}</div> */}
            <div><a href="#back" onClick={goBack}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></a></div>
    
            <div className="unit__title" ><i className={this.state.unit1.Icon}></i> vs <i className={this.state.unit2.Icon}></i></div> 
    
            {this.showUnitSelector()}
            {this.showUpgradeSelector()}
            {this.showEffectsSelector()}
            {this.showResults()}
            </div>
    }
}

export default Battle;