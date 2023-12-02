import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Environment } from './db.js';

const MessageList = (props) => {
  return (
    <ul>
    {
      props.messages.map(m => (
        <li key={m.id}>{m.title}</li>
      ))
    }
    </ul>
  );
};



const App = () => {

  const [state, setState] = React.useState({todos: [], foos: []});
  const env = new Environment(setState);
  const cmd = env.commands;
  
  React.useEffect(() => {
    env.hydrate(state);
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
         <button onClick={() => cmd.createTodo(state)}>Add todo</button>
         <button onClick={() => cmd.createFoo(state)}>Add foo</button>
         <div style={{ display: `flex`, flex: 1 }}>
           <div style={{ display: `flex`, flexDirection: `column`, flex: 1 }}>
             <MessageList messages={state.todos} />
           </div>
           <div style={{ display: `flex`, flexDirection: `column`, flex: 1 }}>
             <MessageList messages={state.foos} />
           </div>
         </div>
      </header>
    </div>
  );
}

export default App;
