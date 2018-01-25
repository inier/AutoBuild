// use to build a header
import React from "react";
import "./index.scss";

const Header = props => {
  return (
    <header className="header">
      <div className="logo" />
      {props.children}
    </header>
  );
};

export default Header;
