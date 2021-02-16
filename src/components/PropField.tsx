import React, { Component } from 'react';
import PropValue from './PropValue';
import PropId from './PropId';

class PropField extends Component<any, any> {

    render() {
        let list = this.props.items.map((data, i) => {
            let id = `${i > 0 ? " " : ""}${data.id}:`;
            return <span key={`prop_${data.id}`}>
                <PropId value={id} />
                <PropValue value={123} configKey={data.config.key} configData={data.config.data} cb={this.props.cb} />
            </span>
        });
        return (
            <div className="PropField">
                <div className="PropTitle">{`${this.props.id}:`}</div>
                <div>
                    {list}
                </div>
            </div>
        );
    }
}


export default PropField
