import React from "react";
import { Query } from "react-apollo";
import Header from "../components/Header/Header";
import Spinner from "../components/Spinner";
import Repo from "../components/Repo";
import { search as searchQuery } from "../components/Queries";
import "./Home.css";

const Home = () => (
  <div>
    <Header />
    <div className="uk-card uk-card-default uk-padding-small">
      <div className="uk-text-center">
        <form className="uk-search uk-search-default width80">
          <input
            className="uk-search-input"
            type="search"
            placeholder="Search GitHub"
          />
        </form>
      </div>
      <Query query={searchQuery()}>
        {({ loading, error, data }) => {
          let html = (
            <div className="uk-text-center">
              <Spinner />
            </div>
          );

          if (data) {
            html = (
              <div className="repo-grid">
                {data.search.edges.map(data => {
                  return (
                    <Repo key={data.node.nameWithOwner} data={data.node} />
                  );
                })}
              </div>
            );
          }

          return (
            <div>
              <h1 className="uk-text-center uk-heading-line">
                <span>Popular repositories</span>
              </h1>
              {html}
            </div>
          );
        }}
      </Query>
    </div>
  </div>
);

export default Home;
