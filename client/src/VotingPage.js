import React from 'react';
import HeaderBar from './HeaderBar.js';
import './VotingPage.css';

class VotingPage extends React.Component {

    render() {
        const { roomCode, suggestions, toggleVote, submitVote} = this.props;
        return (
            <div>
                <HeaderBar title="Voting" roomCode={roomCode}></HeaderBar>
                <div id="voting-body">
                    <div id="voting-container">
                        <h3>Choose as many as you want</h3>
                        <div id="checkbox-list">
                        {suggestions.map(sug => (
                            <div class="checkbox-list-item">
                                <label class="vote-label">
                                    <input type="checkbox" name={sug} onChange={toggleVote}/>{sug}
                                </label>
                            </div>
                        ))}
                        </div>
                        <div id="submit-button">
                            <button className="btn" onClick={submitVote}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default VotingPage;