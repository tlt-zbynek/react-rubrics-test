import React, {Component} from 'react';

import Row from './rubric/Row';
import CellStretch from './rubric/CellStretch';
import CellFixed from './rubric/CellFixed';
import FlexTable from './rubric/FlexTable';

import './App.css';

const critWidth = "200px";
const ptsWidth = "100px";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerRow: ["Criteria", "Ratings", "Pts", ""],
            rows: [
                {criteria_title: "criteria", ratings: ["11", "12"], points: 12},
                {criteria_title: "criteria", ratings: ["21", "22", "23"], points: 23}
            ]
        };
    }

    handleTxtChange = (e) => {
        console.log("input changed value: ", e.target.value);
        const row = e.target.getAttribute("row");
        const col = e.target.getAttribute("col");
        console.log("row,col: ", row + "," + col);
        const rows = [...this.state.rows];
        const ratingsLength = rows[row].ratings.length;

        switch (col) {
            case "criteria":
                const newCriteria = e.target.value;
                rows[row].criteria_title = newCriteria;
                break;
            case "points":
                const newPts = e.target.value;
                rows[row].points = newPts;
                // update the last item of criteria to have it equal
                rows[row].ratings[ratingsLength - 1] = newPts;
                break;
            default:
                const newRatings = [...this.state.rows[row].ratings];
                newRatings[col] = e.target.value;
                rows[row].ratings = newRatings;
                // update the points if the last item of ratings was changed
                if (parseInt(col) === ratingsLength - 1) {
                    rows[row].points = e.target.value;
                }
        }

        this.setState({rows});
    };

    handleAddNewCell = (e) => {
        const row = e.target.getAttribute("row");
        const col = e.target.getAttribute("col");
        console.log("row,col: ", row + "," + col);
        const rows = [...this.state.rows];
        const newRatings = [...this.state.rows[row].ratings];
        console.log("ratings: ", newRatings);
        const insertAt = (parseInt(col) + 1);
        newRatings.splice(insertAt, 0, "Set Marks");
        console.log("ratings updated at " + insertAt + ": ", newRatings);
        rows[row].ratings = newRatings;
        this.setState({rows});
    };

    handleRemoveCell = (e) => {
        const row = e.target.getAttribute("row");
        const col = e.target.getAttribute("col");
        console.log("row,col: ", row + "," + col);
        const newRatings = [...this.state.rows[row].ratings];
        console.log("ratings: ", newRatings);
        // make sure there are at least 2 cells for min and max
        if (newRatings.length > 2) {
            const removeAt = parseInt(col);
            newRatings.splice(removeAt, 1);
            console.log("ratings updated at " + removeAt + ": ", newRatings);
            const rows = [...this.state.rows];
            rows[row].ratings = newRatings;
            this.setState({rows});
        }
    };

    handleRemoveRow = (e) => {
        console.log(e.target.getAttribute("row"));
        const rows = [...this.state.rows];
        rows.splice(e.target.getAttribute("row"), 1);
        this.setState({rows});
    };

    handleAddNewRow = () => {
        console.log("new row added");
        const defaultRow = {criteria_title: "criteria", points: "Full Marks", ratings: ["No Marks", "Full Marks"]};
        this.setState({rows: [...this.state.rows, defaultRow]});
    };

    renderHeaderRow = () => {
        return (
            <Row>
                <CellFixed className="cellHeader" width={critWidth}>{this.state.headerRow[0]}</CellFixed>
                <CellStretch className="cellHeader">{this.state.headerRow[1]}</CellStretch>
                <CellFixed className="cellHeader" width={ptsWidth}>{this.state.headerRow[2]}</CellFixed>
                <CellFixed className="cellHeader" width="8px">{this.state.headerRow[3]}</CellFixed>
            </Row>
        );
    };

    renderRows = (rows) => {
        return rows.map((row, i) => {
            const criteriaCell = <CellFixed width={critWidth}><textarea value={row.criteria_title}
                                                                        onChange={this.handleTxtChange} row={i}
                                                                        col="criteria"/></CellFixed>;
            const ratingsLength = row.ratings.length;
            const mappedCells = row.ratings.map((rating, j) => {
                const textArea = <textarea value={rating} onChange={this.handleTxtChange} row={i} col={j}/>;

                return (j != ratingsLength - 1) ? (
                    <CellStretch>{textArea}
                        <button onClick={this.handleAddNewCell} row={i} col={j}>+</button>
                        <button onClick={this.handleRemoveCell} row={i} col={j}>-</button>
                    </CellStretch>
                ) : <CellStretch>{textArea}</CellStretch>;
            });
            const ptsCell = <CellFixed width={ptsWidth}><textarea value={row.points}
                                                                  onChange={this.handleTxtChange} row={i} col="points"/></CellFixed>;
            const removeRowButton = <button onClick={this.handleRemoveRow} row={i}>X</button>;
            return (
                <div>
                    <Row>
                        {criteriaCell}{mappedCells}{ptsCell}{removeRowButton}
                    </Row>
                </div>
            );
        });
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <FlexTable className="center">
                        {this.renderHeaderRow()}
                        {this.renderRows(this.state.rows)}
                        <button onClick={this.handleAddNewRow}>
                            Add Row
                        </button>
                    </FlexTable>

                </header>
            </div>
        );
    }
}

export default App;
