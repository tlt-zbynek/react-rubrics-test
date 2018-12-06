import React from 'react';

const divStyle = {
    width: "100%",
    padding: "4px",
    textAlign: "center"
    // alignItems: "center"
    // alignContent: "center"
};

const CellStretch = (props) => {
    return (
        <div className={(props.className ? props.className + " " : "") + "cell"} style={props.style ? {...props.style, ...divStyle}: divStyle}>{props.children}</div>
    );
};

export default CellStretch;
