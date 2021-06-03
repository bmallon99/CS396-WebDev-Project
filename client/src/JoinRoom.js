import React from 'react';
import './JoinRoom.css';

class JoinRoom extends React.Component {
    
    
    render() {
        return (
            <div id="join-room">
                <span>
                    <label>Name</label>
                    <input onChange={this.props.handleNameInput} placeholder="Name"/>
                </span>
                <span>
                    <label>Room Code</label>
                    <input onChange={this.props.handleRoomInput} placeholder="Room Code"/>
                </span>
                <button className="btn" onClick={this.props.joinRoom}>Join</button>
                <button className="btn" onClick={this.props.cancelJoin}>Cancel</button>
            </div>
        );
    }
}

export default JoinRoom;