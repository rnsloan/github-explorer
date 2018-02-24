import React from "react";
import location from "./location.svg";
import email from "./email.svg";
import "./UserListing.css";

const User = ({ data }) => {
  return (
    <article className="uk-card uk-card-small uk-card-body uk-card-default">
      <header className="uk-grid uk-grid-small uk-flex-middle">
        {data.avatarUrl && (
          <div className="uk-width-auto">
            <img
              src={data.avatarUrl}
              alt={`${data.login} avatar`}
              width="50"
              height="50"
            />
          </div>
        )}
        <div className="uk-width-expand">
          <h4>
            <a href={data.url}>{data.login}</a>&nbsp;{data.name}
          </h4>
        </div>
      </header>
      <div className="uk-padding-small uk-padding-remove-horizontal uk-padding-remove-bottom">
        {data.bioHTML && (
          <p
            dangerouslySetInnerHTML={(() => {
              return { __html: `${data.bioHTML}` };
            })()}
          />
        )}
        <p>
          {data.location && (
            <span>
              <img src={location} alt="" className="location" />
              <small>{data.location}</small>
            </span>
          )}
          {data.email && (
            <span>
              <img src={email} alt="" className="email" />
              <small>{data.email}</small>
            </span>
          )}
        </p>
      </div>
    </article>
  );
};

export default User;
