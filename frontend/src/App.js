import logo from "./logo.svg";
import "./App.css";
import LoginGoogle from "./Pages/Authentications/LoginGoogle";
import LoginFacebook from "./Pages/Authentications/LoginFacebook";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <LoginGoogle />
        <LoginFacebook />
      </header>
    </div>
  );
}

export default App;
