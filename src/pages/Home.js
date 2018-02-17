import React from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import Header from "../compoonents/Header/Header";

const GET_DOG = gql`
  query {
    search(query: "lang:javascript", type: REPOSITORY, first: 20) {
      edges {
        node {
          ...Repo
        }
      }
    }
  }

  fragment Repo on Repository {
    name
    shortDescriptionHTML
  }
`;

const Home = () => (
  <Query query={GET_DOG}>
    {({ loading, error, data }) => {
      console.log(loading, error, data);
      return (
        <div>
          <Header />
          <div className="uk-text-center uk-card uk-card-default uk-padding-small">
            <form
              className="uk-search uk-search-default"
              style={{ width: "80%" }}
            >
              <input
                className="uk-search-input"
                type="search"
                placeholder="Search GitHub"
              />
            </form>
            <h1 className="uk-heading-line">
              <span>Trending repositories</span>
            </h1>
          </div>
        </div>
      );
    }}
  </Query>
);

export default Home;
