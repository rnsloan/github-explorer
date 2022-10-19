import React from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@apollo/client";
import Spinner from "../../components/Spinner";
import Error from "../../components/Error/Error";
import SearchForm from "../../components/SearchForm/SearchForm";
import RepoListing from "../../components/RepoListing/RepoListing";
import { home as homeQuery } from "./Home.query";
import "./Home.css";

export default function Home() {
  const { loading, error, data } = useQuery(homeQuery);

  let html = (
    <div className="uk-text-center">
      <Spinner />
    </div>
  );

  if (error && !loading) {
    html = <Error />;
  }

  if (data && !loading) {
    html = (
      <div className="Home-repo-grid">
        {data.search.edges.map((data) => {
          return (
            <div
              key={data.node.nameWithOwner}
              className="Home-RepoListing-wrapper"
            >
              <RepoListing data={data.node} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>GitHub Explorer</title>
      </Helmet>
      <div className="uk-text-center">
        <SearchForm />
      </div>
      <div>
        <h1 className="uk-text-center uk-heading-line">
          <span>Popular repositories</span>
        </h1>
        {html}
      </div>
    </div>
  );
}
