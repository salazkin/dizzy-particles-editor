import React from 'react';
import PropGroup from './PropGroup';

const Controls: React.FC = () => {
    return (
        <div className="side-bar">
            <div>
                {/*
                <PropGroup id={"init"} items={{ particles: "particles", loop: "loop" }} /> TODO: fix particles reset
                */}
                <PropGroup id={"time"} items={{ duration: "duration", delay: "delay" }} />
                <PropGroup id={"start"} items={{ x: "posStartOffsetX", y: "posStartOffsetY" }} />
                <PropGroup id={"end"} items={{ x: "posEndOffsetX", y: "posEndOffsetY" }} />
                <PropGroup id={"cp1"} items={{ magnitude: "posControlPoint1Mag", angle: "posControlPoint1Angle" }} />
                <PropGroup id={"cp2"} items={{ magnitude: "posControlPoint2Mag", angle: "posControlPoint2Angle" }} />
                <PropGroup id={"scale"} items={{ from: "scaleFrom", to: "scaleTo", yoyo: "scaleYoYo" }} />
                <PropGroup id={"rotation"} items={{ speed: "rotationSpeed", faceDir: "rotationFaceDir" }} />
                <PropGroup id={"alpha"} items={{ from: "alphaFrom", to: "alphaTo", yoyo: "alphaYoYo" }} />
                <PropGroup id={"color"} items={{ tint: "tint", interpolate: "tintInterpolate" }} />
            </div>
        </div>
    );
};




export default Controls;
