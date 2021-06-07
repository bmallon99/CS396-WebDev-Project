import React from 'react';
import HeaderBar from './HeaderBar.js'
import './SuggestionsPage.css';

class SuggestionsPage extends React.Component {

    render() {
        const { roomCode, isHost, names, handleSuggestion, inputtedSuggestion, submitSuggestion, submitSuggestionOnEnter, submitError, suggestions, finishSuggestions} = this.props;
        return (
            <div>
                <HeaderBar title="Suggestions" roomCode={roomCode}></HeaderBar>
                <div id="suggestions-container">
                    <div id="suggestions-and-continue">
                        <div id="label-and-continue">
                            <label>Suggestion: </label>
                            { isHost && <button className="btn" onClick={finishSuggestions}>Continue to Voting</button> }
                        </div>
                        <div id="suggestion-and-submit">
                        <input onChange={handleSuggestion} value={inputtedSuggestion} placeholder="my suggestion" onKeyUp={submitSuggestionOnEnter}/>
                            <button className="btn" onClick={submitSuggestion}>Submit</button>
                        </div>
                        <div id="error">{submitError}</div>
                    </div>
                    <div id="suggestions-and-names">
                        <div id="suggestions-list">
                            <h2>Suggestions</h2> 
                            <ul>   
                                {suggestions.map(sug => (
                                    <li key={sug}>{sug}</li>
                                ))}
                            </ul>
                        </div>
                        <div id="names-list">
                            <h2>Participants</h2>
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