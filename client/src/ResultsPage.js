import React from "react";
import HeaderBar from "./HeaderBar.js";
import './ResultsPage.css'

class ResultsPage extends React.Component {
    render() {
        const { winner, numVoted } = this.props;
        const done = winner !== "";
        return (
            <div>
                <HeaderBar title="Results"></HeaderBar>
                <div class="results-text">
                    {done && <h1>Winner: {winner}</h1>}
                    {!done && <h2>People voted: {numVoted}</h2>}
                </div>
            </div>
        )
    }
}

export default ResultsPage;