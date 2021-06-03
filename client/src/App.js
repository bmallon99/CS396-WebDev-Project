import React from "react";
import { Route } from 'react-router-dom';
import Home from './Home';
import SuggestionsPage from './SuggestionsPage';
import VotingPage from './VotingPage';
import ResultsPage from './ResultsPage';

class App extends React.Component {
    render() {
        return (
            <div>
            <Route exact path = "/" component = {Home} />
            <Route path = "/suggest" component = {SuggestionsPage} />
            <Route path = "/vote" component = {VotingPage} />
            <Route path = "/results" component = {ResultsPage} />
            </div>
        )
    }
}

export default App;