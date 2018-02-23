import React from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import Spinner from "../../components/Spinner";
import Repo from "../../components/Repo/Repo";
import { search as searchQuery } from "../../components/Queries";
import "./Search.css";

const Search = props => {
  const params = new URLSearchParams(props.location.search);
  const query = params.get("query");
  const resultLength = 10;
  const updateQuery = (previousResult, { fetchMoreResult }) => {
    console.log("updateQuery");
    const newEdges = fetchMoreResult.search.edges;
    if (newEdges.length) {
      return fetchMoreResult;
    }

    return previousResult;
  };
  return (
    <div>
      <h1 className="uk-h2">
        Results for: <span>{query}</span>
      </h1>
      <Query
        query={searchQuery}
        variables={{ query, first: resultLength }}
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
              <div className="repo-grid-search">
                {data.search.edges.map(data => {
                  return (
                    <Repo key={data.node.nameWithOwner} data={data.node} />
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
            );
          }

          if (data && data.search && !data.search.edges.length && !loading) {
            html = <p className="uk-h3 uk-text-center">No results</p>;
          }

          return <div>{html}</div>;
        }}
      </Query>
    </div>
  );
};

export default withRouter(Search);
