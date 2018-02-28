import React from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { Helmet } from "react-helmet";
import { user as userQuery } from "./User.query";
import Spinner from "../../components/Spinner";
import RepoListing from "../../components/RepoListing/RepoListing";
import "../../shared/layout.css";
import "./User.css";

const User = props => {
  const user = props.match.params.user;
  return (
    <Query
      query={userQuery}
      variables={{
        login: user
      }}
    >
      {({ loading, error, data }) => {
        console.log(data);
        let html = (
          <div className="uk-text-center">
            <Spinner />
          </div>
        );

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
                          __html: `${userData.bioHTML}`
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
              </main>
            </div>
          );
        }
        return html;
      }}
    </Query>
  );
};

export default withRouter(User);
