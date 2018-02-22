import React from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import Spinner from "../../components/Spinner";
import Repo from "../../components/Repo";
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
                <button
                  disabled={!data.search.pageInfo.hasPreviousPage}
                  onClick={() => {
                    fetchMore({
                      variables: {
                        before: data.search.pageInfo.startCursor,
                        after: "",
                        last: resultLength,
                        first: null
                      },
                      updateQuery: updateQuery
                    });
                  }}
                >
                  Previous
                </button>
                <button
                  disabled={!data.search.pageInfo.hasNextPage}
                  onClick={() => {
                    fetchMore({
                      variables: {
                        after: data.search.pageInfo.endCursor,
                        before: "",
                        last: null,
                        first: resultLength
                      },
                      updateQuery: updateQuery
                    });
                  }}
                >
                  Next
                </button>
              </div>
            );
          }

          return <div>{html}</div>;
        }}
      </Query>
    </div>
  );
};

export default withRouter(Search);
