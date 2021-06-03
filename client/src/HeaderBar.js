import React from 'react';
import './HeaderBar.css';

class HeaderBar extends React.Component {
    render() {
        const code = this.props.roomCode;
        return(
            <div id="header">
                <h1>{this.props.title}</h1>
                { !code ? '' : <h2>Room Code: {this.props.roomCode}</h2> }
            </div>
        );
    }
}

export default HeaderBar;