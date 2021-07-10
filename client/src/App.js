import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Initial from './components/initial/Initial'
import Main from './components/main/Main'

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Initial}/>
        <Route exact path="/main" component={Main}/>
      </Router>
    </div>
  );
}

export default App;
