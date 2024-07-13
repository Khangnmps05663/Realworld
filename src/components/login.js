import axios from "axios";
import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState([]);
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
        setUser(currentUser.data.user);
        navigate("/");
      } catch (error) {
        navigate("/login");
        console.log(error);
      }
    })();
  }, []);

  const handleLogin = async () => {
    const body = {
      user: {
        email: email,
        password: password,
      },
    };

    try {
      const result = await axios.post(
        "https://api.realworld.io/api/users/login",
        body
      );
      setUser(result.data.user);
      localStorage.setItem("token", result.data.user.token);
      navigate("/");
    } catch (error) {
      setMessage(error.response.data.errors);
    }
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <a href="/register">Need an account?</a>
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
                  type="email"
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
                onClick={handleLogin}
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
