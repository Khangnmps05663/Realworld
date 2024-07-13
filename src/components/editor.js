import axios from "axios";
import { useContext, useEffect } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Editor() {
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const articles = await axios.get(
          "https://api.realworld.io/api/articles/?author=cac"
        );
        console.log("articles ", articles);
      } catch (error) {}

      const token = localStorage.getItem("token");
      if (!token) navigate("/login");
      try {
        const result = await axios.get("https://api.realworld.io/api/user", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handlePublish = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const body = {
      article: {
        title: "test123",
        description: "string",
        body: "string",
        tagList: ["string", "2"],
      },
    };
    try {
      const res = await axios.post(
        "https://api.realworld.io/api/articles",
        body,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log(res);
    } catch (error) {}
    try {
      const articles = await axios.get(
        "https://api.realworld.io/api/articles/?author=cac"
      );
      console.log("articles cac", articles);
    } catch (error) {}
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ul className="error-messages">
              <li>That title is required</li>
            </ul>

            <form>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                  />
                  <div className="tag-list">
                    <span className="tag-default tag-pill">
                      {" "}
                      <i className="ion-close-round"></i> tag{" "}
                    </span>
                  </div>
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="button"
                  onClick={handlePublish}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
