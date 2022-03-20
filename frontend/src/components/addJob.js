//recruiter side, adds a Job, error handling is done
import React, { Component } from "react";
import axios from "../axios/api";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
import { MDBRow, MDBCol } from "mdbreact";
import { TextField } from "@material-ui/core";
const validator = require("validator");

export default class AddJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      max_no_of_a: "",
      available_pos: "",
      type: "Full-Time",
      salary: "",
      deadline: new Date(),
      duration: "",
      id: localStorage.getItem("id"),
      email: localStorage.getItem("email"),
      name: localStorage.getItem("name"),
      skills: "",
    };

    this.onChangeType = this.onChangeType.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeMaxA = this.onChangeMaxA.bind(this);
    this.onChangePos = this.onChangePos.bind(this);
    this.onChangeSkill = this.onChangeSkill.bind(this);
    this.onChangeSalary = this.onChangeSalary.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
  }
  onChangeType(event) {
    this.setState({ type: event.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    let Listing = {
      title: this.state.title,
      name_of_r: this.state.name,
      email: this.state.email,
      curr_app: 0,
      accepted: 0,
      max_no_of_applicants: parseInt(this.state.max_no_of_a),
      available_no: parseInt(this.state.available_pos),
      deadline: this.state.deadline,
      postedOn: new Date(),
      requiredSkills: this.state.skills,
      typeofJob: this.state.type,
      duration: parseInt(this.state.duration),
      salary: parseInt(this.state.salary),
      rid: this.state.id,
    };

    if (validator.isEmpty(Listing.title + "")) {
      alert("Title cannot be empty!");
      return;
    }
    if (!validator.isInt(this.state.max_no_of_a + "", { min: 1 })) {
      alert("Maximum no. of Applicants should be an Integer greater than 1 !");
      return;
    }
    if (!validator.isInt(this.state.available_pos + "", { min: 1 })) {
      alert("Number of Open Positions should be an Integer greater than 0 !");
      return;
    }
    if (!validator.isAfter(Listing.deadline + "")) {
      alert("Deadline is before current time!");
      return;
    }
    if (validator.isEmpty(Listing.requiredSkills)) {
      alert("Skills cannot be empty!");
      return;
    }
    if (!validator.isInt(this.state.salary + "", { min: 1 })) {
      alert("Salary should be an integer greater than 0 in INR");
      return;
    }
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    axios
      .post("/api/list/add", Listing, config)
      .then((response) => {
        alert("Successfully Added!");
        window.location.href = "/joblist";
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
  }
  onChangeTitle(event) {
    this.setState({ title: event.target.value });
  }
  onChangeMaxA(event) {
    this.setState({ max_no_of_a: event.target.value });
  }
  onChangePos(event) {
    this.setState({ available_pos: event.target.value });
  }
  onChangeSkill(event) {
    this.setState({ skills: event.target.value });
  }
  onChangeSalary(event) {
    this.setState({ salary: event.target.value });
  }
  onChangeDuration(event) {
    this.setState({ duration: event.target.value });
  }
  componentDidMount() {
    if (localStorage.getItem("type") !== "R") window.location.href = "/404";
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Title: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.title}
              onChange={this.onChangeTitle}
            />
          </div>
          <div className="form-group">
            <label>Maximum No. of Applicants: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.max_no_of_a}
              onChange={this.onChangeMaxA}
            />
          </div>
          <div className="form-group">
            <label>Available Position: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.available_pos}
              onChange={this.onChangePos}
            />
          </div>
          <div className="form-group">
            <label>Skills Required: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.skills}
              onChange={this.onChangeSkill}
            />
          </div>
          <div className="form-group">
            <label>Salary: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.salary}
              onChange={this.onChangeSalary}
            />
          </div>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Type of Job</Form.Label>
            <Form.Control
              as="select"
              value={this.state.type}
              onChange={this.onChangeType}
              inputRef={(el) => (this.inputEl = el)}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="WFH">Work-From-Home</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              as="select"
              value={this.state.duration}
              onChange={this.onChangeDuration}
              inputRef={(el) => (this.inputEl = el)}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </Form.Control>
          </Form.Group>
          Deadline:
          <MDBRow>
            <MDBCol md="8">
              <TextField
                id="deadline"
                type="datetime-local"
                onChange={(e) => {
                  this.setState({ deadline: e.target.value });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </MDBCol>
          </MDBRow>
          <div className="form-group">
            <input type="submit" value="Add Job" className="btn btn-primary" />
          </div>
        </Form>
      </div>
    );
  }
}
