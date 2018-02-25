import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import Spinner from "../../components/Spinner";
import RepoListing from "../../components/RepoListing/RepoListing";
import { home as homeQuery } from "./Home.query";
import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ search: event.currentTarget.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.search === "") return;
    this.props.history.push(`/search?query=${this.state.search}`);
  }

  render() {
    return (
      <div>
        <div className="uk-text-center">
          <form
            className="uk-search uk-search-default Home-width80"
            onSubmit={this.handleSubmit}
          >
            <input
              className="uk-search-input"
              type="search"
              placeholder="Search GitHub"
              onChange={this.handleChange}
              autoFocus
            />
          </form>
        </div>
        <Query query={homeQuery}>
          {({ loading, error, data }) => {
            let html = (
              <div className="uk-text-center">
                <Spinner />
              </div>
            );

            if (data) {
              html = (
                <div className="Home-repo-grid">
                  {data.search.edges.map(data => {
                    return (
                      <div
                        key={data.node.nameWithOwner}
                        className="Home-RepoListing-wrapper"
                      >
                        <RepoListing data={data.node} />
                      </div>
                    );
                  })}
                </div>
              );
            }

            return (
              <div>
                <h1 className="uk-text-center uk-heading-line">
                  <span>Popular repositories</span>
                </h1>
                {html}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default withRouter(Home);
