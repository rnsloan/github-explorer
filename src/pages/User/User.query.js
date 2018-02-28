import { gql } from "apollo-boost";
import { repoFragment } from "../../shared/queries";

export const user = gql`
  query user(
    $login: String!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    user(login: $login) {
      bioHTML
      avatarUrl
      company
      location
      repositories(
        after: $after
        before: $before
        first: $first
        last: $last
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            ...RepoSearch
          }
        }
      }
    }
  }

  ${repoFragment}
`;
