import { gql } from "@apollo/client";

export const repoFragment = gql`
  fragment RepoSearch on Repository {
    nameWithOwner
    shortDescriptionHTML
    licenseInfo {
      name
    }
    stargazers {
      totalCount
    }
    owner {
      avatarUrl
      login
    }
    repositoryTopics(first: 5) {
      edges {
        node {
          url
          topic {
            name
          }
        }
      }
    }
  }
`;
