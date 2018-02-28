import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./SearchForm.css";

class SearchForm extends Component {
  constructor(props) {
    super(props);
    const params = new URLSearchParams(props.location.search);
    let query = params.get("query");
    this.state = {
      search: query
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.location.pathname);
    if (nextProps.location.pathname !== "/search") {
      this.setState({ search: "" });
    }
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
    const cssClass = this.props.small ? "SearchForm--small" : "SearchForm";
    return (
      <form
        className={`uk-search uk-search-default ${cssClass}`}
        onSubmit={this.handleSubmit}
      >
        <input
          className="uk-search-input"
          type="search"
          placeholder="Search GitHub"
          onChange={this.handleChange}
          autoFocus
          value={this.state.search}
        />
      </form>
    );
  }
}

export default withRouter(SearchForm);
