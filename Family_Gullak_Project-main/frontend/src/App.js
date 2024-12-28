import About from './components/About';
import Home from './components/Home';
import Navbar from './components/Navbar';
import NoteState from './context/notes/NoteState';
import Signup from './components/Signup';
import Login from './components/Login';
import Component from './components/Footer';
import {BrowserRouter as Router,Switch,Route,} from "react-router-dom";
import AuthState from './context/auth/AuthState';
import AddNote from './components/AddNote';

function App() {
  return (
    <>
      {/* <ImageUpload/> */}
      <AuthState>
    <NoteState>
    <Router>
    <Navbar/>
      <Switch>
        <Route path="/about">
          <About/> 
        </Route>
        <Route path="/login">
          <Login/>
          
        </Route>
        <Route path="/signup">
          <Signup/> 
        </Route>
        <Route path="/addpolicy">
          <AddNote/>
        </Route>
        <Route path="/">
          <Home/>
        </Route>
      </Switch>
      <Component/>
    </Router>
    </NoteState>
    </AuthState>
    </>

  );
}

export default App;
