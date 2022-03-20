//recruiter side, shows all the applications for this listing...Buttons to
//accept/shortlist/reject/rate...,error handling done
import React, { Component } from "react";
import axios from "../axios/api";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
import date from "date-and-time";
import { Button, Table } from "react-bootstrap";
import { getRating } from "../helpers/rating";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
import download from "downloadjs";
import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { MDBCol, MDBIcon } from "mdbreact";

export default class ApplList extends Component {
  constructor(props) {
    super(props);
    if (!this.props.location.state) {
      window.location.href = "/404";
    }
    this.state = {
      e: this.props.location.state.e,
      appls: [],
      sort_by: (a, b) => ("" + a.user.Name).localeCompare(b.user.Name),
    };
    this.getEndYear = this.getEndYear.bind(this);
    this.renderSkills = this.renderSkills.bind(this);
    this.Downloadfile = this.Downloadfile.bind(this);
    this.renderCV = this.renderCV.bind(this);
    this.sortNameAsc = this.sortNameAsc.bind(this);
    this.sortRateAsc = this.sortRateAsc.bind(this);
    this.sortDOAAsc = this.sortDOAAsc.bind(this);
    this.sortNameDesc = this.sortNameDesc.bind(this);
    this.sortRateDesc = this.sortRateDesc.bind(this);
    this.sortDOADesc = this.sortDOADesc.bind(this);
  }
  sortNameAsc(e) {
    this.setState({
      sort_by: (a, b) => ("" + a.user.Name).localeCompare(b.user.Name),
    });
  }
  sortRateAsc(e) {
    this.setState({
      sort_by: (a, b) => getRating(a.user) - getRating(b.user),
    });
  }
  sortDOAAsc(e) {
    this.setState({
      sort_by: (a, b) =>
        new Date(a.appl.applied_on) - new Date(b.appl.applied_on),
    });
  }
  sortNameDesc(e) {
    this.setState({
      sort_by: (b, a) => ("" + a.user.Name).localeCompare(b.user.Name),
    });
  }
  sortRateDesc(e) {
    this.setState({
      sort_by: (b, a) => getRating(a.user) - getRating(b.user),
    });
  }
  sortDOADesc(e) {
    this.setState({
      sort_by: (b, a) =>
        new Date(a.appl.applied_on) - new Date(b.appl.applied_on),
    });
  }
  getEndYear(arg) {
    if (arg.end_year === -1) return "Ongoing";
    return arg.end_year;
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
        lid: this.state.e._id,
      },
    };
    axios
      .post("/api/appl/view", req, config)
      .then((response) => {
        this.setState({ appls: response.data });
      })
      .catch((err) => {
        if (err) console.log(err);
      });
  }
  fixDate(mydate) {
    var oldDate1 = new Date(mydate);
    oldDate1 = date.format(oldDate1, "HH:mm , D-MM-YYYY");
    return oldDate1;
  }

  renderSkills(skills) {
    var myskill = "";
    var i = 0;
    for (i = 0; i < skills.length - 1; i++) {
      myskill = myskill + skills[i].Name + ", ";
    }
    if (skills.length !== 0) myskill = myskill + skills[i].Name;
    return myskill;
  }
  onPress(value, appl) {
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var req = {
      id: appl._id,
      oldStatus: appl.Status,
      set: {
        Status: value,
        DateofJoining: new Date(),
      },
      lid: appl.lid,
      uid: appl.uid,
      name: localStorage.getItem("name"),
    };
    axios
      .post("/api/appl/update", req, config)
      .then((response) => {
        alert(response.data);
        window.location.href = "/appl";
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
  }

  renderButton(appl) {
    if (appl.Status === "Pending") {
      return (
        <div>
          <Button
            style={{ margin: 1 + "rem" }}
            variant="warning"
            className="btn btn-primary"
            value="Shortlisted"
            onClick={() => this.onPress("Shortlisted", appl)}
          >
            Shortlist
          </Button>
          <Button
            style={{ margin: 1 + "rem" }}
            variant="danger"
            className="btn btn-primary"
            value="Rejected"
            onClick={() => this.onPress("Rejected", appl)}
          >
            Reject
          </Button>
        </div>
      );
    }
    if (appl.Status === "Shortlisted") {
      return (
        <div>
          <Button
            style={{ margin: 1 + "rem" }}
            variant="success"
            className="btn btn-primary"
            value="Accepted"
            onClick={() => this.onPress("Accepted", appl)}
          >
            Accept
          </Button>
          <Button
            style={{ margin: 1 + "rem" }}
            variant="danger"
            className="btn btn-primary"
            value="Rejected"
            onClick={() => this.onPress("Rejected", appl)}
          >
            Reject
          </Button>
        </div>
      );
    }
    return (
      <Button
        style={{ margin: 1 + "rem" }}
        variant="success"
        className="btn btn-primary"
      >
        Accepted
      </Button>
    );
  }
  async Downloadfile(e) {
    try {
      const file = await axios.get("/api/cv/get/" + e._id);
      var path = file.data.file_path;
      var mimetype = file.data.file_mimetype;
      const result = await axios.get("/api/cv/download/" + e._id, {
        responseType: "blob",
      });
      const split = path.split("/");
      const filename = split[split.length - 1];
      return download(result.data, filename, mimetype);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Error while downloading file. Try again later");
      }
    }
  }

  renderCV(e) {
    if (e.cv === true) {
      return (
        <Button
          style={{ margin: 1 + "rem" }}
          variant="warning"
          className="btn btn-primary"
          value="download"
          onClick={() => this.Downloadfile(e)}
        >
          Download CV
        </Button>
      );
    } else {
      <p>No CV Uploaded</p>;
    }
  }

  render() {
    return (
      <div>
        <br></br>
        <MDBCol md="12">
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
              <MDBDropdownItem onClick={this.sortDOAAsc}>
                Sort by Date of Application ASC
              </MDBDropdownItem>
              <MDBDropdownItem onClick={this.sortDOADesc}>
                Sort by Date of Application DESC
              </MDBDropdownItem>
              <MDBDropdownItem onClick={this.sortRateAsc}>
                Sort by Rating ASC
              </MDBDropdownItem>
              <MDBDropdownItem onClick={this.sortRateDesc}>
                Sort by Rating DESC
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBCol>
        <br></br>
        {this.state.appls
          .filter((e) => {
            if (e.appl.Status === "Rejected" || e.appl.Status === "Deleted") {
              return false;
            } else {
              return true;
            }
          })
          .sort(this.state.sort_by)
          .map((e, i) => {
            return (
              <div>
                <Card style={{ margin: 1 + "rem" }}>
                  <Card.Header as="h5">Name: {e.user.Name}</Card.Header>
                  <Card.Body>
                    <Card.Title>SOP: {e.appl.SOP}</Card.Title>
                    <Card.Text>
                      <Table class="table table-striped">
                        <thead>
                          <tr>
                            <th>Date of Application</th>
                            <th>Rating</th>
                            <th>Stage of Application</th>
                            <th>Skills</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{this.fixDate(e.appl.applied_on)}</td>
                            <td>{getRating(e.user)}</td>
                            <td>{e.appl.Status}</td>
                            <td>{this.renderSkills(e.skills)}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Text>
                    <Card.Title>Education</Card.Title>
                    <Card.Text>
                      {e.Edu.map((a, i) => {
                        return (
                          <div>
                            <h6>{a.institute}</h6>
                            <p>
                              Start Year: <strong>{a.start_year}</strong>, End
                              Year: <strong>{this.getEndYear(a)}</strong>
                            </p>
                          </div>
                        );
                      })}
                    </Card.Text>
                    {this.renderButton(e.appl)}
                    {this.renderCV(e.user)}
                  </Card.Body>
                </Card>
              </div>
            );
          })}
      </div>
    );
  }
}
