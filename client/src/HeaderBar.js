import React from 'react';
import './HeaderBar.css';

class HeaderBar extends React.Component {
    render() {
        const { title, roomCode } = this.props;
        return(
            <div id="header">
                <h1>{title}</h1>
                { !roomCode ? '' : <h2>Room Code: {roomCode}</h2> }
            </div>
        );
    }
}

export default HeaderBar;