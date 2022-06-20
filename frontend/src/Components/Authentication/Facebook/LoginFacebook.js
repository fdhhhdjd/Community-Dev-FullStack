import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { AiFillFacebook } from "@react-icons/all-files/ai/AiFillFacebook";
import axios from "axios";
import MessageNotification from "../../../utils/ShareHandle/index";
const LoginFacebook = () => {
  const { REACT_APP_KEY_FACEBOOK_TEST, REACT_APP_KEY_FACEBOOK } = process.env;
  const responseFacebook = async (response) => {
    if (response.accessToken) {
      try {
        await axios
          .post("/api/auth/facebook", {
            userID: response.userID,
            accessToken: response.accessToken,
          })
          .then((items) => {
            console.log(items);
          })
          .catch((err) => {
            MessageNotification(err, "error");
          });
      } catch (error) {
        MessageNotification(error, "error");
      }
    } else {
      MessageNotification("Server Fail @-@", "error");
    }
  };
  return (
    <React.Fragment>
      <FacebookLogin
        // appId={REACT_APP_KEY_FACEBOOK}
        appId={REACT_APP_KEY_FACEBOOK_TEST}
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
