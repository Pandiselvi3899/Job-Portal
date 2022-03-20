import React, { Component } from "react";
import axios from "../axios/api";
import "bootstrap/dist/css/bootstrap.min.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    axios
      .post("/api/user/login", {
        Email: this.state.email,
        password: this.state.password,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("type", response.data.type);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("contact", response.data.Contact);
        alert("Login Successful!");
        window.location.href = "/profile";
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
        this.setState({
          email: "",
          password: "",
        });
      });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Email: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.email}
              onChange={this.onChangeEmail}
            />
          </div>
          <div className="form-group">
            <label>Password: </label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-control"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="login" className="btn btn-primary" />
          </div>
        </form>
      </div>
    );
  }
}
