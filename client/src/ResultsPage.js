import React from "react";
import HeaderBar from "./HeaderBar.js";

class ResultsPage extends React.Component {
    render() {
        const { winner, numVoted } = this.props;
        const done = winner !== "";
        return (
            <div>
                <HeaderBar title="Results"></HeaderBar>
                {done && <h1>{winner}</h1>}
                {!done && <h2>People voted: {numVoted}</h2>}
            </div>
        )
    }
}

export default ResultsPage;