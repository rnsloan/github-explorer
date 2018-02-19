import { gql } from "apollo-boost";
import { DateTime } from "luxon";

const dt = DateTime.local()
  .minus({ days: 7 })
  .toISODate();

export const search = (query = `"stars:>300 created:>${dt}"`) => {
  return gql`
  query {
    search(query: ${query}, type: REPOSITORY, first: 10) {
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
};
