import React from 'react';


const PropId: React.FC<{ value: string; }> = props => {
    return (
        <span className="prop-id prop-font" >{props.value}</span>
    );
};

export default PropId;
