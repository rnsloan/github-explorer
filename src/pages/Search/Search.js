import React from "react";
import { withRouter, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import numeral from "numeral";
import { Query } from "react-apollo";
import Spinner from "../../components/Spinner";
import Error from "../../components/Error/Error";
import RepoListing from "../../components/RepoListing/RepoListing";
import UserListing from "../../components/UserListing/UserListing";
import IssueListing from "../../components/IssueListing/IssueListing";
import { search as searchQuery } from "./Search.query";
import "../../shared/layout.css";
import "./Search.css";

const formatNumber = (number) => {
  const int = parseInt(number, 10);
  if (int > 999) {
    return numeral(int).format("0.0a");
  }
  return int;
};

const Search = (props) => {
  const params = new URLSearchParams(props.location.search);
  let query = params.get("query");
  let apiQuery = query;
  let headingText = "Repositories";
  let type = params.get("type") || "repository";
  let searchType;
  switch (type) {
    case "issue":
      apiQuery = `${query} is:issue`;
      headingText = "Issues";
      searchType = "ISSUE";
      break;
    case "user":
      apiQuery = `${query} type:user`;
      headingText = "Users";
      searchType = "USER";
      break;
    default:
      searchType = "REPOSITORY";
  }
  const resultLength = 10;
  const updateQuery = (previousResult, { fetchMoreResult }) => {
    const newEdges = fetchMoreResult.search.edges;
    return newEdges.length ? fetchMoreResult : previousResult;
  };

  return (
    <Query
      query={searchQuery}
      variables={{ query: apiQuery, first: resultLength, type: searchType }}
      notifyOnNetworkStatusChange={true}
      fetchPolicy="network-only"
    >
      {({ loading, error, data, fetchMore }) => {
        let html = (
          <div className="uk-text-center">
            <Spinner />
          </div>
        );

        if (error && !loading) {
          html = <Error />;
        }

        if (data && !loading) {
          const { repositoryCount, issueCount, userCount } = data.search;
          let headingNumber = repositoryCount;

          switch (type) {
            case "issue":
              headingNumber = issueCount;
              break;
            case "user":
              headingNumber = userCount;
              break;
          }

          html = (
            <div className="Layout-grid">
              <Helmet>
                <title>GitHub Explorer - Search: {query}</title>
              </Helmet>
              <aside className="Layout-grid-column">
                <div className="Search-types">
                  <ul className="uk-list uk-list-divider uk-margin-remove">
                    <li>
                      <Link
                        className={type === "repository" ? "Search-active" : ""}
                        to={`search?query=${query}`}
                      >
                        <span>Repositories</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={type === "issue" ? "Search-active" : ""}
                        to={`search?query=${query}&type=issue`}
                      >
                        <span>Issues</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={type === "user" ? "Search-active" : ""}
                        to={`search?query=${query}&type=user`}
                      >
                        <span>Users</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </aside>
              <main className="Layout-grid-main">
                <h1 className="uk-h3 uk-heading-divider">
                  {new Intl.NumberFormat().format(headingNumber)} {headingText}
                </h1>
                <div className="Layout-grid-items">
                  {data.search.edges.map((data, idx) => {
                    if (type === "user") {
                      return (
                        <UserListing key={data.node.login} data={data.node} />
                      );
                    }
                    if (type === "issue") {
                      return <IssueListing key={idx} data={data.node} />;
                    }
                    return (
                      <RepoListing
                        key={data.node.nameWithOwner}
                        data={data.node}
                      />
                    );
                  })}
                  <div className="Search-pagination">
                    <button
                      className="uk-button uk-button-default"
                      disabled={!data.search.pageInfo.hasPreviousPage}
                      onClick={() => {
                        fetchMore({
                          variables: {
                            before: data.search.pageInfo.startCursor,
                            after: null,
                            last: resultLength,
                            first: null,
                          },
                          updateQuery,
                        });
                      }}
                    >
                      Previous
                    </button>

                    <button
                      className="uk-button uk-button-default"
                      disabled={!data.search.pageInfo.hasNextPage}
                      onClick={() => {
                        fetchMore({
                          variables: {
                            after: data.search.pageInfo.endCursor,
                            before: null,
                            last: null,
                            first: resultLength,
                          },
                          updateQuery,
                        });
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </main>
            </div>
          );
        }

        if (data && data.search && !data.search.edges.length && !loading) {
          html = (
            <p className="uk-h3 uk-text-center">
              <Helmet>
                <title>GitHub Explorer - Search: {query}</title>
              </Helmet>
              No results
            </p>
          );
        }

        return html;
      }}
    </Query>
  );
};
export default withRouter(Search);
