import React from "react";
import "./IssueListing.css";
import { DateTime } from "luxon";

const Issue = ({ data }) => {
  const date = DateTime.fromISO(data.createdAt).toFormat("DD");
  return (
    <article className="uk-card uk-card-small uk-card-body uk-card-default">
      <header className="uk-grid uk-grid-small uk-flex-middle">
        <div className="uk-width-expand">
          <h4>
            <a href={data.url}>{data.title}</a>
          </h4>
        </div>
        <div className="uk-width-auto">#{data.number}</div>
      </header>
      <div className="uk-padding-small uk-padding-remove-horizontal uk-padding-remove-bottom">
        <p
          dangerouslySetInnerHTML={(() => {
            return { __html: `${data.bodyHTML}` };
          })()}
        />
      </div>
      <footer className="footer">
        <div>
          <a href={data.repository.url}>{data.repository.nameWithOwner}</a>
        </div>
        <div>
          Opened by {data.author.login} on {date}
        </div>
        {!!data.comments.totalCount && (
          <div>{data.comments.totalCount} comments</div>
        )}
      </footer>
    </article>
  );
};

export default Issue;
