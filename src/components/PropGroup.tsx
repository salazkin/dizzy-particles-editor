import React from 'react';
import PropId from './PropId';
import PropValue from './PropValue';


const PropGroup: React.FC<{
    id: string;
    items: any;
}> = props => {

    const getItems = () => Object.keys(props.items).map((key, i) => {
        const configKey = props.items[key];
        let id = `${i > 0 ? " " : ""}${key}:`;

        return <span key={configKey}>
            <PropId value={id} />
            <PropValue configKey={configKey} />
        </span>;
    });

    return (
        <div className="prop-field">
            <div className="prop-title prop-font">{`${props.id}:`}</div>
            <div>
                {getItems()}
            </div>
        </div>
    );

};

export default PropGroup;
