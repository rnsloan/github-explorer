import React from "react";
import { withRouter, Link } from "react-router-dom";
import numeral from "numeral";
import { Query } from "react-apollo";
import Spinner from "../../components/Spinner";
import RepoListing from "../../components/RepoListing/RepoListing";
import UserListing from "../../components/UserListing/UserListing";
import IssueListing from "../../components/IssueListing/IssueListing";
import { search as searchQuery } from "../../components/Queries";
import "./Search.css";

const formatNumber = number => {
  const int = parseInt(number, 10);
  if (int > 999) {
    return numeral(int).format("0.0a");
  }
  return int;
};

const Search = props => {
  const params = new URLSearchParams(props.location.search);
  let query = params.get("query");
  let apiQuery = query;
  let headingText = "Repositories";
  let type = params.get("type");
  switch (type) {
    case "issue":
      apiQuery = `${query} is:issue`;
      headingText = "Issues";
      type = "ISSUE";
      break;
    case "user":
      apiQuery = `${query} type:user`;
      headingText = "Users";
      type = "USER";
      break;
    default:
      type = "REPOSITORY";
  }
  const resultLength = 10;
  const updateQuery = (previousResult, { fetchMoreResult }) => {
    const newEdges = fetchMoreResult.search.edges;
    return newEdges.length ? fetchMoreResult : previousResult;
  };

  return (
    <Query
      query={searchQuery}
      variables={{ query: apiQuery, first: resultLength, type }}
      notifyOnNetworkStatusChange={true}
      fetchPolicy="network-only"
    >
      {({ loading, error, data, fetchMore }) => {
        let html = (
          <div className="uk-text-center">
            <Spinner />
          </div>
        );

        if (data && !loading) {
          html = (
            <div className="Search-grid">
              <aside className="Search-grid-column">
                <div className="Search-types">
                  <ul className="uk-list uk-list-divider uk-margin-remove">
                    <li className="uk-active">
                      <Link to={`search?query=${query}`}>
                        <span>Repositories </span>
                        <span className="uk-badge">
                          {formatNumber(data.search.repositoryCount)}
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to={`search?query=${query}&type=issue`}>
                        <span>Issues</span>
                        <span className="uk-badge">
                          {formatNumber(data.search.issueCount)}
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to={`search?query=${query}&type=user`}>
                        <span>Users</span>
                        <span className="uk-badge">
                          {formatNumber(data.search.userCount)}
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </aside>
              <main className="Search-grid-main">
                <h1 className="uk-h3 uk-heading-divider">
                  {new Intl.NumberFormat().format(data.search.repositoryCount)}{" "}
                  {headingText}
                </h1>
                <div className="Search-grid-items">
                  {data.search.edges.map((data, idx) => {
                    if (type === "USER") {
                      return (
                        <UserListing key={data.node.login} data={data.node} />
                      );
                    }
                    if (type === "ISSUE") {
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
                            first: null
                          },
                          updateQuery
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
                            first: resultLength
                          },
                          updateQuery
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
          html = <p className="uk-h3 uk-text-center">No results</p>;
        }

        return html;
      }}
    </Query>
  );
};
export default withRouter(Search);
