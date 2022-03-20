import React, { Component } from "react";
import axios from "../axios/api";
import { TextField } from "@material-ui/core";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
import date from "date-and-time";
import { MDBRow, MDBCol } from "mdbreact";
var validator = require("validator");

export default class Edit extends Component {
  constructor(props) {
    super(props);
    if (!this.props.location.state) {
      window.location.href = "/404";
    }
    this.state = {
      e: this.props.location.state.e,
      A: this.props.location.state.e.max_no_of_applicants,
      P: this.props.location.state.e.available_no,
      D: this.props.location.state.e.deadline,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeMaxA = this.onChangeMaxA.bind(this);
    this.onChangePos = this.onChangePos.bind(this);
    this.fixDate = this.fixDate.bind(this);
  }
  onChangeMaxA(event) {
    this.setState({ A: event.target.value });
  }
  onChangePos(event) {
    this.setState({ P: event.target.value });
  }
  onSubmit(e) {
    e.preventDefault();

    if (!validator.isInt(this.state.A + "", { min: 1 })) {
      alert("Maximum no. of Applicants should be an Integer greater than 1 !");
      return;
    }
    if (!validator.isInt(this.state.P + "", { min: 1 })) {
      alert("Number of Open Positions should be an Integer greater than 0 !");
      return;
    }
    if (!validator.isAfter(this.state.D + "")) {
      alert("Deadline is before current time!");
      return;
    }
    if (parseInt(this.state.P) < this.state.e.accepted) {
      alert(
        "You cannot set current open positions to be less than current accepted Number!"
      );
      return;
    }
    if (parseInt(this.state.A) < this.state.e.curr_app) {
      alert(
        "You cannot set maximum number of applicants  to be less than current Applicants Number!"
      );
      return;
    }
    let req = {
      id: this.state.e._id,
      set: {
        max_no_of_applicants: parseInt(this.state.A),
        available_no: parseInt(this.state.P),
        deadline: this.state.D,
      },
    };
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    axios
      .post("/api/list/update", req, config)
      .then((response) => {
        alert("Successfully Edited!");
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
    window.location.href = "/joblist";
  }
  fixDate(mydate) {
    var oldDate1 = new Date(mydate);
    oldDate1 = date.format(oldDate1, "YYYY-MM-DD[T]HH:mm");
    return oldDate1;
  }
  render() {
    return (
      <div>
        <Form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Maximum No. of Applicants: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.A}
              onChange={this.onChangeMaxA}
            />
          </div>
          <div className="form-group">
            <label>Available Position: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.P}
              onChange={this.onChangePos}
            />
          </div>
          Deadline:
          <MDBRow>
            <MDBCol md="8">
              <TextField
                id="deadline"
                type="datetime-local"
                defaultValue={this.fixDate(this.state.e.deadline)}
                onChange={(e) => {
                  this.setState({ D: e.target.value });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </MDBCol>
          </MDBRow>
          <div className="form-group">
            <input type="submit" value="Edit" className="btn btn-primary" />
          </div>
        </Form>
      </div>
    );
  }
}
