import React from "react";
import { Query } from "react-apollo";
import { withRouter, Link } from "react-router-dom";
import { repo as repoQuery } from "./Repo.query";
import Spinner from "../../components/Spinner";
import "./Repo.css";

const Blob = props => {
  let output;
  if (props.data.repository.object.isBinary) {
    const url = `https://raw.githubusercontent.com${
      props.location.pathname
    }`.replace("blob/", "");
    if (props.location.pathname.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
      output = <img src={url} alt="" />;
    } else {
      output = <a href={url}>{url}</a>;
    }
  } else {
    output = <pre>{props.data.repository.object.text}</pre>;
  }

  return (
    <div>
      <h2 className="uk-h5">
        <Link to={`/${props.user}/${props.repoName}`}>{props.repoName}</Link> /{" "}
        {props.blobOrTreePath.replace(/\//g, " / ")}
      </h2>
      {output}
    </div>
  );
};

const Tree = props => {
  const pathname = props.location.pathname;
  return (
    <ul className="Tree">
      {props.data.repository.object.entries.map((obj, idx) => {
        let url = `${pathname}/${obj.type}/${
          props.data.repository.defaultBranchRef.name
        }/${obj.name}`;

        if (pathname.match(/tree|blob/)) {
          console.log(url);
          url = pathname.replace(/tree|blob/, obj.type);
          url = `${url}/${obj.name}`;
        }
        return (
          <li
            className={url.match("tree") ? "Tree-tree" : "Tree-blob"}
            key={idx}
          >
            <Link to={url}>{obj.name}</Link>
          </li>
        );
      })}
    </ul>
  );
};

const Repo = props => {
  const path = props.location.pathname.replace(props.match.url, "");
  const user = props.match.params.user;
  const repoName = props.match.params.repoName;

  let gitRevExpression = "HEAD:";
  let blobOrTreePath;
  try {
    const split = path.match("/(tree|blob)/([^/]*)/(.*)");
    const branchName = split[2];
    blobOrTreePath = split[3];
    gitRevExpression = `${branchName}:${blobOrTreePath}`;
  } catch (e) {}

  return (
    <div>
      <h1 className="uk-h3">
        <Link to={`/${user}`}>{user}</Link> /{" "}
        <Link to={`/${user}/${repoName}`}>{repoName}</Link>
      </h1>
      <Query
        query={repoQuery}
        variables={{
          repoOwner: user,
          repoName,
          objectExpression: gitRevExpression
        }}
      >
        {({ loading, error, data }) => {
          let html = (
            <div className="uk-text-center">
              <Spinner />
            </div>
          );

          if (data && !loading) {
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
                {data.repository.object && (
                  <div>
                    {data.repository.object.entries ? (
                      <Tree data={data} location={props.location} />
                    ) : (
                      <Blob
                        data={data}
                        user={user}
                        repoName={repoName}
                        blobOrTreePath={blobOrTreePath}
                        location={props.location}
                      />
                    )}
                  </div>
                )}
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
