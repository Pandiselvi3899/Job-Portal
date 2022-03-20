import React, { Component } from "react";
import axios from "../axios/api";
import { isRated } from "../helpers/rating";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
import Rating from "@material-ui/lab/Rating";
import date from "date-and-time";
export default class MyAppl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myappls: [],
    };
    this.dateofJoining = this.dateofJoining.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.onRate = this.onRate.bind(this);
    this.fixDate = this.fixDate.bind(this);
  }
  componentDidMount() {
    if (localStorage.getItem("type") !== "A") window.location.href = "/404";
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var req = {
      cond: { uid: localStorage.getItem("id") },
    };
    axios
      .post("/api/appl", req, config)
      .then((response) => {
        this.setState({ myappls: response.data });
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
  }
  dateofJoining(e) {
    if (e.Status === "Accepted") {
      return <p>{this.fixDate(e.DateofJoining)}</p>;
    } else {
      return <p>N/A</p>;
    }
  }
  onRate(e, value) {
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var req = {
      idl: e.lid,
      value: parseInt(value),
      ida: e._id,
      set: { urated: parseInt(value) },
    };
    axios
      .post("/api/rating/job", req, config)
      .then((response) => {
        alert(response.data);
        window.location.href = "/myappl";
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
  }

  renderButtons(e) {
    if (isRated(e, 0) === -1) {
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
        <Rating name="read-only" value={isRated(e, 0)} readOnly />
      </td>
    );
  }
  fixDate(mydate) {
    var oldDate1 = new Date(mydate);
    oldDate1 = date.format(oldDate1, "HH:mm , D-MM-YYYY");
    return oldDate1;
  }
  render() {
    return (
      <div>
        <Table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date of Joining</th>
              <th>Salary</th>
              <th>Name of Recruiter</th>
              <th>Status of Job</th>
            </tr>
          </thead>
          <tbody>
            {this.state.myappls.map((e, i) => {
              return (
                <tr>
                  <td>{e.title}</td>
                  <td>{this.dateofJoining(e)}</td>
                  <td>{e.salary}</td>
                  <td>{e.name_r}</td>
                  <td>{e.Status}</td>

                  {this.renderButtons(e)}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
