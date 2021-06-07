import React from 'react';
import './JoinRoom.css';

class JoinRoom extends React.Component {
    
    
    render() {
        const { handleNameInput, handleRoomInput, joinRoom, joinRoomOnEnter, joinError, cancelJoin } = this.props;
        return (
            <div id="join-room">
                <span>
                    <label>Name</label>
                    <input onChange={handleNameInput} placeholder="Name"/>
                </span>
                <span>
                    <label>Room Code</label>
                    <input onChange={handleRoomInput} placeholder="Room Code" onKeyUp={joinRoomOnEnter}/>
                </span>
                <div id="error">{joinError}</div>
                <button className="btn" onClick={joinRoom}>Join</button>
                <button className="btn" onClick={cancelJoin}>Cancel</button>
            </div>
        );
    }
}

export default JoinRoom;