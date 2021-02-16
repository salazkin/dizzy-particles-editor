import React, { Component } from 'react';


class PropId extends Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return (<span className="PropId" >{this.props.value}</span>);
    }
}

export default PropId;
