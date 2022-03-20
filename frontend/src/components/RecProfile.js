//Applicant Profile with error handling done, CSS also...
import React, { Component } from "react";
import axios from "../axios/api";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { getRating } from "../helpers/rating";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
var validator = require("validator");
var wordcount = require("wordcount");

export default class RecProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      renderBioform: false,
      renderNameform: false,
      renderContactform: false,
      renderEmailform: false,
      renderPasswordform: false,
      contact: "",
      Name: "",
      email: "",
      bio: "",
      oldpassword: "",
      newpassword: "",
      newpassword_r: "",
      dp: "",
      dpu: "",
    };

    this.onChangeBio = this.onChangeBio.bind(this);
    this.onChangeContact = this.onChangeContact.bind(this);
    this.renderBioform = this.renderBioform.bind(this);
    this.renderEmailform = this.renderEmailform.bind(this);
    this.onAddBio = this.onAddBio.bind(this);
    this.renderContactform = this.renderContactform.bind(this);
    this.renderPasswordform = this.renderPasswordform.bind(this);
    this.onAddContact = this.onAddContact.bind(this);
    this.onAddPassword = this.onAddPassword.bind(this);
    this.onAddName = this.onAddName.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onAddEmail = this.onAddEmail.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeOldP = this.onChangeOldP.bind(this);
    this.onChangeNewP = this.onChangeNewP.bind(this);
    this.onChangeNewP_r = this.onChangeNewP_r.bind(this);
    this.renderDP = this.renderDP.bind(this);
    this.onDP = this.onDP.bind(this);
  }
  onChangeBio(event) {
    this.setState({ bio: event.target.value });
  }

  onChangeContact(event) {
    this.setState({ Contact: event.target.value });
  }
  onChangeEmail(event) {
    this.setState({ Email: event.target.value });
  }
  onChangeOldP(event) {
    this.setState({ oldpassword: event.target.value });
  }
  onChangeNewP(event) {
    this.setState({ newpassword: event.target.value });
  }
  onChangeNewP_r(event) {
    this.setState({ newpassword_r: event.target.value });
  }
  onChangeName(event) {
    this.setState({ Name: event.target.value });
  }
  renderPasswordform() {
    if (this.state.renderPasswordform === true) {
      return (
        <div>
          <Form onSubmit={this.onAddPassword}>
            <div className="form-group">
              <label>Old Password: </label>
              <input
                type="password"
                className="form-control"
                value={this.state.oldpassword}
                onChange={this.onChangeOldP}
              />
            </div>
            <div className="form-group">
              <label>New Password: </label>
              <input
                type="password"
                className="form-control"
                value={this.state.newpassword}
                onChange={this.onChangeNewP}
              />
            </div>
            <div className="form-group">
              <label>Retype New Password: </label>
              <input
                type="password"
                className="form-control"
                value={this.state.newpassword_r}
                onChange={this.onChangeNewP_r}
              />
            </div>
            <div className="form-group">
              <input
                type="submit"
                value="Change Password"
                className="btn btn-primary"
              />
            </div>
          </Form>
        </div>
      );
    } else {
      return (
        <div>
          <Button
            variant="primary"
            className="btn btn-primary"
            value="edit"
            onClick={() => {
              this.onAddPassword();
            }}
          >
            Change Password
          </Button>
        </div>
      );
    }
  }
  async onDP(e) {
    e.preventDefault();
    var id = localStorage.getItem("id");
    const formData = new FormData();
    formData.append("file", this.state.dpu);
    formData.append("uid", id);
    try {
      await axios.post("/api/dp/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      if (error.response) alert(error.response.data);
    }
    window.location.href = "/profile";
  }
  renderDP() {
    if (this.state.user.dp) {
      return (
        <img
          className="img-fluid"
          style={{ maxWidth: 15 + "vw", margin: 1 + "rem" }}
          src={this.state.dp}
          alt="DP"
        />
      );
    }
    return (
      <Form style={{ margin: 1 + "rem" }} onSubmit={this.onDP}>
        <Form.Group>
          <Form.File
            onChange={(e) => {
              this.setState({ dpu: e.target.files[0] });
            }}
            id="exampleFormControlFile1"
            label="Choose DP File to Upload"
          />
        </Form.Group>
        <div className="form-group">
          <input type="submit" value="Upload DP" className="btn btn-primary" />
        </div>
      </Form>
    );
  }
  renderBioform() {
    if (this.state.renderBioform === true) {
      return (
        <div>
          <Form onSubmit={this.onAddBio}>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Enter Bio: Not more than 250 words</Form.Label>
              <Form.Control
                onChange={this.onChangeBio}
                as="textarea"
                rows={6}
              />
            </Form.Group>
            <div className="form-group">
              <input type="submit" value="Edit" className="btn btn-primary" />
            </div>
          </Form>
        </div>
      );
    } else {
      return (
        <div>
          <Button
            variant="primary"
            className="btn btn-primary"
            value="edit bio"
            onClick={() => {
              this.onAddBio();
            }}
          >
            Edit Bio
          </Button>
        </div>
      );
    }
  }

  renderContactform() {
    if (this.state.renderContactform === true) {
      return (
        <div>
          <Form onSubmit={this.onAddContact}>
            <div className="form-group">
              <label>Contact: </label>
              <input
                type="text"
                className="form-control"
                value={this.state.Contact}
                onChange={this.onChangeContact}
              />
            </div>
            <div className="form-group">
              <input type="submit" value="Edit" className="btn btn-primary" />
            </div>
          </Form>
        </div>
      );
    } else {
      return (
        <div>
          <Button
            variant="primary"
            className="btn btn-primary"
            value="edit bio"
            onClick={() => {
              this.onAddContact();
            }}
          >
            Edit Contact
          </Button>
        </div>
      );
    }
  }
  renderEmailform() {
    if (this.state.renderEmailform === true) {
      return (
        <div>
          <Form onSubmit={this.onAddEmail}>
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
              <input type="submit" value="Edit" className="btn btn-primary" />
            </div>
          </Form>
        </div>
      );
    } else {
      return (
        <div>
          <Button
            variant="primary"
            className="btn btn-primary"
            value="edit bio"
            onClick={() => {
              this.onAddEmail();
            }}
          >
            Edit Email
          </Button>
        </div>
      );
    }
  }
  renderNameform() {
    if (this.state.renderNameform === true) {
      return (
        <div>
          <Form onSubmit={this.onAddName}>
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
              <input type="submit" value="Edit" className="btn btn-primary" />
            </div>
          </Form>
        </div>
      );
    } else {
      return (
        <div>
          <Button
            variant="primary"
            className="btn btn-primary"
            value="edit bio"
            onClick={() => {
              this.onAddName();
            }}
          >
            Edit Name
          </Button>
        </div>
      );
    }
  }

  onAddBio(e) {
    if (e) {
      e.preventDefault();
    }
    if (this.state.renderBioform === false) {
      this.setState({ renderBioform: true });
      return;
    }

    var newbio = this.state.bio;
    if (validator.isEmpty(this.state.bio)) {
      alert("Bio cannot be empty!");
      return;
    }
    if (wordcount(this.state.bio) > 250) {
      alert("Bio should have less than or equal to 250 words!");
      return;
    }

    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var req = {
      Bio: newbio,
    };
    axios
      .post("/api/user/profile", req, config)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
    window.location.href = "/profile";
  }
  onAddPassword(e) {
    if (e) {
      e.preventDefault();
    }
    if (this.state.renderPasswordform === false) {
      this.setState({ renderPasswordform: true });
      return;
    }

    var npassword = this.state.newpassword.trim();
    var opassword = this.state.oldpassword.trim();
    var rpassword = this.state.newpassword_r.trim();

    if (validator.isEmpty(npassword)) {
      alert("New Password cannot be empty!");
      return;
    }
    if (validator.isEmpty(opassword)) {
      alert("Old Password cannot be empty!");
      return;
    }
    if (validator.isEmpty(rpassword)) {
      alert("Retype Password cannot be empty!");
      return;
    }
    if (!validator.isLength(npassword, { min: 4, max: 30 })) {
      alert("Length of Password should be between 4 and 30!");
      return;
    }
    if (!validator.equals(npassword, rpassword)) {
      alert("Passwords do not Match!");
      return;
    }

    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var req = {
      password: npassword,
      oldpassword: opassword,
    };
    axios
      .post("/api/user/password", req, config)
      .then((response) => {
        window.location.href = "/logout";
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
  }
  onAddContact(e) {
    if (e) {
      e.preventDefault();
    }

    if (this.state.renderContactform === false) {
      this.setState({ renderContactform: true });
      return;
    }
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

    var newcontact = this.state.Contact;

    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var req = {
      Contact: newcontact,
    };
    axios
      .post("/api/user/contact", req, config)
      .then((response) => {
        localStorage.setItem("Contact", newcontact);
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
    window.location.href = "/profile";
  }
  onAddName(e) {
    if (e) {
      e.preventDefault();
    }

    if (this.state.renderNameform === false) {
      this.setState({ renderNameform: true });
      return;
    }
    if (validator.isEmpty(this.state.Name)) {
      alert("Name cannot be empty!");
      return;
    }

    var newname = this.state.Name;

    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var req = {
      Name: newname,
    };
    axios
      .post("/api/user/name", req, config)
      .then((response) => {
        localStorage.setItem("name", newname);
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
    window.location.href = "/profile";
  }
  onAddEmail(e) {
    if (e) {
      e.preventDefault();
    }

    if (this.state.renderEmailform === false) {
      this.setState({ renderEmailform: true });
      return;
    }
    if (validator.isEmpty(this.state.Email)) {
      alert("Email cannot be empty!");
      return;
    }
    if (!validator.isEmail(this.state.Email)) {
      alert("Invalid Email!");
      return;
    }

    var newemail = this.state.Email;

    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var req = {
      Email: newemail,
    };
    axios
      .post("/api/user/email", req, config)
      .then((response) => {
        localStorage.setItem("email", newemail);
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
    window.location.href = "/profile";
  }

  componentDidMount() {
    if (localStorage.getItem("type") !== "R") window.location.href = "/404";
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    axios.get("/api/user/auth", config).then(async (res) => {
      this.setState({ user: res.data });
      if (this.state.user.dp) {
        try {
          const result = await axios.get(
            "/api/dp/download/" + localStorage.getItem("id"),
            {
              responseType: "blob",
            }
          );
          this.setState({ dp: URL.createObjectURL(result.data) });
        } catch (error) {
          if (error.response && error.response.status === 400) {
            alert("Error while downloading DP file. Try again later");
          }
        }
      }
    });
  }

  render() {
    function rating(arg) {
      return getRating(arg.state.user);
    }
    return (
      <div>
        <Card style={{ margin: 1 + "rem" }}>
          <Card.Header as="h3">Welcome {this.state.user.Name}!</Card.Header>
          <Card.Body>
            {this.renderDP()}
            <Card.Title>Email</Card.Title>
            <Card.Text>{this.state.user.Email}</Card.Text>
            <Card.Title>Bio</Card.Title>
            <Card.Text>{this.state.user.Bio}</Card.Text>
            <Card.Title>Contact</Card.Title>
            <Card.Text>{this.state.user.Contact}</Card.Text>
            <Card.Text>{this.renderNameform()}</Card.Text>
            <Card.Text>{this.renderEmailform()}</Card.Text>
            <Card.Text>{this.renderBioform()}</Card.Text>
            <Card.Text>{this.renderContactform()}</Card.Text>

            <Card.Text></Card.Text>
          </Card.Body>
        </Card>
        <Card style={{ margin: 1 + "rem" }}>
          <Card.Body>{this.renderPasswordform()}</Card.Body>
        </Card>
      </div>
    );
  }
}
