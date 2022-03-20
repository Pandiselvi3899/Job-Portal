import React, { Component } from "react";
import axios from "../axios/api";
import { Table, Button, Row, Col } from "react-bootstrap";
import { getRating } from "../helpers/rating";
import Fuse from "fuse.js";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { MDBCol, MDBIcon } from "mdbreact";
import date from "date-and-time";

export default class Apply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      jobs2: [],
      search: "",
      filter: "Filter",
      type: "None",
      isSalary: "No",
      min: "",
      max: "",
      duration: "None",
      myappl: [],
      applyto: "",
      sort_by: (a, b) => a.salary - b.salary,
    };
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.sortSalaryAsc = this.sortSalaryAsc.bind(this);
    this.sortDurationAsc = this.sortDurationAsc.bind(this);
    this.sortRatingAsc = this.sortRatingAsc.bind(this);
    this.sortSalaryDesc = this.sortSalaryDesc.bind(this);
    this.sortDurationDesc = this.sortDurationDesc.bind(this);
    this.sortRatingDesc = this.sortRatingDesc.bind(this);
    this.fixDate = this.fixDate.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeIsSalary = this.onChangeIsSalary.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.onChangeMax = this.onChangeMax.bind(this);
    this.onChangeMin = this.onChangeMin.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.Filter = this.Filter.bind(this);
  }

  onChangeMin(event) {
    this.setState({ min: event.target.value });
  }
  onChangeMax(event) {
    this.setState({ max: event.target.value });
  }
  onChangeType(event) {
    this.setState({ type: event.target.value });
  }
  onChangeIsSalary(event) {
    this.setState({ isSalary: event.target.value });
  }
  onChangeDuration(event) {
    this.setState({ duration: event.target.value });
  }
  sortSalaryAsc(e) {
    this.setState({ sort_by: (a, b) => a.salary - b.salary });
  }
  sortDurationAsc(e) {
    this.setState({ sort_by: (a, b) => a.duration - b.duration });
  }
  sortRatingAsc(e) {
    this.setState({
      sort_by: (a, b) => getRating(a) - getRating(b),
    });
  }
  renderButton(e) {
    for (var i = 0; i < this.state.myappl.length; i++) {
      if (e._id === this.state.myappl[i].lid) {
        return (
          <td>
            <Button variant="danger">Applied</Button>
          </td>
        );
      }
    }
    if (
      e.max_no_of_applicants === e.curr_app ||
      e.accepted === e.available_no
    ) {
      return (
        <td>
          <Button variant="warning">Full</Button>
        </td>
      );
    }

    return (
      <td>
        <Link to={{ pathname: "/SOP", state: { e: e } }}>
          <Button variant="primary" className="btn btn-primary" value="Apply">
            Apply
          </Button>
        </Link>
      </td>
    );
  }

  renderForm() {
    if (this.state.isSalary === "Yes") {
      return (
        <Row>
          <Col>
            <Form.Control onChange={this.onChangeMin} placeholder="Min Value" />
          </Col>
          <Col>
            <Form.Control onChange={this.onChangeMax} placeholder="Max Value" />
          </Col>
        </Row>
      );
    }
  }

  fixDate(list) {
    let returnValue = [];
    var oldDate1;
    var oldDate2;
    for (var i = 0; i < list.length; i++) {
      oldDate1 = new Date(list[i].deadline);
      oldDate1 = date.format(oldDate1, "HH:mm , D-MM-YYYY");
      list[i].deadline = oldDate1;
      oldDate2 = new Date(list[i].postedOn);
      oldDate2 = date.format(oldDate2, "HH:mm , DD-MM-YYYY");
      list[i].postedOn = oldDate2;
      returnValue.push(list[i]);
    }
    return returnValue;
  }

  sortSalaryDesc(e) {
    this.setState({ sort_by: (b, a) => a.salary - b.salary });
  }
  sortDurationDesc(e) {
    this.setState({ sort_by: (b, a) => a.duration - b.duration });
  }
  sortRatingDesc(e) {
    this.setState({
      sort_by: (b, a) => getRating(a) - getRating(b),
    });
  }
  onChangeSearch(e) {
    const val = e.target.value;
    this.setState({ search: val });
    this.setState({ jobs: this.state.jobs2 });
    if (val === "") {
      return;
    }

    const options = {
      isCaseSensitive: false,
      keys: ["title"],
    };

    function getResult(search) {
      let returnValue = [];
      for (var i = 0; i < search.length; i++) {
        returnValue.push(search[i].item);
      }
      return returnValue;
    }

    const fuse = new Fuse(this.state.jobs2, options);
    let search = fuse.search(val);
    search = getResult(search);
    this.setState({ jobs: search });
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.state.filter === "Filter") {
      this.setState({ filter: "Clear Filter" });
    } else {
      this.setState({
        filter: "Filter",
        type: "None",
        isSalary: "No",
        min: "",
        max: "",
        duration: "None",
      });
    }
  }

  componentDidMount() {
    if (localStorage.getItem("type") !== "A") window.location.href = "/404";
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    axios
      .post("/api/list/", { cond: { deadline: { $gte: new Date() } } }, config)
      .then((res) => {
        var fixed = this.fixDate(res.data);
        this.setState({ jobs: fixed });
        this.setState({ jobs2: fixed });
      });
    axios
      .post("/api/appl/", { cond: { uid: localStorage.getItem("id") } }, config)
      .then((res) => {
        this.setState({ myappl: res.data });
      });
  }
  Filter(e) {
    var shouldShow = true;
    if (this.state.filter === "Clear Filter") {
      if (this.state.type !== "None" && this.state.type !== e.typeofJob)
        shouldShow = false;
      if (
        this.state.duration !== "None" &&
        parseInt(this.state.duration) <= e.duration
      )
        shouldShow = false;
      if (
        this.state.isSalary !== "No" &&
        this.state.min !== "" &&
        parseInt(this.state.min) > e.salary
      )
        shouldShow = false;
      if (
        this.state.isSalary !== "No" &&
        this.state.max !== "" &&
        parseInt(this.state.max) < e.salary
      )
        shouldShow = false;
    }

    return shouldShow;
  }
  renderFilter() {
    if (this.state.filter === "Filter") {
      return (
        <div>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Filter by Type: </Form.Label>
            <Form.Control
              as="select"
              value={this.state.type}
              onChange={this.onChangeType}
              inputRef={(el) => (this.inputEl = el)}
            >
              <option value="None">None</option>
              <option value="Full-Time">Full-Time</option>
              <option value="WFH">WFH</option>
              <option value="Part-Time">Part-Time</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect2">
            <Form.Label>Filter by Duration (strictly less than): </Form.Label>
            <Form.Control
              as="select"
              value={this.state.duration}
              onChange={this.onChangeDuration}
              inputRef={(el) => (this.inputEl = el)}
            >
              <option value="None">None</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect3">
            <Form.Label>Filter by Salary (strictly less than): </Form.Label>
            <Form.Control
              as="select"
              value={this.state.isSalary}
              onChange={this.onChangeIsSalary}
              inputRef={(el) => (this.inputEl = el)}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </Form.Control>
          </Form.Group>
          {this.renderForm()}
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <MDBCol md="6">
          <div className="input-group md-form form-sm form-1 pl-0">
            <div className="input-group-prepend">
              <span className="input-group-text lighten-3" id="basic-text1">
                <MDBIcon className="text-white" icon="search" />
                Search
              </span>
            </div>
            <input
              onChange={this.onChangeSearch}
              className="form-control my-0 py-1"
              type="text"
              placeholder="Search for Jobs"
              aria-label="Search"
              value={this.state.search}
            />
          </div>
        </MDBCol>
        <br></br>
        <MDBCol md="12">
          <MDBDropdown>
            <MDBDropdownToggle caret color="primary">
              Sort Options
            </MDBDropdownToggle>
            <MDBDropdownMenu basic>
              <MDBDropdownItem onClick={this.sortSalaryAsc}>
                Sort by Salary ASC
              </MDBDropdownItem>
              <MDBDropdownItem onClick={this.sortSalaryDesc}>
                Sort by Salary DESC
              </MDBDropdownItem>
              <MDBDropdownItem onClick={this.sortDurationAsc}>
                Sort by Duration ASC
              </MDBDropdownItem>
              <MDBDropdownItem onClick={this.sortDurationDesc}>
                Sort by Duration DESC
              </MDBDropdownItem>
              <MDBDropdownItem onClick={this.sortRatingAsc}>
                Sort by Rating ASC
              </MDBDropdownItem>
              <MDBDropdownItem onClick={this.sortRatingDesc}>
                Sort by Rating DESC
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBCol>
        <br></br>
        <MDBCol md="12">
          <Form onSubmit={this.onSubmit}>
            {this.renderFilter()}
            <div className="form-group">
              <input
                type="submit"
                value={this.state.filter}
                className="btn btn-primary"
              />
            </div>
          </Form>
        </MDBCol>

        <Table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Duration</th>
              <th>Rating</th>
              <th>Salary</th>
              <th>Name of Recruiter</th>
              <th>Email of Recruiter</th>
              <th>Date of Posting</th>
              <th>Deadline for Application</th>
              <th>Skills</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {this.state.jobs
              .filter(this.Filter)
              .sort(this.state.sort_by)
              .map((e, i) => {
                return (
                  <tr>
                    <td>{e.title}</td>
                    <td>{e.duration}</td>
                    <td>{getRating(e)}</td>
                    <td>{e.salary}</td>
                    <td>{e.name_of_r}</td>
                    <td>{e.email}</td>
                    <td>{e.postedOn}</td>
                    <td>{e.deadline}</td>
                    <td>{e.requiredSkills}</td>
                    <td>{e.typeofJob}</td>

                    {this.renderButton(e)}
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    );
  }
}
