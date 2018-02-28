import { gql } from "apollo-boost";

// $objectExpression = "HEAD:"
// $objectExpression = "HEAD:src/App.tsx"
export const repo = gql`
  query directory(
    $repoOwner: String!
    $repoName: String!
    $objectExpression: String
  ) {
    repository(owner: $repoOwner, name: $repoName) {
      name
      url
      shortDescriptionHTML
      homepageUrl
      defaultBranchRef {
        name
      }
      owner {
        __typename
      }
      object(expression: $objectExpression) {
        ... on Tree {
          commitUrl
          entries {
            name
            type
          }
        }
        ... on Blob {
          isBinary
          text
        }
      }
    }
  }
`;
