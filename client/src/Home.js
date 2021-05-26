import './Home.css';
import React from 'react';

const ws = window.WebSocket || window.MozWebSocket;
const wssURI = 'ws://localhost';
const wssPort = '8081';

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        connection: null,
        roomCode: 0,
        inputtedCode: "",
        inputtedSuggestion: "",
        allSuggestions: [],
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
      this.initializeConnection(() => {
        this.sendMessage({
          type: "create"
        });
      });
  }

  handleRoomInput = ev => {
    this.setState({
      inputtedCode: ev.target.value
    });
  }
  
  joinRoom = () => {
    console.log("gooooo");
    this.initializeConnection(() => {
      this.sendMessage({
        type: "join",
        roomCode: parseInt(this.state.inputtedCode)
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
          <h1>Can't decide???</h1>
          <button onClick={this.createRoom}>Create Room</button>
          Room Code: {this.state.roomCode}
          <button onClick={this.joinRoom}>Join room</button>
          <input onChange={this.handleRoomInput}></input>
          <p>Input Suggestions:</p>
          <input onChange={this.handleSuggestionInput}></input>
          <button onClick={this.submitSuggestion}>Submit Suggestion</button>
          <p>Suggestions:</p>
          <ul>{this.state.allSuggestions.map(s => (
            <li key={s}>{s}</li>
          ))}</ul>
        </div>
      );
    }
}

export default App;
