import React, { Component } from 'react';
import { connect } from 'react-redux';
import Utils from '../helper/Utils';


const mapStateToProps = (state) => {
    return { config: state.config }
};

const initConfigProp = (id: string, value: any) => {
    return { type: "INIT_CONFIG_PROP", id: id, value: value }
}

const setConfigProp = (id: string, value: string) => {
    return { type: "SET_CONFIG_PROP", id: id, value: value }
}

class PropValue extends Component<any, any> {

    private isIdle = true;

    constructor(props) {
        super(props);
        this.props.initConfigProp(props.configKey, props.configData);
        this.state = { value: this.getStrValueFromConfig() };
    }

    private getStrValueFromConfig(): string {
        let data = this.props.config[this.props.configKey];
        if (data.isColor) {
            return data.value.map(item => Utils.rgbToHex(Utils.hexToRgb(item), "")).join(", ");
        } else if (data.isBool) {
            return data.value[0] === 1 ? "true" : "false";
        } else {
            return data.value.map(item => Array.isArray(item) ? item.join("~") : item).join(",");
        }
    }

    private onClick(): void {
        this.isIdle = false;
        this.props.cb(this);
    }

    public setText(value: String): void {
        this.setState({ value: value });
    }

    public updateConfigValue(value: String): void {
        this.isIdle = true;
        this.props.setConfigProp(this.props.configKey, value);
        this.setState({ value: this.getStrValueFromConfig() });
    }

    public componentDidUpdate(): void {
        if (!this.isIdle) {
            this.props.cb(this);
        }
    }

    render() {
        return (<span className="PropValue" onClick={this.onClick.bind(this)}>{this.state.value}</span>);
    }
}


export default connect(mapStateToProps, { initConfigProp, setConfigProp })(PropValue);
