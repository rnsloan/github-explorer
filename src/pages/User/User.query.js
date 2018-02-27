import { gql } from "apollo-boost";
import { repoFragment } from "../../shared/queries";

export const user = gql`
  query user($login: String!) {
    user(login: $login) {
      bioHTML
      avatarUrl
      company
      location
      repositories(first: 30) {
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
