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
import download from "downloadjs";
var validator = require("validator");
var wordcount = require("wordcount");

export default class AppProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      edus: [],
      skills: [],
      newskill: "Js",
      renderEduform: false,
      renderBioform: false,
      renderNameform: false,
      renderContactform: false,
      renderEmailform: false,
      renderPasswordform: false,
      renderOtherSkillform: false,
      insti: "",
      start: "",
      end: "",
      contact: "",
      Name: "",
      email: "",
      bio: "",
      oldpassword: "",
      newpassword: "",
      newpassword_r: "",
      other: "",
      cv: "",
      dp: "",
      dpu: "",
    };

    this.onChangeBio = this.onChangeBio.bind(this);
    this.onChangeContact = this.onChangeContact.bind(this);
    this.onChangeInsti = this.onChangeInsti.bind(this);
    this.onChangeStart = this.onChangeStart.bind(this);
    this.onChangeEnd = this.onChangeEnd.bind(this);
    this.onChangeSkill = this.onChangeSkill.bind(this);
    this.onDeleteEdu = this.onDeleteEdu.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDeleteSkill = this.onDeleteSkill.bind(this);
    this.onAddEdu = this.onAddEdu.bind(this);
    this.renderEduform = this.renderEduform.bind(this);
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
    this.onChangeOther = this.onChangeOther.bind(this);
    this.renderSkillForm = this.renderSkillForm.bind(this);
    this.onCV = this.onCV.bind(this);
    this.Downloadfile = this.Downloadfile.bind(this);
    this.renderCV = this.renderCV.bind(this);
    this.renderDP = this.renderDP.bind(this);
    this.onDP = this.onDP.bind(this);
  }
  onChangeBio(event) {
    this.setState({ bio: event.target.value });
  }
  onChangeOther(event) {
    this.setState({ other: event.target.value });
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
  onChangeInsti(event) {
    this.setState({ insti: event.target.value });
  }
  onChangeStart(event) {
    this.setState({ start: event.target.value });
  }
  onChangeEnd(event) {
    this.setState({ end: event.target.value });
  }
  renderEduform() {
    if (this.state.renderEduform === true) {
      return (
        <div>
          <Form onSubmit={this.onAddEdu}>
            <div className="form-group">
              <label>Institute Name: </label>
              <input
                type="text"
                className="form-control"
                value={this.state.insti}
                onChange={this.onChangeInsti}
              />
            </div>
            <div className="form-group">
              <label>Start Year: </label>
              <input
                type="text"
                className="form-control"
                value={this.state.start}
                onChange={this.onChangeStart}
              />
            </div>
            <div className="form-group">
              <label>End Year: </label>
              <input
                type="text"
                className="form-control"
                value={this.state.end}
                onChange={this.onChangeEnd}
              />
            </div>
            <div className="form-group">
              <input type="submit" value="Add" className="btn btn-primary" />
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
              this.onAddEdu();
            }}
          >
            Add Education
          </Button>
        </div>
      );
    }
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

  onAddEdu(e) {
    if (e) {
      e.preventDefault();
    }

    if (this.state.renderEduform === false) {
      this.setState({ renderEduform: true });
      return;
    }
    var inst = this.state.insti.trim();
    var start = this.state.start.trim();
    var end = this.state.end.trim();
    if (validator.isEmpty(inst)) {
      alert("Institute cannot be Empty!");
      return;
    }
    if (!validator.isInt(start, { min: 1920, max: new Date().getFullYear() })) {
      alert("Start Year is Invalid!");
      return;
    }

    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    if (!end || end === "") {
      end = -1;
    } else {
      if (!validator.isInt(end, { min: 1920, max: 2120 })) {
        alert("Invalid End Year!");
        return;
      }
    }
    start = parseInt(start);
    end = parseInt(end);
    var req = {
      edu: {
        uid: localStorage.getItem("id"),
        institute: inst,
        start_year: start,
        end_year: end,
      },
    };
    axios
      .post("/api/user/edu/update", req, config)
      .then((response) => {})
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
    window.location.href = "/profile";
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
      .then((response) => {})
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
  onDeleteSkill(ski) {
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var req = {
      id: ski._id,
    };
    axios.post("/api/user/skills/delete", req, config).then((res) => {});
    window.location.href = "/profile";
  }
  onChangeSkill(event) {
    if (event.target.value === "Other") {
      this.setState({ renderOtherSkillform: true });
      return;
    }

    this.setState({ newskill: event.target.value });
  }

  onDeleteEdu(edu) {
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var req = {
      id: edu._id,
    };
    axios.post("/api/user/edu/delete", req, config).then((res) => {});
    window.location.href = "/profile";
  }
  async Downloadfile() {
    try {
      const file = await axios.get("/api/cv/get/" + localStorage.getItem("id"));
      var path = file.data.file_path;
      var mimetype = file.data.file_mimetype;
      const result = await axios.get(
        "/api/cv/download/" + localStorage.getItem("id"),
        {
          responseType: "blob",
        }
      );
      const split = path.split("/");
      const filename = split[split.length - 1];
      return download(result.data, filename, mimetype);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Error while downloading file. Try again later");
      }
    }
  }
  async onCV(e) {
    e.preventDefault();
    var id = localStorage.getItem("id");
    const formData = new FormData();
    formData.append("file", this.state.cv);
    formData.append("uid", id);
    try {
      await axios.post("/api/cv/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      if (error.response) alert(error.response.data);
    }
    window.location.href = "/profile";
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
  renderCV() {
    if (this.state.user.cv) {
      return (
        <Button
          style={{ margin: 1 + "rem" }}
          variant="warning"
          className="btn btn-primary"
          value="download"
          onClick={() => this.Downloadfile()}
        >
          Download CV
        </Button>
      );
    }
    return (
      <Form style={{ margin: 1 + "rem" }} onSubmit={this.onCV}>
        <Form.Group>
          <Form.File
            onChange={(e) => {
              this.setState({ cv: e.target.files[0] });
            }}
            id="exampleFormControlFile1"
            label="Choose CV PDF File to Upload"
          />
        </Form.Group>
        <div className="form-group">
          <input type="submit" value="Upload CV" className="btn btn-primary" />
        </div>
      </Form>
    );
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
  onSubmit(e) {
    e.preventDefault();
    var newskill = "";
    if (this.state.renderOtherSkillform === true) {
      newskill = this.state.other;
    } else {
      newskill = this.state.newskill;
    }
    if (validator.isEmpty(newskill)) {
      alert("New skill cannot be empty!");
      return;
    }

    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    var req = {
      uid: localStorage.getItem("id"),
      Name: newskill,
    };
    axios
      .post("/api/user/skills/add/", req, config)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data);
      });
    window.location.href = "/profile";
  }

  componentDidMount() {
    if (localStorage.getItem("type") !== "A") window.location.href = "/404";
    var config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    axios.get("/api/user/edu", config).then((res) => {
      this.setState({ edus: res.data });
    });
    axios.get("/api/user/skills", config).then((res) => {
      this.setState({ skills: res.data });
    });
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
  renderSkillForm() {
    if (this.state.renderOtherSkillform === false) {
      return (
        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Skill</Form.Label>
            <Form.Control
              as="select"
              value={this.state.newskill}
              onChange={this.onChangeSkill}
              inputRef={(el) => (this.inputEl = el)}
            >
              <option value="Js">Js</option>
              <option value="C">C</option>
              <option value="C++">C++</option>
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>
          <div className="form-group">
            <input
              type="submit"
              value="Add Skill"
              className="btn btn-primary"
            />
          </div>
        </Form>
      );
    } else {
      return (
        <Form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Other Skill: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.other}
              onChange={this.onChangeOther}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Add" className="btn btn-primary" />
          </div>
        </Form>
      );
    }
  }

  render() {
    function rating(arg) {
      return getRating(arg.state.user);
    }
    function getEndYear(arg) {
      if (arg.end_year === -1) return "Ongoing";
      return arg.end_year;
    }
    function renderedu(arg) {
      if (arg.state.edus.length === 0) {
        return <Card.Text>Add education details!</Card.Text>;
      }
      return (
        <div>
          {arg.state.edus.map((e, i) => {
            return (
              <Card style={{ margin: 1 + "rem" }}>
                <Card.Body>
                  <Card.Title>{e.institute}</Card.Title>
                  <Card.Text>Start Year: {e.start_year}</Card.Text>
                  <Card.Text>End Year: {getEndYear(e)}</Card.Text>
                  <Card.Text>
                    <Button
                      variant="danger"
                      className="btn btn-primary"
                      value="delete"
                      onClick={() => arg.onDeleteEdu(e)}
                    >
                      Delete
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      );
    }
    function renderskills(arg) {
      if (arg.state.skills.length === 0) {
        return <Card.Text>Add Skills Please!</Card.Text>;
      }
      return (
        <div>
          {arg.state.skills.map((e, i) => {
            return (
              <Card style={{ margin: 1 + "rem" }}>
                <Card.Body>
                  <Card.Text> {e.Name}</Card.Text>
                  <Button
                    variant="danger"
                    className="btn btn-primary"
                    value="delete"
                    onClick={() => arg.onDeleteSkill(e)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      );
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
            <Card.Title>Rating</Card.Title>
            <Card.Text>{rating(this)}</Card.Text>
            <Card.Text>{this.renderNameform()}</Card.Text>
            <Card.Text>{this.renderEmailform()}</Card.Text>
            <Card.Text>{this.renderBioform()}</Card.Text>
            <Card.Text>{this.renderContactform()}</Card.Text>

            <Card.Text>{this.renderCV()}</Card.Text>
          </Card.Body>
        </Card>

        <Card style={{ margin: 1 + "rem" }}>
          <Card.Header as="h4">Education</Card.Header>

          <Card.Body>
            {" "}
            {renderedu(this)}
            <Card.Text style={{ margin: 1 + "rem" }}>
              {this.renderEduform()}
            </Card.Text>
          </Card.Body>
        </Card>
        <Card style={{ margin: 1 + "rem" }}>
          <Card.Header as="h4">Skills</Card.Header>

          <Card.Body>
            {" "}
            {renderskills(this)}
            <Card.Text style={{ margin: 1 + "rem" }}>
              {this.renderSkillForm()}
            </Card.Text>
          </Card.Body>
        </Card>
        <Card style={{ margin: 1 + "rem" }}>
          <Card.Body>{this.renderPasswordform()}</Card.Body>
        </Card>
      </div>
    );
  }
}
