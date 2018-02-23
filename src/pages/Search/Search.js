import React from "react";
import { withRouter, Link } from "react-router-dom";
import { Query } from "react-apollo";
import Spinner from "../../components/Spinner";
import RepoListing from "../../components/RepoListing/RepoListing";
import { search as searchQuery } from "../../components/Queries";
import "./Search.css";

const Search = props => {
  const params = new URLSearchParams(props.location.search);
  const query = params.get("query");
  const type = params.get("type").toUpperCase() || "REPOSITORY";
  const resultLength = 10;
  const updateQuery = (previousResult, { fetchMoreResult }) => {
    const newEdges = fetchMoreResult.search.edges;
    return newEdges.length ? fetchMoreResult : previousResult;
  };
  return (
    <Query
      query={searchQuery}
      variables={{ query, first: resultLength, type }}
      notifyOnNetworkStatusChange={true}
    >
      {({ loading, error, data, fetchMore }) => {
        let html = (
          <div className="uk-text-center">
            <Spinner />
          </div>
        );

        if (data && !loading) {
          html = (
            <div className="search-grid">
              <aside className="search-grid-column">
                <div className="search-types">
                  <ul className="uk-list uk-list-divider uk-margin-remove">
                    <li className="uk-active">
                      <Link to={`search?query=${query}&type=repository`}>
                        <span>Repositories </span>
                        <span className="uk-badge">
                          {data.search.repositoryCount}
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to={`search?query=${query}&type=issue`}>
                        <span>Issues</span>
                        <span className="uk-badge">
                          {data.search.issueCount}
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to={`search?query=${query}&type=user`}>
                        <span>Users</span>
                        <span className="uk-badge">
                          {data.search.userCount}
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </aside>
              <main className="search-grid-main">
                <h1 className="uk-h3 uk-heading-divider">
                  {new Intl.NumberFormat().format(data.search.repositoryCount)}{" "}
                  Repository results
                </h1>
                <div className="repo-grid-search">
                  {data.search.edges.map(data => {
                    return (
                      <RepoListing
                        key={data.node.nameWithOwner}
                        data={data.node}
                      />
                    );
                  })}
                  <div className="pagination">
                    <button
                      className="uk-button uk-button-default"
                      disabled={!data.search.pageInfo.hasPreviousPage}
                      onClick={() => {
                        fetchMore({
                          variables: {
                            before: data.search.pageInfo.startCursor,
                            after: "",
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
                            before: "",
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
