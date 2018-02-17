import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink, InMemoryCache } from "apollo-boost";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home";
import token from "./token";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";

const headers = {
  authorization: `bearer ${token}`
};

const httpLink = new HttpLink({
  uri: "https://api.github.com/graphql",
  headers: headers
});

// ApolloClient from apollo-boost is not setting fetch headers
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <Route exact path="/" component={Home} />
    </Router>
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
