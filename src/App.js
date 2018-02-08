import React, { Component } from 'react';
import './App.css';

import Races from './Races';
import Race from './Race';
import Units from './Units';
import Unit from './Unit';
import Ability from './Ability';
import Weapon from './Weapon';
import Upgrade from './Upgrade';

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

import { AnimatedSwitch } from 'react-router-transition';

import * as ImagesPromise from 'react-images-preload';
import { isBuffer } from 'util';

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

var easingEq = require('eases/circ-in-out')

const mapStyles= (styles) => ({
  zIndex: styles.zindex,
  opacity: easingEq(styles.opacity)
});


const routes = <AnimatedSwitch
atEnter={{ opacity: 0.3, scale:0.95, zindex:0 }}
atLeave={{ opacity: 0, scale:1.1, zindex:99 }}
atActive={{ opacity: 1, scale:1, zindex:0}}
mapStyles={mapStyles}
className="twitch-extension"
>
  <Route exact path="/" component={Races}/>
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
</AnimatedSwitch>;


const Preloader = ({images, isImagesLoaded}) =>  !isImagesLoaded ? <Races loading={true} /> : routes;

const WithimagesLoaded = ImagesPromise.withImagesPromise({
  title: 'resources/Starcraft.jpg',
  terran: 'resources/Terran.jpg',
  protoss: 'resources/Protoss.jpg',
  zerg: 'resources/Zerg.jpg',
  icons: 'cmdbtns.png',
  backarrow: 'resources/backarrow.svg',
  bwwhite: 'resources/backarrowwhite.svg',
  al: 'resources/arrow-left.svg',
  ar: 'resources/arrow-right.svg',
  min: 'resources/Mineral.gif',
  vesp: 'resources/Vespine.gif',
  suppt: 'resources/Supply_Terran.png',
  suppp: 'resources/Supply_Protoss.png',
  suppz: 'resources/Supply_Zerg.png'
}, Preloader);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <Router>
        <WithimagesLoaded />
      </Router>
      </Provider>
    );
  }
}

export default App;