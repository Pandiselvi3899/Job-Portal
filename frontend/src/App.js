import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/navbar";
import Login from "./components/login";
import Logout from "./components/logout";
import Register from "./components/register";
import Profile from "./components/Profile";
import RecNavbar from "./components/recruiternavbar";
import AppNavbar from "./components/applicantnavbar";
import AddJob from "./components/addJob";
import Apply from "./components/Apply";
import MyAppl from "./components/myAppl";
import JobList from "./components/JobList";
import Edit from "./components/Edit";
import ApplList from "./components/ApplList";
import Accp from "./components/Accp";
import Home from "./components/Home";
import a404 from "./components/404";
import SOP from "./components/SOP";

function App() {
  let current_navbar = <NavBar></NavBar>;
  if (localStorage.getItem("type") === "A")
    current_navbar = <AppNavbar></AppNavbar>;
  else if (localStorage.getItem("type") === "R")
    current_navbar = <RecNavbar></RecNavbar>;
  return (
    <Router>
      <div className="container">
        {current_navbar}
        <br />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/addJob" component={AddJob} />
          <Route exact path="/apply" component={Apply} />
          <Route exact path="/myappl" component={MyAppl} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/joblist" component={JobList} />
          <Route exact path="/edit" component={Edit} />
          <Route exact path="/appl" component={ApplList} />
          <Route exact path="/SOP" component={SOP} />
          <Route exact path="/accp" component={Accp} />
          <Route exact path="/" component={Home} />
          <Route exact path="/404" component={a404} />
          <Route component={a404} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
