import { gql } from "@apollo/client";
import { repoFragment } from "../../shared/queries";

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

  ${repoFragment}
`;
