import React, { Component } from 'react';
import logo from './flappy-bird-logo.png';
import './App.css';
import Flappy from './flappybird/flappybird'
import Lesson from './canvas_websocket_lesson'

class App extends Component {
  render() {
    return (
      <div className="App">
        {
          (data => data ? <Lesson /> : <Flappy />)(1)
        }
        {/*<Flappy/>*/}
      </div>
    );
  }
}

export default App;
