import { gql } from "apollo-boost";
import { DateTime } from "luxon";

const dt = DateTime.local()
  .minus({ days: 7 })
  .toISODate();

export const home = gql`
  query home {
    search(query: "stars:>300 created:>${dt}", type: REPOSITORY, first: 10) {
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

export const search = gql`
  query search(
    $query: String!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $type: SearchType!
  ) {
    search(
      query: $query
      after: $after
      before: $before
      type: $type
      first: $first
      last: $last
    ) {
      issueCount
      userCount
      repositoryCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...IssueSearch
          ...RepoSearch
          ...UserSearch
        }
      }
    }
  }

  fragment UserSearch on User {
    login
    name
    avatarUrl
    url
    bioHTML
    location
    email
  }

  fragment IssueSearch on Issue {
    title
    bodyHTML
    number
    createdAt
    url
    author {
      login
    }
    repository {
      nameWithOwner
      url
    }
    comments(first: 1) {
      totalCount
    }
  }

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
