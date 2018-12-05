import React, {Component} from 'react';

import Row from './rubric/Row';
import CellStretch from './rubric/CellStretch';
import CellFixed from './rubric/CellFixed';
import FlexTable from './rubric/FlexTable';

import './App.css';

import {faCheckCircle, faPlusCircle, faMinusCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const critWidth = "200px";
const ptsWidth = "100px";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            existValue: null,
            headerRow: ["Criteria", "Ratings", "Pts", ""],
            rows: [
                {criteria_title: "criteria 1", ratings: [11, 12], points: 12},
                {criteria_title: "criteria 2", ratings: [21, 22, 23], points: 23}
            ]
        };
    }

    averageNewCellValue(row, col) {
        const rowInd = parseInt(row);
        const colInd = parseInt(col);
        const leftVal = this.state.rows[rowInd].ratings[colInd];
        const rightVal = this.state.rows[rowInd].ratings[colInd + 1];

        return (leftVal + rightVal) / 2;
    }

    forceRange(min, max, currVal) {
        if (min && currVal < min)
            return min;
        if (max && currVal > max)
            return max;
        return currVal;
    }

    getMin(rowInd, colInd) {
        console.log("rowInd, colInd: ", rowInd + ", " + colInd);
        return colInd - 1 >= 0 ? this.state.rows[rowInd].ratings[colInd - 1] + 1 : 0;
    }

    getMax(rowInd, colInd) {
        return this.state.rows[rowInd].ratings[colInd + 1] - 1;
    }

    handlePointsOnBlur = (e) => {
        const rowInd = parseInt(e.target.getAttribute("row"));
        const min = parseInt(e.target.getAttribute("min"));
        const rows = [...this.state.rows];
        const ratingsLength = rows[rowInd].ratings.length;
        const newPts = this.forceRange(min, null, parseInt(e.target.value));

        rows[rowInd].points = newPts;
        // update the last item of criteria to have it equal
        rows[rowInd].ratings[ratingsLength - 1] = newPts;
        this.setState({rows});
    }

    handleRatingsOnBlur = (e) => {
        const rowInd = parseInt(e.target.getAttribute("row"));
        const colInd = parseInt(e.target.getAttribute("col"));
        const min = parseInt(e.target.getAttribute("min"));
        const max = parseInt(e.target.getAttribute("max"));
        const rows = [...this.state.rows];
        const ratingsLength = rows[rowInd].ratings.length;
        const newRatings = [...this.state.rows[rowInd].ratings];
        const newValue =  this.forceRange(min, max, parseInt(e.target.value));

        newRatings[colInd] = newValue;
        rows[rowInd].ratings = newRatings;
        // update the points if the last item of ratings was changed
        if (colInd === ratingsLength - 1) {
            rows[rowInd].points = newValue;
        }
        this.setState({rows});
    }

    handleCriteriaChange = (e) => {
        const rowInd = parseInt(e.target.getAttribute("row"));
        const rows = [...this.state.rows];
        const newCriteria = e.target.value;

        rows[rowInd].criteria_title = newCriteria;
        this.setState({rows});
    };

    handlePointsChange = (e) => {
        const rowInd = parseInt(e.target.getAttribute("row"));
        const min = parseInt(e.target.getAttribute("min"));
        const rows = [...this.state.rows];
        const ratingsLength = rows[rowInd].ratings.length;
        const newPts = parseInt(e.target.value); //this.forceRange(min, null, parseInt(e.target.value));

        rows[rowInd].points = newPts;
        // update the last item of criteria to have it equal
        rows[rowInd].ratings[ratingsLength - 1] = newPts;
        this.setState({rows});
    };

    handleRatingChange = (e) => {
        const rowInd = parseInt(e.target.getAttribute("row"));
        const colInd = parseInt(e.target.getAttribute("col"));
        const min = parseInt(e.target.getAttribute("min"));
        const max = parseInt(e.target.getAttribute("max"));
        const rows = [...this.state.rows];
        const ratingsLength = rows[rowInd].ratings.length;
        const newRatings = [...this.state.rows[rowInd].ratings];
        const newValue =  parseInt(e.target.value); //this.forceRange(min, max, parseInt(e.target.value));

        newRatings[colInd] = newValue;
        rows[rowInd].ratings = newRatings;
        // update the points if the last item of ratings was changed
        if (colInd === ratingsLength - 1) {
            rows[rowInd].points = newValue;
        }
        this.setState({rows});
    };

    handleAddNewCell = (e) => {
        e.preventDefault();
        const row = parseInt(e.currentTarget.getAttribute("row"));
        const col = parseInt(e.currentTarget.getAttribute("col"));
        const rows = [...this.state.rows];
        const newRatings = [...this.state.rows[row].ratings];
        const insertAt = (col + 1);
        newRatings.splice(insertAt, 0, this.averageNewCellValue(row, col));
        rows[row].ratings = newRatings;
        this.setState({rows});
    };

    handleRemoveCell = (e) => {
        e.preventDefault();
        const row = parseInt(e.currentTarget.getAttribute("row"));
        const col = parseInt(e.currentTarget.getAttribute("col"));

        const newRatings = [...this.state.rows[row].ratings];
        // make sure there are at least 2 cells for min and max
        if (newRatings.length > 2) {
            const removeAt = col;
            newRatings.splice(removeAt, 1);
            console.log("ratings updated at " + removeAt + ": ", newRatings);
            const rows = [...this.state.rows];
            rows[row].ratings = newRatings;
            this.setState({rows});
        }
    };

    handleRemoveRow = (e) => {
        const rows = [...this.state.rows];
        rows.splice(parseInt(e.target.getAttribute("row")), 1);
        this.setState({rows});
    };

    handleAddNewRow = () => {
        console.log("new row added");
        const defaultRow = {criteria_title: "new criteria", points: 1, ratings: [0, 1]};
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
                                                                        onChange={this.handleCriteriaChange}
                                                                        row={i}/></CellFixed>;
            const ratingsLength = row.ratings.length;
            const mappedCells = row.ratings.map((rating, j) => {
                return (j != ratingsLength - 1) ? (
                    <CellStretch>
                        <input type="number"
                               min={this.getMin(i, j)}
                               max={this.getMax(i, j)}
                               value={rating}
                               onChange={this.handleRatingChange}
                               onBlur={this.handleRatingsOnBlur}
                               row={i}
                               col={j}/>
                        <button className="btn" onClick={this.handleAddNewCell} row={i} col={j}><FontAwesomeIcon
                            icon={faPlusCircle}/></button>
                        <button className="btn" onClick={this.handleRemoveCell} row={i} col={j}><FontAwesomeIcon
                            icon={faMinusCircle}/></button>
                    </CellStretch>
                ) : <CellStretch><input type="number"
                                        min={this.getMin(i, j)}
                                        value={rating}
                                        onChange={this.handleRatingChange}
                                        onBlur={this.handleRatingsOnBlur}
                                        row={i}
                                        col={j}/></CellStretch>;
            });
            const ptsCell = <CellFixed width={ptsWidth}><input type="number"
                                                               min={this.getMin(i, ratingsLength - 1)}
                                                               value={row.points}
                                                               onChange={this.handlePointsChange}
                                                               onBlur={this.handlePointsOnBlur}
                                                               row={i}/></CellFixed>;
            const removeRowButton = <button className="btn" onClick={this.handleRemoveRow} row={i}><FontAwesomeIcon
                icon={faTimesCircle}/></button>;
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
                            Add Criteria
                        </button>
                    </FlexTable>

                </header>
            </div>


        );
    }
}

export default App;
