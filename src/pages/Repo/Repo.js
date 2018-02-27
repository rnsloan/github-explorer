import React from "react";
import { Query } from "react-apollo";
import { withRouter, Link } from "react-router-dom";
import { repo as repoQuery } from "./Repo.query";
import Spinner from "../../components/Spinner";

const Repo = props => {
  //console.log(props);
  const path = props.location.pathname.replace(props.match.url, "");
  const user = props.match.params.user;
  const repoName = props.match.params.repoName;
  let isRoot = false;
  try {
    const split = path.match("/(tree|blob)/([^/]*)/(.*)");
    const branchName = split[2];
    const blobOrTreePath = split[3];
    const isBlob = path.indexOf("/blob/") !== -1;
  } catch (e) {
    isRoot = true;
  }
  // queries: root, tree, blob

  return (
    <div>
      <h1 className="uk-h3">
        <Link to={user}>{user}</Link> /{" "}
        <Link to={`${user}/${repoName}`}>{repoName}</Link>
      </h1>
      <Query
        query={repoQuery}
        variables={{ repoOwner: user, repoName, objectExpression: "HEAD:" }}
      >
        {({ loading, error, data }) => {
          let html = (
            <div className="uk-text-center">
              <Spinner />
            </div>
          );

          if (data && !loading) {
            //console.log(data);
            html = (
              <div>
                {data.repository.shortDescriptionHTML && (
                  <p
                    dangerouslySetInnerHTML={(() => {
                      return {
                        __html: `${data.repository.shortDescriptionHTML}`
                      };
                    })()}
                  />
                )}
                {data.repository.homepageUrl && <p>{data.homepageUrl}</p>}
                <ul>
                  {data.repository.object.entries.map((object, idx) => {
                    return (
                      <li key={idx}>
                        <Link
                          to={`${props.location.pathname}${object.type}/${
                            data.repository.defaultBranchRef.name
                          }/${object.name}`}
                        >
                          {object.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }
          return html;
        }}
      </Query>
    </div>
  );
};
export default withRouter(Repo);
