import React, { Component } from "react";
import axios from "../axios/api";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
const validator = require("validator");

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Name: "",
      Email: "",
      password: "",
      password_r: "",
      type: "A",
      Contact: "",
    };

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeContact = this.onChangeContact.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangePassword_r = this.onChangePassword_r.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
  }

  onChangeName(event) {
    this.setState({ Name: event.target.value });
  }

  onChangeEmail(event) {
    this.setState({ Email: event.target.value });
  }
  onChangeContact(event) {
    this.setState({ Contact: event.target.value });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  onChangePassword_r(event) {
    this.setState({ password_r: event.target.value });
  }
  onChangeType(event) {
    this.setState({ type: event.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    if (validator.isEmpty(this.state.Contact)) {
      alert("Contact cannot be empty!");
      return;
    }
    if (!validator.isInt(this.state.Contact)) {
      alert("Contact should be Integer!");
    }
    if (this.state.Contact.trim().length !== 10) {
      alert("Contact should be an Indian Number of 10 Digits!");
      return;
    }

    const newUser = {
      Name: this.state.Name,
      Email: this.state.Email,
      type: this.state.type,
      password: this.state.password,
      password_r: this.state.password_r,
      Contact: parseInt(this.state.Contact.trim()),
    };

    axios
      .post("api/user/register", newUser)
      .then((res) => {
        alert("Successfully Registered");
        window.location.href = "/login";
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.Name}
              onChange={this.onChangeName}
            />
          </div>
          <div className="form-group">
            <label>Email: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.Email}
              onChange={this.onChangeEmail}
            />
          </div>
          <div className="form-group">
            <label>Contact : </label>
            <input
              type="text"
              className="form-control"
              value={this.state.Contact}
              onChange={this.onChangeContact}
            />
          </div>
          <div className="form-group">
            <label>Password: </label>
            <input
              type="password"
              className="form-control"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </div>
          <div className="form-group">
            <label>Retype Password: </label>
            <input
              type="password"
              className="form-control"
              value={this.state.password_r}
              onChange={this.onChangePassword_r}
            />
          </div>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Type</Form.Label>
            <Form.Control
              as="select"
              value={this.state.type}
              onChange={this.onChangeType}
              inputRef={(el) => (this.inputEl = el)}
            >
              <option value="A">Applicant</option>
              <option value="R">Recruiter</option>
            </Form.Control>
          </Form.Group>
          <div className="form-group">
            <input type="submit" value="Register" className="btn btn-primary" />
          </div>
        </Form>
      </div>
    );
  }
}
