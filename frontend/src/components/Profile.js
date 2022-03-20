import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
import AppProfile from "../components/AppProfile";
import RecProfile from "../components/RecProfile";

export default class Profile extends Component {
  render() {
    if (localStorage.getItem("type") === "A") {
      return <AppProfile></AppProfile>;
    } else if (localStorage.getItem("type") === "R") {
      return <RecProfile></RecProfile>;
    } else {
      window.location.href = "/404";
    }
  }
}
