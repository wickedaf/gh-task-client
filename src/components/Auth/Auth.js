import React, { useContext, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { UserContext } from "../../App";
import { Link, useHistory, useLocation } from "react-router-dom";
import "./Auth.css";
import { useForm } from "react-hook-form";
import { Button } from "react-bootstrap";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Auth = () => {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    password: "",
    photo: "",
  });
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/dashboard" } };

  const handleResponse = (result, redirect) => {
    setUser(result);
    setLoggedInUser(result);
    storeAuthToken();
    if (redirect) {
      history.replace(from);
    }
  };

  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    if (newUser && data.email && data.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then((userCredential) => {
          const newUserInfo = userCredential.user;
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
          handleResponse(newUserInfo, true);

          const currentUser = firebase.auth().currentUser;

          currentUser
            .updateProfile({
              displayName: data.name,
              photoURL: "https://example.com/jane-q-user/profile.jpg",
            })
            .then(() => {
              console.log("update name");
            })
            .catch((error) => {});
        })
        .catch((error) => {
          const newUserInfo = {};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }

    if (!newUser && data.email && data.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password)
        .then((userCredential) => {
          const user = userCredential.user;
          user.error = "";
          user.success = true;
          setUser(user);
          handleResponse(user, true);
        })
        .catch((error) => {
          const newUserInfo = {};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
  };

  const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const { displayName, photoURL, email } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
          success: true,
        };
        setUser(signedInUser);
        handleResponse(signedInUser, true);
      })
      .catch((error) => {
        // Handle Errors here.
        const newUserInfo = {};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
  };

  const storeAuthToken = () => {
    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(function (idToken) {
        sessionStorage.setItem("token", idToken);
        history.replace(from);
      })
      .catch(function (error) {
        // Handle error
      });
  };

  return (
    <div className="container">
      <div className="auth-container my-5">
        <div className="row mx-auto px-5">
          <div className="col">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="border p-5 shadow"
            >
              {newUser ? <h4>Create an account</h4> : <h4>Login</h4>}
              {newUser && (
                <input
                  className="form-control my-3"
                  placeholder="Your Name"
                  {...register("name", { required: true })}
                />
              )}
              <input
                className="form-control my-3"
                placeholder="Email"
                {...register("email", { required: true })}
              />
              <input
                className="form-control my-3"
                placeholder="Password"
                type="password"
                {...register("password", { required: true })}
              />
              {newUser && (
                <input
                  className="form-control my-3"
                  placeholder="Confirm Password"
                  type="password"
                  {...register("confirmPassword", { required: true })}
                />
              )}
              {newUser ? (
                <input
                  className="form-control my-3 bg-primary text-white"
                  type="submit"
                  value="Create New User"
                />
              ) : (
                <input
                  className="form-control my-3 bg-primary text-white"
                  type="submit"
                  value="Login"
                />
              )}
              {newUser ? (
                <p>
                  Already have an account?{" "}
                  <Link to="#" onClick={() => setNewUser(!newUser)}>
                    Login
                  </Link>
                </p>
              ) : (
                <p>
                  Don't have an account?{" "}
                  <Link to="#" onClick={() => setNewUser(!newUser)}>
                    Create an account
                  </Link>
                </p>
              )}
            </form>
          </div>
          <br />
        </div>
        {user.success && (
          <p style={{ color: "green", textAlign: "center" }}>
            User {user.email} logged in successfully
          </p>
        )}
        {user.error && (
          <p style={{ color: "red", textAlign: "center", paddingTop: "5px" }}>
            {user.error}
          </p>
        )}
        <hr className="w-100" />
        <div className="row mx-auto px-5">
          <div className="col">
            <div className="row">
              <Button
                className="form-control d-flex align-items-center my-2 social-btn border-0 rounded-pill shadow"
                onClick={handleGoogleSignIn}
                variant="outline-dark"
              >
                <img
                  className="d-flex justify-content-start"
                  src="/google.png"
                  alt=""
                />
                <div className="mx-auto"> Sign In With Google</div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
