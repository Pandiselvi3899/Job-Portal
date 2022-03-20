//This is where Application happens... Error handling done
import React, { Component } from "react";
import axios from "../axios/api";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
var wordcount = require("wordcount");
const validator = require("validator");

export default class SOP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      e: this.props.location.state.e,
      sop: "",
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeSOP = this.onChangeSOP.bind(this);
  }
  onChangeSOP(event) {
    this.setState({ sop: event.target.value });
  }
  onSubmit(e) {
    e.preventDefault();
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    if (validator.isEmpty(this.state.sop)) {
      alert("SOP cannot be empty!");
      return;
    }
    if (wordcount(this.state.sop) > 250) {
      alert("SOP should have less than or equal to 250 words!");
      return;
    }
    if (validator.isBefore(this.state.e.deadline)) {
      alert("Deadline is over! Can't apply now...");
      window.location.href = "/joblist";
    }

    var req = {
      rid: this.state.e.rid,
      uid: localStorage.getItem("id"),
      lid: this.state.e._id,
      SOP: this.state.sop,
      title: this.state.e.title,
      name_r: this.state.e.name_of_r,
      salary: this.state.e.salary,
    };
    axios
      .post("/api/appl/add", req, config)
      .then((response) => {
        alert("Successfully Applied!");
        window.location.href = "/apply";
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
  }
  componentDidMount() {
    if (localStorage.getItem("type") !== "A") window.location.href = "/404";
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>You are Applying to {this.state.e.title}</Form.Label>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Enter SOP: Not more than 250 words</Form.Label>
            <Form.Control
              onChange={this.onChangeSOP}
              inputRef={(el) => (this.inputEl = el)}
              as="textarea"
              rows={6}
            />
          </Form.Group>
          <div className="form-group">
            <input type="submit" value="Apply" className="btn btn-primary" />
          </div>
        </Form>
      </div>
    );
  }
}
