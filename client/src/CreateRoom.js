import React from 'react';
import './CreateRoom.css';

class CreateRoom extends React.Component {
    
    render() {
        return (
            <div id="create-room">
                <span>
                    <label>Name</label>
                    <input onChange={this.props.handleNameInput} placeholder="Name"/>
                </span>
                <button className="btn" onClick={this.props.createRoom}>Create</button>
                <button className="btn" onClick={this.props.cancelCreate}>Cancel</button>
            </div>
        );
    }
}

export default CreateRoom;