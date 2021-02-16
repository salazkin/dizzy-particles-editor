import React, { Component } from 'react';
import Input from './Input';
import PropField from './PropField';
import '../css/Styles.css';

class Controls extends Component<any, any> {
    private controls = {
        init: {
            particles: { particles: { value: [5], min: 1, max: 99, isSingleValue: true } },
            loop: { loop: { value: [1], isBool: true, isSingleValue: true } }
        },
        time: {
            duration: { duration: { value: [1], min: 0 } },
            delay: { delay: { value: [0], min: 0 } },
        },
        start: {
            x: { posStartOffsetX: { value: [0] } },
            y: { posStartOffsetY: { value: [0] } }
        },
        end: {
            x: { posEndOffsetX: { value: [0] } },
            y: { posEndOffsetY: { value: [0] } }
        },
        cp1: {
            magnitude: { posControlPoint1Mag: { value: [0] } },
            angle: { posControlPoint1Angle: { value: [0] } }
        },
        cp2: {
            magnitude: { posControlPoint2Mag: { value: [0] } },
            angle: { posControlPoint2Angle: { value: [0] } }
        },
        scale: {
            from: { scaleFrom: { value: [1] } },
            to: { scaleTo: { value: [1] } },
            yoyo: { scaleYoYo: { value: [0], isBool: true, isSingleValue: true } }
        },
        rotation: {
            speed: { rotationSpeed: { value: [0] } },
            faceDir: { rotationFaceDir: { value: [0], isBool: true, isSingleValue: true } }
        },
        alpha: {
            from: { alphaFrom: { value: [1], min: 0 } },
            to: { alphaTo: { value: [1], min: 0 } },
            yoyo: { alphaYoYo: { value: [0], isBool: true, isSingleValue: true } }
        },
        color: {
            tint: { tint: { value: ["0xffffff"], isColor: true } },
            interpolate: { tintInterpolate: { value: [0], isBool: true, isSingleValue: true } },
            additive: { additive: { value: [0], isBool: true, isSingleValue: true } }
        }
    }

    private onClick(label) {
        (this.refs.input as Input).show(label);
    }

    render() {
        let fieldsArr = Object.keys(this.controls).map(fieldId => {
            let fieldData = this.controls[fieldId];
            let items = Object.keys(fieldData).map(propId => {
                let propData = fieldData[propId];
                let configKey = Object.keys(propData).pop();
                let configData = propData[configKey];
                return { id: propId, config: { key: configKey, data: configData } }
            });
            return <PropField id={fieldId} items={items} key={fieldId} cb={this.onClick.bind(this)} />
        });
        return (
            <div className="Controls">
                <Input ref="input" />
                <div>
                    {fieldsArr}
                </div>
            </div>
        );
    }
}


export default Controls;
