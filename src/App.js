import React from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import { Feed } from "./Components"

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Header of inf scroll template</h1>
          <Link className="App-link" to="/feed">
            Feed
          </Link>
        </header>
        <br/>
        <div className="App-body">
          <h2>App-body</h2>
          <Route path="/feed" component={Feed} />
        </div>
        <br/>
      </div>
    </Router>
  );
}

export default App;
