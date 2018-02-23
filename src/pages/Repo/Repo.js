import React from "react";
import { withRouter } from "react-router-dom";

const Repo = props => {
  const repoName = props.location.pathname.slice(1);
  return <div>{repoName}</div>;
};
export default withRouter(Repo);
