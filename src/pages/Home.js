import React from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { DateTime } from "luxon";
import Header from "../compoonents/Header/Header";
import Spinner from "../compoonents/Spinner";
import "./Home.css";

const dt = DateTime.local()
  .minus({ days: 7 })
  .toISODate();
const query = gql`
  query {
    search(
      query: "stars:>300 created:>${dt}"
      type: REPOSITORY
      first: 10
    ) {
      edges {
        node {
          ...Repo
        }
      }
    }
  }

  fragment Repo on Repository {
    nameWithOwner
    shortDescriptionHTML
    owner {
      avatarUrl
    }
    stargazers {
      totalCount
    }
  }
`;

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

const Home = () => (
  <div>
    <Header />
    <div className="uk-card uk-card-default uk-padding-small">
      <div className="uk-text-center">
        <form className="uk-search uk-search-default width80">
          <input
            className="uk-search-input"
            type="search"
            placeholder="Search GitHub"
          />
        </form>
      </div>
      <Query query={query}>
        {({ loading, error, data }) => {
          let html = (
            <div className="uk-text-center">
              <Spinner />
            </div>
          );

          if (data) {
            html = (
              <div className="repo-grid">
                {data.search.edges.map(data => {
                  return (
                    <Repo key={data.node.nameWithOwner} data={data.node} />
                  );
                })}
              </div>
            );
          }

          return (
            <div>
              <h1 className="uk-text-center uk-heading-line">
                <span>Popular repositories</span>
              </h1>
              {html}
            </div>
          );
        }}
      </Query>
    </div>
  </div>
);

export default Home;
