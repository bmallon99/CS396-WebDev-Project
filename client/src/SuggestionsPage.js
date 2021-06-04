import React from 'react';
import HeaderBar from './HeaderBar.js'
import './SuggestionsPage.css';

class SuggestionsPage extends React.Component {

    render() {
        const { roomCode, isHost, names, handleSuggestion, submitSuggestion, suggestions, finishSuggestions} = this.props;
        return (
            <div>
                <HeaderBar title="Suggestions" roomCode={roomCode}></HeaderBar>
                <div id="suggestions-container">
                    <span id="suggestions-bar">
                        <label>Suggest</label>
                        <input onChange={handleSuggestion} placeholder=""/>
                        <button className="btn" onClick={submitSuggestion}>Submit</button>
                        { isHost && <button className="btn" onClick={finishSuggestions}>Continue to Voting</button> }
                    </span>
                    <div id="suggestions-and-names">
                        <ul id="suggestions-list">    
                            {suggestions.map(sug => (
                                <li key={sug}>{sug}</li>
                            ))}
                        </ul>
                        <div id="names-list">
                            Names
                            <ul> 
                                {names.map(name => (
                                    <li key={name}>{name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SuggestionsPage;