import { faCommentDots, faHdd } from "@fortawesome/free-regular-svg-icons";
import {
  faCube,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../App";
import firebase from "firebase/app";
import "firebase/auth";
import "./Sidebar.css";

const Sidebar = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("https://gh-task.herokuapp.com/adminCheck?email=" + loggedInUser.email)
      .then((res) => res.json())
      .then((data) => {
        if (data.length !== 0) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      });
  }, [loggedInUser.email]);


  const handleLogoutClick = () => {
    firebase.auth().signOut().then(() => {
      setLoggedInUser("")
      console.log("Sign out successful");
    }).catch((error) => {
      // An error happened.
    });
    sessionStorage.removeItem('token')
  }

  return (
    <div className="sidebar">
      <a className="display-4 text-decoration-none active" href="/" onClick={handleLogoutClick}>
        GH Task
      </a>
      <Link className="lead text-decoration-none" to="/dashboard/taskList">
        <FontAwesomeIcon className="mx-2" icon={faHdd} />
        TaskList
      </Link>
      {isAdmin && (
        <Link className="lead text-decoration-none" to="/dashboard/addTask">
          <FontAwesomeIcon className="mx-2" icon={faPlusSquare} />
          Add Task
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
