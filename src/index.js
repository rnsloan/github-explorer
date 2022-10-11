import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink, InMemoryCache } from "apollo-boost";
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Search from "./pages/Search/Search";
import Repo from "./pages/Repo/Repo";
import User from "./pages/User/User";
import introspectionQueryResultData from "./fragmentTypes.json";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";

let token = process.env.REACT_APP_GITHUB_TOKEN;

if (!token) {
  throw new Error(
    "Could not find environment variable 'REACT_APP_GITHUB_TOKEN'"
  );
}

const headers = {
  authorization: `bearer ${token}`,
};

const httpLink = new HttpLink({
  uri: "https://api.github.com/graphql",
  headers: headers,
});

// fragment matching for SearchResultItem Union
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

// ApolloClient from apollo-boost is not setting fetch headers
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({ fragmentMatcher }),
});

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <Router>
        <div>
          <Header />
          <div className="uk-card uk-card-default uk-padding-small">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/search" component={Search} />
              <Route path="/:user/:repoName" component={Repo} />
              <Route path="/:user" component={User} />
              <Route render={() => <div>Page not found</div>} />
            </Switch>
          </div>
        </div>
      </Router>
    </div>
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
