import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";

export default function Header() {
  const [user, setUser] = useContext(UserContext);
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const currentUser = await axios.get(
          "https://api.realworld.io/api/user",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        // console.log(currentUser.data.user);
        setUser(currentUser.data.user);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <nav className="navbar navbar-light">
      {user.username && user ? (
        <div className="container">
          <a className="navbar-brand" href="/">
            conduit
          </a>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <a className="nav-link active" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/editor">
                {" "}
                <i className="ion-compose"></i>&nbsp;New Article{" "}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/settings">
                {" "}
                <i className="ion-gear-a"></i>&nbsp;Settings{" "}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={"/profile/" + user.username}>
                <img src={user.image} className="user-pic" />
                {user.username}
              </a>
            </li>
          </ul>
        </div>
      ) : (
        <div className="container">
          <a className="navbar-brand" href="/">
            conduit
          </a>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <a className="nav-link active" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/login">
                Sign in
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/register">
                Sign up
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
