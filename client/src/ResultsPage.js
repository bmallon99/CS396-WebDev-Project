import React from "react";
import HeaderBar from "./HeaderBar.js";

class ResultsPage extends React.Component {
    render() {
        const { winner } = this.props;
        return (
            <div>
                <HeaderBar title="Winner Winner Chicken Dinner!"></HeaderBar>
                <h1>{winner}</h1>
            </div>
        )
    }
}

export default ResultsPage;