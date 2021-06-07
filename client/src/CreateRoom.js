import React from 'react';
import './CreateRoom.css';

class CreateRoom extends React.Component {
    
    render() {
        const { handleNameInput, createRoom, createRoomOnEnter, cancelCreate } = this.props;
        return (
            <div id="create-room">
                <span>
                    <label>Name</label>
                    <input onChange={handleNameInput} placeholder="Name" onKeyUp={createRoomOnEnter}/>
                </span>
                <button className="btn" onClick={createRoom}>Create</button>
                <button className="btn" onClick={cancelCreate}>Cancel</button>
            </div>
        );
    }
}

export default CreateRoom;