import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Standalone application with Electron, React, and SQLite stack.</h1>
      </header>
      <article>
        <p>
          Say <i>ping</i> to the main process.
        </p>

        <br />
        <p>Main process responses:</p>
        <br />
      </article>
    </div>
  );
}

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

render();
