import React from 'react';

const divStyle = (width) => {
    return {
        flex: "1 0 " + width
    };

};

const CellFixed = (props) => {
    return (
        <div className={(props.className ? props.className + " " : "") + "cell"} style={divStyle(props.width)}>
            {props.children}
        </div>
    );
};

export default CellFixed;
