import React, { Component } from "react";
import * as Animated from "animated/lib/targets/react-dom";

const AnimatedWrapper = WrappedComponent => class AnimatedWrapper
 extends Component {
    render() {
        return (
         <Animated.div >
          <WrappedComponent {...this.props} />
         </Animated.div>
        );
       }
      };
      
export default AnimatedWrapper;