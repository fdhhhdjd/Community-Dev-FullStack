import React from "react";
import LoginFacebook from "../../../Components/Authentication/Facebook/index";
import Welcome from "../../../Components/Welcome/index";
import { Link } from "react-router-dom";
import "../../../Styles/Auth.css";
const Login = ({ newUser }) => {
  return (
    <React.Fragment>
      <div className="container container-auth">
        <Welcome />
        <div className="auth__social">
          <LoginFacebook />
        </div>

        <form className="form__auth">
          <div className="form__options">
            <p>Or</p>
            <h2>
              {newUser
                ? "Create a New Account"
                : "Log in using an Existing Account"}
            </h2>

            <button className="btn btn__auth btn__auth--mode">
              {newUser ? "Create account" : "Login"}
            </button>
            <Link
              className="btn btn__auth btn__auth--switch"
              to={newUser ? "/auth" : "/auth/new-user"}
            >
              {newUser ? "Login" : "Create account"}
            </Link>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default Login;
