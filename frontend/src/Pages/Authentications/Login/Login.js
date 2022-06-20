import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import LoginFacebook from "../../../Components/Authentication/Facebook/index";
import Welcome from "../../../Components/Welcome/index";
import "../../../Styles/Auth.css";
import { loginForm, signupForm } from "../../../utils/ShareHandle/formConfig";
import useForm from "../../../Customs/UseForm/UseForm";
import LoginGoogle from "../../../Components/Authentication/Google/index";
import { appendData } from "../../../utils/ShareHandle/HandleInput";
import axios from "axios";
const Login = ({ newUser }) => {
  const { renderFormInputs, renderFormValues, isFormValid, setForm } =
    useForm(signupForm);

  useEffect(() => {
    if (!newUser) {
      setForm(loginForm);
    } else {
      setForm(signupForm);
    }
  }, [newUser, setForm]);

  const formValues = renderFormValues();
  const formInputs = renderFormInputs();
  const handleAuthSubmit = async (evt) => {
    evt.preventDefault();
    try {
      let responseData;
      if (newUser) {
      } else {
      }
    } catch (err) {}
  };
  return (
    <React.Fragment>
      <div className="container container-auth">
        <Welcome />
        <div className="auth__social">
          <LoginGoogle />
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
            {formInputs}

            <button
              className="btn btn__auth btn__auth--mode"
              onClick={handleAuthSubmit}
              disabled={!isFormValid()}
            >
              {newUser ? "Create account" : "Login"}
            </button>
            <Link
              className="btn btn__auth btn__auth--switch"
              to={newUser ? "/login" : "/register"}
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
