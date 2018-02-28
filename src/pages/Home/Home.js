import React, { Component } from "react";
import { Query } from "react-apollo";
import Spinner from "../../components/Spinner";
import Error from "../../components/Error/Error";
import SearchForm from "../../components/SearchForm/SearchForm";
import RepoListing from "../../components/RepoListing/RepoListing";
import { home as homeQuery } from "./Home.query";
import "./Home.css";

class Home extends Component {
  render() {
    return (
      <div>
        <div className="uk-text-center">
          <SearchForm />
        </div>
        <Query query={homeQuery}>
          {({ loading, error, data }) => {
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
                  {data.search.edges.map(data => {
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
                <h1 className="uk-text-center uk-heading-line">
                  <span>Popular repositories</span>
                </h1>
                {html}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Home;
