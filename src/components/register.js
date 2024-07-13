import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState([]);
  const [user, setUser] = useContext(UserContext);

  const handleRegister = async () => {
    const body = {
      user: {
        username: username,
        email: email,
        password: password,
      },
    };
    try {
      const result = await axios.post(
        "https://api.realworld.io/api/users",
        body
      );
      setUser(result.data.user);
      localStorage.setItem("token", result.data.user.token);
      navigate("/");
    } catch (error) {
      setMessage(error.response.data.errors);
      console.log(error.response.data.errors);
    }
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <a href="/login">Have an account?</a>
            </p>

            <ul className="error-messages">
              {Object.keys(message).map((key, index) => {
                return message[key].map((value) => {
                  return <li key={index}>{key + " " + value}</li>;
                });
              })}
            </ul>

            <form>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </fieldset>
              <button
                type="button"
                className="btn btn-lg btn-primary pull-xs-right"
                onClick={handleRegister}
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
