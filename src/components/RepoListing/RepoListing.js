import React from "react";
import { Link } from "react-router-dom";
import "./RepoListing.css";
import star from "./star.svg";

const RepositoryTopics = ({ data }) => {
  return (
    <ul className="uk-subnav uk-subnav-pill">
      {data.map(repositoryTopic => {
        return (
          <li key={repositoryTopic.node.topic.name}>
            <a href={repositoryTopic.node.url}>
              {repositoryTopic.node.topic.name}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

const RepoListing = ({ data, doNotShowAvatar }) => {
  return (
    <article className="uk-card uk-card-small uk-card-body uk-card-default">
      <header className="uk-grid uk-grid-small uk-flex-middle">
        {!doNotShowAvatar && (
          <div className="uk-width-auto">
            <img
              src={data.owner.avatarUrl}
              alt={`${data.owner.login} avatar`}
              width="50"
              height="50"
            />
          </div>
        )}
        <div className="uk-width-expand">
          <h2 className="uk-h4 RepoListing-title">
            <Link to={`/${data.nameWithOwner}`}>{data.nameWithOwner}</Link>&nbsp;
            <span
              title="stars in the last week"
              aria-label="stars in the last week"
              className="uk-badge RepoListing-badge"
            >
              <img src={star} alt="" className="RepoListing-star" />
              {data.stargazers.totalCount}
            </span>
          </h2>
        </div>
      </header>
      <div className="uk-padding-small uk-padding-remove-horizontal uk-padding-remove-bottom">
        <p
          dangerouslySetInnerHTML={(() => {
            return { __html: `${data.shortDescriptionHTML}` };
          })()}
        />
      </div>
      {data.repositoryTopics &&
        data.repositoryTopics.edges && (
          <RepositoryTopics data={data.repositoryTopics.edges} />
        )}
      {data.licenseInfo && (
        <p>
          <small>{data.licenseInfo.name}</small>
        </p>
      )}
    </article>
  );
};

export default RepoListing;
