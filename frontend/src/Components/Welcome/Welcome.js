import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="welcome">
      <h2 className="welcome__title">Welcome to Community Dev Web</h2>
      <p className="welcome__slogan">
        <Link to="/">DEV Community</Link> is a community of 503.562.000 amazing
        developers
      </p>
    </div>
  );
};

export default Welcome;
