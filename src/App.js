import React from 'react';
import ListPage from './Components/ListPage/ListPage';
import Navigation from './Components/Navigation/Navigation'
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <Navigation></Navigation>
      </header>
      <main>
        <ListPage></ListPage>
      </main>
    </div>
  );
}

export default App;
