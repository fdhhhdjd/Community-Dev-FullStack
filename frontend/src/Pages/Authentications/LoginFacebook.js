import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { AiFillFacebook } from "@react-icons/all-files/ai/AiFillFacebook";
import axios from "axios";
const LoginFacebook = () => {
  const responseFacebook = async (response) => {
    console.log(response);
    if (response.accessToken) {
      await axios
        .post("/api/auth/facebook", {
          userID: response.userID,
          accessToken: response.accessToken,
        })
        .then((items) => {
          console.log(items);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Error");
    }
  };
  return (
    <React.Fragment>
      <FacebookLogin
        // appId={process.env.REACT_APP_KEY_FACEBOOK}
        appId={process.env.REACT_APP_KEY_FACEBOOK_TEST}
        autoLoad={false}
        callback={responseFacebook}
        icon="fa-facebook"
        cssClass="btnFacebook"
        render={(renderProps) => (
          <button
            className="btn btn__social btn--fb"
            onClick={renderProps.onClick}
          >
            <i>
              <AiFillFacebook />
            </i>
            <span>Continue with Facebook</span>
          </button>
        )}
      />
    </React.Fragment>
  );
};

export default LoginFacebook;
