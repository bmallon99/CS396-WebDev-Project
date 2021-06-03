import './Home.css';
import React from 'react';
import HeaderBar from './HeaderBar.js';
import JoinRoom from './JoinRoom.js';
import CreateRoom from './CreateRoom.js';

const ws = window.WebSocket || window.MozWebSocket;
const wssURI = 'ws://localhost';
const wssPort = '8081';

class Home extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        connection: null,
        roomCode: 0,
        inputtedCode: "",
        inputtedSuggestion: "",
        allSuggestions: [],
        name: "",
        showJoin: false,
        showCreate: false,
      };
  }

  initializeConnection = (next) => {
      const url = wssURI + ":" + wssPort;
      let connection = new ws(url);
      this.setState({
        connection: connection
      });
      console.log(`Connecting to ${url}...`);

      connection.onopen = () => {
          // fires when the server message received indicating an open connection
          console.log("WebSocket connection is open.");
          next();
      };
      
      connection.onclose = () => {
          // fires when the server message received indicating a closed connection
          console.log("WebSocket connection is closed.");
          alert('Socket server disconnected!');
      };
      
      connection.onerror = e => {
          // fires when the server indicates a websocket error
          console.error("WebSocket error observed:", e);
      };
      
      
      connection.onmessage = e => {
          const data = JSON.parse(e.data);
          console.log(data);

          if (data.type === "create") {
              this.setState({
                  roomCode: data.roomCode
              });
          }
          else if (data.type === "join") {
              if (data.status === "okay") {
                this.setState({
                  roomCode: data.roomCode
                });
              }
          } 
          else if (data.type === "suggest") {
              this.setState({
                 allSuggestions: data.suggestions
              });
          }
          // TODO: decide what to do when we recieve a message :)
          // Basically, update screen with new info (participants/suggestions/votes)
      };
  }

  sendMessage = (data) => {
    const connection = this.state.connection;
    if (connection) {
      connection.send(JSON.stringify(data));
    }
  }

  createRoom = () => {
    if (this.props.name === "") {
      console.log("Please enter a name oh god oh fuck");
    } else {
      this.initializeConnection(() => {
        this.sendMessage({
          type: "create",
          name: this.state.name
        });
      });
      this.props.history.push('/suggest');
    }
  }

  toggleJoinInput = () => {
    this.setState({
      showJoin: !this.state.showJoin
    });
  }

  toggleCreateInput = () => {
    this.setState({
      showCreate: !this.state.showCreate
    });
  }

  handleRoomInput = ev => {
    this.setState({
      inputtedCode: ev.target.value
    });
  }

  handleNameInput = ev => {
    this.setState({
      name: ev.target.value
    });
  }
  
  joinRoom = () => {
    console.log("gooooo");
    this.initializeConnection(() => {
      this.sendMessage({
        type: "join",
        roomCode: parseInt(this.state.inputtedCode),
        name: this.state.name
      });
    });
  }

  handleSuggestionInput = ev => {
    this.setState({
      inputtedSuggestion: ev.target.value
    });
  }

  submitSuggestion = () => {
    const { roomCode, inputtedSuggestion } = this.state;
    this.sendMessage({
      type: "suggest",
      roomCode: roomCode,
      suggestion: inputtedSuggestion
    })
  }

  render() {
      return (
        <div>
          <HeaderBar title="Can't Decide?"/>
          <div id="home">
            { !(this.state.showJoin || this.state.showCreate) &&
              <div id="home-buttons">
                <button className="btn" onClick={this.toggleCreateInput}>Create Room</button>
                {/* Room Code: {this.state.roomCode} */}
                <button className="btn" onClick={this.toggleJoinInput}>Join Room</button>
              </div>
            }
            { this.state.showJoin && <JoinRoom handleRoomInput={this.handleRoomInput} handleNameInput={this.handleNameInput} joinRoom={this.joinRoom} cancelJoin={this.toggleJoinInput}/> }
            { this.state.showCreate && <CreateRoom handleNameInput={this.handleNameInput} cancelCreate={this.toggleCreateInput} createRoom={this.createRoom}/> }
          </div>
        </div>
      );
    }
}

export default Home;
