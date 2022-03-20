import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class Logout extends Component {
  componentDidMount() {
    localStorage.setItem("token", "");
    localStorage.setItem("type", "");
    localStorage.setItem("name", "");
    localStorage.setItem("email", "");
    localStorage.setItem("id", "");
    localStorage.setItem("Contact", "");
    window.alert("Logout Successfull!");
    window.location.href = "/";
  }
  render() {
    return <p></p>;
  }
}
