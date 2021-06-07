import './Home.css';
import React from 'react';
import HeaderBar from './HeaderBar.js';
import JoinRoom from './JoinRoom.js';
import CreateRoom from './CreateRoom.js';
import SuggestionsPage from './SuggestionsPage.js';
import VotingPage from './VotingPage.js';
import ResultsPage from './ResultsPage.js';


const ws = window.WebSocket || window.MozWebSocket;
const wssURI = 'ws://localhost:8081';
// const wssURI = window.location.origin.replace(/^http/, 'ws');
// const wssPort = '8081';

class Home extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        connection: null,
        roomCode: 0,
        isHost: false,
        inputtedCode: "",
        inputtedSuggestion: "",
        allSuggestions: [],
        allNames: [],
        name: "",
        screen: 0,
        selectedSuggestions: new Set(),
        numPeopleVoted: 0,
        winner: "",
      };
  }

  //////////////////////////////
  //  websocket communcation  //
  //////////////////////////////
  initializeConnection = (next) => {
      // const url = wssURI + ":" + wssPort;
      const url = wssURI;
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
            if (data.status === "okay") {
              this.setState({
                  roomCode: data.roomCode,
                  allNames: data.members,
                  isHost: true
              });
              this.changeScreen(3);
            }
          }
          else if (data.type === "join") {
              if (data.status === "okay") {
                this.setState({
                  roomCode: data.roomCode,
                  allNames: data.members,
                  allSuggestions: data.suggestions
                });
                this.changeScreen(3);
              }
          } 
          else if (data.type === "suggest") {
              this.setState({
                 allSuggestions: data.suggestions
              });
          } 
          else if (data.type === "startVote") {
            if (data.status === "okay") {
              this.setState({
                allSuggestions: data.suggestions
              });
              this.changeScreen(4)
            }
          }
          else if (data.type === "vote") {
            if (data.status === "okay") {
              this.setState({
                numPeopleVoted: data.numVoted,
              });
              if (data.done) {
                this.setState({
                  winner: data.winner,
                });
              }
            }
          }
          else if (data.type === "disconnect") {
            this.setState({
              allNames: data.members
            })
          }
      };

      window.addEventListener('beforeunload', () => {
        this.sendMessage({
          "type": "disconnect",
          "roomCode": this.state.roomCode,
          "name": this.state.name,
        });
      });
  }

  sendMessage = (data) => {
    const connection = this.state.connection;
    if (connection) {
      connection.send(JSON.stringify(data));
    }
  }

  //////////////////
  //  navigation  //
  //////////////////


  // 0 - home
  // 1 - home create
  // 2 - home join
  // 3 - suggest
  // 4 - voting
  // 5 - results
  changeScreen = screen => {
    this.setState({
      screen: screen
    });
  }

  //////////////////
  //  room setup  //
  //////////////////

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
    }
  }

  createRoomOnEnter = ev => {
    console.log("enter enter");
    if (ev.keyCode === 13) {
      this.createRoom();
    }
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

  joinRoomOnEnter = ev => {
    if (ev.keyCode === 13) {
      this.joinRoom();
    }
  }

  ////////////////////////////
  //  handling suggestions  //
  ////////////////////////////

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
  
  submitSuggestionOnEnter = ev => {
    if (ev.keyCode === 13) {
      this.submitSuggestion();
    }
  }

  endSuggestions = () => {
    const { roomCode } = this.state;
    this.sendMessage({
      type: "startVote",
      roomCode: roomCode,
    });
  }

  //////////////////////
  //  handling votes  //
  //////////////////////

  toggleVote = ev => {
    const { selectedSuggestions } = this.state;
    const suggestion = ev.target.name;
    if (ev.target.checked) {
      selectedSuggestions.add(suggestion);
    } else if (suggestion in selectedSuggestions) {
      selectedSuggestions.delete(suggestion);
    }
    this.setState({
      selectedSuggestions: selectedSuggestions
    });
  }
  
  submitVote = () => {
    const { roomCode, selectedSuggestions } = this.state;
    console.log("submitting", selectedSuggestions);
    this.sendMessage({
      type: "vote",
      roomCode: roomCode,
      selectedSuggestions: Array.from(selectedSuggestions)
    });
    this.changeScreen(5);
  }

  render() {
    switch(this.state.screen) {
      case 0: // home
        return (
          <div>
            <HeaderBar title="Can't Decide?"/>
            <div id="home">
                <div id="home-buttons">
                  <button className="btn" onClick={() => this.changeScreen(1)}>Create Room</button>
                  {/* Room Code: {this.state.roomCode} */}
                  <button className="btn" onClick={() => this.changeScreen(2)}>Join Room</button>
                </div>
            </div>
          </div>
        );
      case 1: // create
        return (
          <div>
            <HeaderBar title="Can't Decide?"/>
            <div id="home">
              <CreateRoom handleNameInput={this.handleNameInput} 
                          cancelCreate={() => this.changeScreen(0)} 
                          createRoom={this.createRoom}
                          createRoomOnEnter={this.createRoomOnEnter}/>
            </div>
          </div>
        );
      case 2: // join 
        return (
          <div>
            <HeaderBar title="Can't Decide?"/>
            <div id="home">
              <JoinRoom handleRoomInput={this.handleRoomInput} 
                        handleNameInput={this.handleNameInput} 
                        joinRoom={this.joinRoom} 
                        joinRoomOnEnter={this.joinRoomOnEnter}
                        cancelJoin={() => this.changeScreen(0)}/>
            </div>
          </div>
        );
      case 3: // suggest
        return (
          <div>
            <SuggestionsPage roomCode={this.state.roomCode} 
                             isHost={this.state.isHost} 
                             names={this.state.allNames} 
                             suggestions={this.state.allSuggestions} 
                             handleSuggestion={this.handleSuggestionInput} 
                             submitSuggestion={this.submitSuggestion}
                             submitSuggestionOnEnter={this.submitSuggestionOnEnter}
                             finishSuggestions={this.endSuggestions}/>
          </div>
        );
      case 4: // vote
        return (
          <div>
            <VotingPage roomCode={this.state.roomCode}
                        suggestions={this.state.allSuggestions}
                        toggleVote={this.toggleVote}
                        submitVote={this.submitVote}/>
          </div>
        );
      case 5: // result
        return (
          <div>
            <ResultsPage numVoted={this.state.numPeopleVoted} 
                         winner={this.state.winner}/>
          </div>
        );      
      default:
        console.log("what");
    }
  }
}

export default Home;
