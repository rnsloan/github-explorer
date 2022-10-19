import React from "react";
import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet";
import { withRouter, Link } from "react-router-dom";
import { repo as repoQuery } from "./Repo.query";
import Spinner from "../../components/Spinner";
import Error from "../../components/Error/Error";
import "./Repo.css";

const Blob = (props) => {
  let output;
  if (props.data.repository.object.isBinary) {
    const url =
      `https://raw.githubusercontent.com${props.location.pathname}`.replace(
        "blob/",
        ""
      );
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

const Tree = (props) => {
  const pathname = props.location.pathname;
  return (
    <ul className="Tree">
      {props.data.repository.object.entries.map((obj, idx) => {
        let url = `${pathname}/${obj.type}/${props.data.repository.defaultBranchRef.name}/${obj.name}`;

        if (pathname.match(/tree|blob/)) {
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

const Repo = (props) => {
  const path = props.location.pathname.replace(props.match.url, "");
  const userOrOrg = props.match.params.user;
  const repoName = props.match.params.repoName;

  let gitRevExpression = "HEAD:";
  let blobOrTreePath;
  let isUser = false;
  try {
    const split = path.match("/(tree|blob)/([^/]*)/(.*)");
    const branchName = split[2];
    blobOrTreePath = split[3];
    gitRevExpression = `${branchName}:${blobOrTreePath}`;
  } catch (e) {}

  const { loading, error, data } = useQuery(repoQuery, {
    variables: {
      repoOwner: userOrOrg,
      repoName,
      objectExpression: gitRevExpression,
    },
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
    html = (
      <div>
        <Helmet>
          <title>
            GitHub Explorer - {userOrOrg} / {repoName}
          </title>
        </Helmet>
        {data.repository.shortDescriptionHTML && (
          <p
            dangerouslySetInnerHTML={(() => {
              return {
                __html: `${data.repository.shortDescriptionHTML}`,
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
                user={userOrOrg}
                repoName={repoName}
                blobOrTreePath={blobOrTreePath}
                location={props.location}
              />
            )}
          </div>
        )}
      </div>
    );
    if (data.repository.owner.__typename === "User") {
      isUser = true;
    }
  }

  return (
    <div>
      <h1 className="uk-h3">
        {isUser ? (
          <Link to={`/${userOrOrg}`}>{userOrOrg}</Link>
        ) : (
          <span>{userOrOrg}</span>
        )}{" "}
        / <Link to={`/${userOrOrg}/${repoName}`}>{repoName}</Link>
      </h1>
      {html}
    </div>
  );
};

export default withRouter(Repo);
