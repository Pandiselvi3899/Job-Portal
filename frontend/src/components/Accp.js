//Page with Accepted List for a recruiter...No error handling here...
import React, { Component } from "react";
import axios from "../axios/api";
import { Table } from "react-bootstrap";
import { getRating, isRated } from "../helpers/rating";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
import Rating from "@material-ui/lab/Rating";
import date from "date-and-time";
import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { MDBCol } from "mdbreact";

export default class Accp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accp: [],
      sort_by: (a, b) => a.salary - b.salary,
    };
    this.sortNameAsc = this.sortNameAsc.bind(this);
    this.sortJobAsc = this.sortJobAsc.bind(this);
    this.sortDateAsc = this.sortDateAsc.bind(this);
    this.sortRateAsc = this.sortRateAsc.bind(this);
    this.sortNameDesc = this.sortNameDesc.bind(this);
    this.sortJobDesc = this.sortJobDesc.bind(this);
    this.sortDateDesc = this.sortDateDesc.bind(this);
    this.sortRateDesc = this.sortRateDesc.bind(this);
    this.fixDate = this.fixDate.bind(this);
    this.onRate = this.onRate.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }
  sortNameAsc(e) {
    this.setState({
      sort_by: (a, b) => ("" + a.user.Name).localeCompare(b.user.Name),
    });
  }
  sortJobAsc(e) {
    this.setState({
      sort_by: (a, b) => ("" + a.appl.title).localeCompare(b.appl.title),
    });
  }
  sortRateAsc(e) {
    this.setState({
      sort_by: (a, b) => getRating(a.user) - getRating(b.user),
    });
  }
  sortDateAsc(e) {
    this.setState({
      sort_by: (a, b) =>
        new Date(a.appl.DateofJoining) - new Date(b.appl.DateofJoining),
    });
  }
  sortNameDesc(e) {
    this.setState({
      sort_by: (b, a) => ("" + a.user.Name).localeCompare(b.user.Name),
    });
  }
  sortJobDesc(e) {
    this.setState({
      sort_by: (b, a) => ("" + a.appl.title).localeCompare(b.appl.title),
    });
  }
  sortRateDesc(e) {
    this.setState({
      sort_by: (b, a) => getRating(a.user) - getRating(b.user),
    });
  }
  sortDateDesc(e) {
    this.setState({
      sort_by: (b, a) =>
        new Date(a.appl.DateofJoining) - new Date(b.appl.DateofJoining),
    });
  }
  onRate(e, value) {
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var req = {
      idl: e._id,
      value: parseInt(value),
      ida: e.uid,
      set: { rrated: parseInt(value) },
    };
    axios
      .post("/api/rating/user", req, config)
      .then((response) => {
        alert(response.data);
        window.location.href = "/accp";
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
  }
  renderButtons(e) {
    if (isRated(e, 1) === -1) {
      if (e.Status === "Accepted") {
        return (
          <td>
            <Rating
              name="simple-controlled"
              value={0}
              onChange={(event, newValue) => {
                this.onRate(e, newValue);
              }}
            />
          </td>
        );
      } else {
        return <td>Cannot rate unless accepted</td>;
      }
    }
    return (
      <td>
        <p>You rated:</p>
        <Rating name="read-only" value={isRated(e, 1)} readOnly />
      </td>
    );
  }
  fixDate(mydate) {
    var oldDate1 = new Date(mydate);
    oldDate1 = date.format(oldDate1, "HH:mm , D-MM-YYYY");
    return oldDate1;
  }

  componentDidMount() {
    if (localStorage.getItem("type") !== "R") window.location.href = "/404";
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var req = {
      cond: {
        rid: localStorage.getItem("id"),
        Status: "Accepted",
      },
    };
    axios
      .post("/api/appl/view", req, config)
      .then((response) => {
        this.setState({ accp: response.data });
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
  }

  render() {
    return (
      <div>
        <MDBCol md="6"></MDBCol>
        <MDBDropdown>
          <MDBDropdownToggle caret color="primary">
            Sort Options
          </MDBDropdownToggle>
          <MDBDropdownMenu basic>
            <MDBDropdownItem onClick={this.sortNameAsc}>
              Sort by Name ASC
            </MDBDropdownItem>
            <MDBDropdownItem onClick={this.sortNameDesc}>
              Sort by Name DESC
            </MDBDropdownItem>
            <MDBDropdownItem onClick={this.sortJobAsc}>
              Sort by Title ASC
            </MDBDropdownItem>
            <MDBDropdownItem onClick={this.sortJobDesc}>
              Sort by Title DESC
            </MDBDropdownItem>
            <MDBDropdownItem onClick={this.sortDateAsc}>
              Sort by Date of Joining ASC
            </MDBDropdownItem>
            <MDBDropdownItem onClick={this.sortDateDesc}>
              Sort by Date of Joining DESC
            </MDBDropdownItem>
            <MDBDropdownItem onClick={this.sortRateAsc}>
              Sort by Rating ASC
            </MDBDropdownItem>
            <MDBDropdownItem onClick={this.sortRateDesc}>
              Sort by Rating DESC
            </MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
        <Table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Joining</th>
              <th>Job Type</th>
              <th>Job Title</th>
              <th>Rating</th>
              <th>Rate: </th>
            </tr>
          </thead>
          <tbody>
            {this.state.accp.sort(this.state.sort_by).map((e, i) => {
              return (
                <tr>
                  <td>{e.user.Name}</td>
                  <td>{this.fixDate(e.appl.DateofJoining)}</td>
                  <td>{e.job.typeofJob}</td>
                  <td>{e.appl.title}</td>
                  <td>{getRating(e.user)}</td>

                  {this.renderButtons(e.appl)}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
