import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
import { Table, Button } from "react-bootstrap";
import React, { Component } from "react";
import axios from "../axios/api";
import date from "date-and-time";
import { getRating } from "../helpers/rating";
import { Link } from "react-router-dom";
export default class JobList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
    };
    this.fixDate = this.fixDate.bind(this);
    this.onDeleteJob = this.onDeleteJob.bind(this);
  }
  componentDidMount() {
    if (localStorage.getItem("type") !== "R") {
      window.location.href = "/404";
    }
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    axios
      .get("/api/list/rid", config)
      .then((response) => {
        this.setState({ jobs: response.data });
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
  }
  onDeleteJob(e) {
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var req = {
      id: e._id,
    };
    axios
      .post("/api/list/delete", req, config)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
    window.location.href = "/joblist";
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
              <th>Date of Posting</th>
              <th>Number of Open Applications</th>
              <th>Remaining No. of Postions</th>
              <th>Maximum Number of Applicants</th>
              <th>Maximum Nuber of Positions</th>
              <th>Deadline for Application</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {this.state.jobs
              .filter((e) => {
                if (e.accepted === e.available_no) {
                  return false;
                } else {
                  return true;
                }
              })
              .map((e, i) => {
                return (
                  <tr>
                    <td>{e.title}</td>
                    <td>{this.fixDate(e.postedOn)}</td>
                    <td>{e.curr_app}</td>
                    <td>{e.available_no - e.accepted}</td>
                    <td>{e.max_no_of_applicants}</td>
                    <td>{e.available_no}</td>
                    <td>{this.fixDate(e.deadline)}</td>
                    <td>{getRating(e)}</td>
                    <td>
                      <Button
                        variant="danger"
                        className="btn btn-primary"
                        value="delete"
                        onClick={() => this.onDeleteJob(e)}
                      >
                        Delete
                      </Button>
                    </td>
                    <td>
                      <Link to={{ pathname: "/edit", state: { e: e } }}>
                        <Button
                          variant="warning"
                          className="btn btn-primary"
                          value="edit"
                        >
                          Edit
                        </Button>
                      </Link>
                    </td>
                    <td>
                      <Link to={{ pathname: "/appl", state: { e: e } }}>
                        <Button
                          variant="primary"
                          className="btn btn-primary"
                          value="View Applications"
                        >
                          View Applications
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    );
  }
}
