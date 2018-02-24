import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => (
  <div className="Header">
    <Link to="/">GitHub Explorer</Link>
  </div>
);

export default Header;
