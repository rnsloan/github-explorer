import React from "react";

const Repo = ({ data }) => {
  return (
    <article className="uk-card uk-card-small uk-card-body uk-card-default">
      <header className="uk-grid uk-grid-small uk-flex-middle">
        <div className="uk-width-auto">
          <img
            src={data.owner.avatarUrl}
            alt={`${data.owner.login} avatar`}
            width="50"
            height="50"
          />
        </div>
        <div className="uk-width-expand">
          <h4>
            <a href="#">{data.nameWithOwner}</a>&nbsp;
            <span
              title="stars in the last week"
              aria-label="stars in the last week"
              className="uk-badge"
            >
              {data.stargazers.totalCount}
            </span>
          </h4>
        </div>
      </header>
      <div className="uk-padding-small uk-padding-remove-horizontal uk-padding-remove-bottom">
        <p
          dangerouslySetInnerHTML={(() => {
            return { __html: `${data.shortDescriptionHTML}` };
          })()}
        />
      </div>
    </article>
  );
};

export default Repo;
