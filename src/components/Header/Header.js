import React from "react";
import { withRouter, Link } from "react-router-dom";
import SearchForm from "../SearchForm/SearchForm";
import "./Header.css";

const Header = () => {
  const isHome = window.location.pathname.length < 2;
  return (
    <div className="Header">
      <Link to="/">GitHub Explorer</Link>
      {!isHome && <SearchForm small={true} />}
    </div>
  );
};

export default withRouter(Header);
