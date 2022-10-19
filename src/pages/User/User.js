import React from "react";
import { withRouter } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet";
import { user as userQuery } from "./User.query";
import Spinner from "../../components/Spinner";
import Error from "../../components/Error/Error";
import RepoListing from "../../components/RepoListing/RepoListing";
import "../../shared/layout.css";
import "./User.css";

const User = (props) => {
  const user = props.match.params.user;
  const resultLength = 30;
  const updateQuery = (previousResult, { fetchMoreResult }) => {
    const newEdges = fetchMoreResult.user.repositories.edges;
    return newEdges.length ? fetchMoreResult : previousResult;
  };

  const { loading, error, data, fetchMore } = useQuery(userQuery, {
    variables: {
      login: user,
      first: resultLength,
    },
    notifyOnNetworkStatusChange: true,
  });

  let html = (
    <div className="uk-text-center">
      <Spinner />
    </div>
  );

  if (error && !loading) {
    html = <Error />;
  }

  if (data && !loading) {
    const userData = data.user;
    html = (
      <div className="Layout-grid--flip-order">
        <Helmet>
          <title>GitHub Explorer - {user}</title>
        </Helmet>
        <aside className="Layout-grid-column">
          {userData.avatarUrl && (
            <img
              className="User-avatar"
              src={userData.avatarUrl}
              alt={`${user} avatar`}
            />
          )}
          <div>
            <h1 className="uk-h4">{user}</h1>
            {userData.bioHTML && (
              <p
                dangerouslySetInnerHTML={(() => {
                  return {
                    __html: `${userData.bioHTML}`,
                  };
                })()}
              />
            )}
            {userData.company && <p>{userData.company}</p>}
            {userData.location && <p>{userData.location}</p>}
          </div>
        </aside>
        <main className="Layout-grid-main">
          <div className="Layout-grid-items">
            {userData.repositories.edges.length &&
              userData.repositories.edges.map((data, idx) => {
                return (
                  <RepoListing
                    key={data.node.nameWithOwner}
                    data={data.node}
                    doNotShowAvatar={true}
                  />
                );
              })}
          </div>
          <div className="Layout-pagination">
            <button
              className="uk-button uk-button-default"
              disabled={!userData.repositories.pageInfo.hasPreviousPage}
              onClick={() => {
                fetchMore({
                  variables: {
                    before: userData.repositories.pageInfo.startCursor,
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
              disabled={!userData.repositories.pageInfo.hasNextPage}
              onClick={() => {
                fetchMore({
                  variables: {
                    after: userData.repositories.pageInfo.endCursor,
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
        </main>
      </div>
    );
  }

  return html;
};

export default withRouter(User);
