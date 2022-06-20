import React from "react";
import { GoogleLogin } from "react-google-login";
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import { useState } from "react";
import axios from "axios";
const LoginGoogle = () => {
  const { REACT_APP_GOOGLE_CLIENT_ID } = process.env;
  const [showLoginButton, setShowLoginButton] = useState(true);

  const onLoginSuccess = async (res) => {
    setShowLoginButton(false);
    await axios
      .post("/api/auth/google", {
        tokenId: res.tokenId,
      })
      .then((items) => {
        console.log(items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onLoginFailure = (res) => {};
  return (
    <React.Fragment>
      {showLoginButton && (
        <GoogleLogin
          clientId={REACT_APP_GOOGLE_CLIENT_ID}
          render={(renderProps) => (
            <button
              className="btn btn__social"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <i>
                <FcGoogle />
              </i>
              <span>Continue with Google</span>
            </button>
          )}
          buttonText="Login"
          onSuccess={onLoginSuccess}
          onFailure={onLoginFailure}
          cookiePolicy={"single_host_origin"}
        />
      )}
    </React.Fragment>
  );
};

export default LoginGoogle;
