import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Setting() {
  //   const [user, setUser] = useContext(UserContext);
  const [image, setImage] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState([]);
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) navigate("/login");
      try {
        const result = await axios.get("https://api.realworld.io/api/user", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const userData = result.data.user;
        setImage(userData.image);
        setUsername(userData.username);
        setBio(userData.bio);
        setEmail(userData.email);
        setPassword(userData.password);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const body = {
      user: {
        email: email !== "" ? email : " ",
        password: password !== "" ? password : " ",
        username: username !== "" ? username : " ",
        bio: bio !== "" ? bio : " ",
        image: image,
      },
    };
    try {
      const result = await axios.put(
        "https://api.realworld.io/api/user",
        body,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log(result);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({});
    navigate("/");
  };

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            {/* <ul className="error-messages">
              <li>That name is required</li>
            </ul> */}

            <form>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    value={image}
                    onChange={(e) => setImage(e.target.value.trim())}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.trim())}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                    value={bio}
                    onChange={(e) => setBio(e.target.value.trim())}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="New Password"
                    onChange={(e) => setPassword(e.target.value.trim())}
                  />
                </fieldset>
                <button
                  type="button"
                  className="btn btn-lg btn-primary pull-xs-right"
                  onClick={handleUpdate}
                >
                  Update Settings
                </button>
              </fieldset>
            </form>
            <hr />
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={handleLogout}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
