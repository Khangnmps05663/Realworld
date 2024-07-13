import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Paginate from "./panigate";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useContext(UserContext);
  const [post, setPost] = useState([]);
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPost, setTotalPost] = useState(0); // Initialized totalPost state
  const [postPerPage] = useState(10);
  const [follow, setFollow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    fetchArticle();
    fetchTag();
  }, [currentPage, postPerPage, tag]); // Removed post from dependency array since it is updated inside fetchArticle

  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const currentUser = await axios.get("https://api.realworld.io/api/user", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setUser(currentUser.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchArticle = async () => {
    try {
      const articles = tag
        ? await axios.get(
            `https://api.realworld.io/api/articles/?limit=${postPerPage}&tag=${tag}&offset=${
              currentPage * postPerPage - postPerPage
            }`
          )
        : await axios.get(
            `https://api.realworld.io/api/articles/?limit=${postPerPage}&offset=${
              currentPage * postPerPage - postPerPage
            }`
          );

      setPost(articles.data.articles);
      setTotalPost(articles.data.articlesCount);

      articles.data.articles.map((item) => {
        setFollow(item.favorited);
      });
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const fetchTag = async () => {
    try {
      const tags = await axios.get("https://api.realworld.io/api/tags");
      setTags(tags.data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const changeTag = async (e, tag) => {
    e.preventDefault();
    setTag(tag);
  };

  const favoritePost = async (slug, index, item) => {
    console.log("fav ", index);
    console.log("item after lclic ", item);
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.post(
          `https://api.realworld.io/api/articles/${slug}/favorite`,
          {},
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        console.log("fav ", res);
        setFollow(true);
        setActiveIndex(index);
      } catch (error) {
        console.error("Error favoriting post:", error);
      }
    } else {
      navigate("/register");
    }
  };

  const unFavoritePost = async (slug, index) => {
    console.log("unFavoritePost ", index);
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.delete(
          `https://api.realworld.io/api/articles/${slug}/favorite`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        console.log("unfa ", res);
        setFollow(false);
        setActiveIndex(null);
      } catch (error) {
        console.error("Error unfavoriting post:", error);
      }
    } else {
      navigate("/register");
    }
  };

  const Tabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handClick = (index, e) => {
      e.preventDefault();
      setActiveTab(index);
    };

    return (
      <div className="col-md-9">
        <div className="feed-toggle">
          <ul className="nav nav-pills outline-active">
            {children.map((item, index) => (
              <li className="nav-item" key={index}>
                <a
                  href=""
                  className={`nav-link ${index === activeTab ? "active" : ""}`}
                  onClick={(e) => handClick(index, e)}
                >
                  {item.props.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {children[activeTab]}
      </div>
    );
  };

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <Tabs>
            <div label="Your Feed">
              {post.map((item, index) => (
                <div className="article-preview" key={index}>
                  <div className="article-meta">
                    <a href={"/profile/" + item.author.username}>
                      <img src={item.author.image} alt={item.author.username} />
                    </a>
                    <div className="info">
                      <a
                        href={"/profile/" + item.author.username}
                        className="author"
                      >
                        {item.author.username}
                      </a>
                      <span className="date">
                        {new Date(item.updatedAt).toLocaleDateString("en-US")}
                      </span>
                    </div>
                    <button
                      className={`btn btn-outline-primary btn-sm pull-xs-right ${
                        follow && activeIndex === index ? "active" : ""
                      }`}
                      onClick={() =>
                        follow && activeIndex === index
                          ? unFavoritePost(item.slug, index)
                          : favoritePost(item.slug, index)
                      }
                    >
                      <i className="ion-heart"></i> {item.favoritesCount}
                    </button>
                  </div>
                  <a href={"article/" + item.slug} className="preview-link">
                    <h1>{item.title}</h1>
                    <p>{item.description}</p>
                    <span>Read more...</span>
                    <ul className="tag-list">
                      {item.tagList.map((tag, index) => (
                        <li
                          className="tag-default tag-pill tag-outline"
                          key={index}
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </a>
                </div>
              ))}
              <Paginate
                postPerPage={postPerPage}
                totalPost={totalPost}
                currentPage={currentPage}
                paginate={paginate}
              />
            </div>
            <div label="Global Feed">
              {post.map((item, index) => (
                <div className="article-preview" key={index}>
                  <div className="article-meta">
                    <a href={"/profile/" + item.author.username}>
                      <img src={item.author.image} alt={item.author.username} />
                    </a>
                    <div className="info">
                      <a
                        href={"/profile/" + item.author.username}
                        className="author"
                      >
                        {item.author.username}
                      </a>
                      <span className="date">
                        {new Date(item.updatedAt).toLocaleDateString("en-US")}
                      </span>
                    </div>
                    <button
                      className={`btn btn-outline-primary btn-sm pull-xs-right ${
                        follow && activeIndex === index ? "active" : ""
                      }`}
                      onClick={() =>
                        follow === item.favorited
                          ? favoritePost(item.slug, index, item)
                          : unFavoritePost(item.slug, index)
                      }
                    >
                      <i className="ion-heart"></i> {item.favoritesCount}
                    </button>
                  </div>
                  <a href={"article/" + item.slug} className="preview-link">
                    <h1>{item.title}</h1>
                    <p>{item.description}</p>
                    <span>Read more...</span>
                    <ul className="tag-list">
                      {item.tagList.map((tag, index) => (
                        <li
                          className="tag-default tag-pill tag-outline"
                          key={index}
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </a>
                </div>
              ))}
              <Paginate
                postPerPage={postPerPage}
                totalPost={totalPost}
                currentPage={currentPage}
                paginate={paginate}
              />
            </div>
          </Tabs>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <div className="tag-list">
                {tags.map((item, index) => (
                  <a
                    key={index}
                    href=""
                    className="tag-pill tag-default"
                    onClick={(e) => changeTag(e, item)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
