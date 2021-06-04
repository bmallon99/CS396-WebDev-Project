import React from 'react';
import HeaderBar from './HeaderBar.js'

class VotingPage extends React.Component {

    render() {
        const { roomCode, suggestions, toggleVote, submitVote} = this.props;
        return (
            <div>
                <HeaderBar title="Voting" roomCode={roomCode}></HeaderBar>
                <div>
                    {suggestions.map(sug => (
                        <div>
                            <input type="checkbox" name={sug} onChange={toggleVote}/>
                            <label>{sug}</label>
                        </div>
                    ))}
                </div>
                <button className="btn" onClick={submitVote}>Submit</button>
            </div>
        )
    }
}

export default VotingPage;