import React from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { user as userQuery } from "./User.query";
import Spinner from "../../components/Spinner";
import RepoListing from "../../components/RepoListing/RepoListing";

const User = props => {
  const user = props.match.params.user;
  return (
    <div>
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
              <div>
                {userData.avatarUrl && (
                  <img
                    src={userData.avatarUrl}
                    alt={`${user} avatar`}
                    width="230"
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
                  <div>
                    {userData.repositories.edges.length &&
                      userData.repositories.edges.map((data, idx) => {
                        return (
                          <RepoListing
                            key={data.node.nameWithOwner}
                            data={data.node}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          }
          return html;
        }}
      </Query>
    </div>
  );
};

export default withRouter(User);
