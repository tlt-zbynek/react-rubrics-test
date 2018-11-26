import React from 'react';

const divStyle =  {
        width: "100%"
};

const CellStretch = (props) => {
    return (
        <div className={(props.className ? props.className + " " : "") + "cell"} style={divStyle}>{props.children}</div>
    );
};

export default CellStretch;
