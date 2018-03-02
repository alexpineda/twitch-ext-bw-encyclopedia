import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { allWeapons, createUpgradeLink } from './shared';

const Weapon = ({match, history}) => {
    const weapon = allWeapons.find(weapon => weapon.Name == match.params.weapon);

    const goBack = (event) => {
        event.preventDefault();
        history.goBack();   
    }


    const weaponRows = [
        <tr key="d">
            <td>Damage</td>
            <td>{weapon['Damage']}</td>
        </tr>,
        <tr  key="db">
            <td>Damage Bonus</td>
            <td>{weapon['Damage Bonus']}</td>
        </tr>,
        <tr  key="bc">
            <td>Base Cooldown</td>
            <td>{weapon['Base Cooldown']}</td>
        </tr>,
        <tr  key="df">
            <td>Damage Factor</td>
            <td>{weapon['Damage Factor']}</td>
        </tr>,
        weapon['Upgrade'] ? <tr  key="u">
            <td>Upgrade</td>
            <td>{createUpgradeLink(match.params.unit,weapon['Upgrade'],match.params.race)}</td>
        </tr> : null,
        <tr  key="dt">
            <td>Damage Type</td>
            <td>{weapon['DamageType']}</td>
        </tr>,
        <tr  key="et">
            <td>Explosion Type</td>
            <td>{weapon['ExplosionType']}</td>
        </tr>,
        <tr  key="mr">
            <td>Maximum Range</td>
            <td>{weapon['Maximum Range']}</td>
        </tr>,
        <tr  key="ta">
            <td>Target Attributes</td>
            <td>{weapon['Target Attributes']}</td>
        </tr>
    ];

    return <div className='weapon'>
            <div><a href="#back" onClick={goBack}><img className='back-button' src='resources/backarrow.svg' alt='Back'/></a></div>
            <span className='unit-header'><Link to={`/race/${match.params.race}/units`}>Weapon</Link></span>
            <div className="weapon__title"><i className={weapon.Icon}></i> <span>{weapon.Name}</span></div>

            <table>
                <tbody>
                    
                    {weaponRows.filter(x => x).map(x=>x)}
                    
                </tbody>
            </table>

        </div>;
};

export default Weapon;