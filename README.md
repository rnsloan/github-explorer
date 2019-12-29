# GitHub Explorer

GitHub client with the v4 GraphQL API using [Apollo Client](https://www.apollographql.com/client/) and CSS Grid.

![preview](https://user-images.githubusercontent.com/2513462/36777146-7c7e9fac-1cbc-11e8-8229-6ecedf73c7c7.gif)

## Development

### Environment Variables

copy `.env.local.example` and name `.env.local` or one of the other file names detailed here [https://create-react-app.dev/docs/adding-custom-environment-variables/](https://create-react-app.dev/docs/adding-custom-environment-variables/).

### Non-Environment Variables

- copy `token.sample.js` and name `token.js`. Insert a GitHub API token with the following scopes [https://developer.github.com/v4/guides/forming-calls/#authenticating-with-graphql](https://developer.github.com/v4/guides/forming-calls/#authenticating-with-graphql).

run `yarn start` / `npm start`.

Built with [create-react-app](https://github.com/facebook/create-react-app)
