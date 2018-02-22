import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink, InMemoryCache } from "apollo-boost";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Search from "./pages/Search/Search";
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
    <div>
      <Router>
        <div>
          <Header />
          <div className="uk-card uk-card-default uk-padding-small">
            <Route exact path="/" component={Home} />
            <Route path="/search" component={Search} />
          </div>
        </div>
      </Router>
    </div>
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
