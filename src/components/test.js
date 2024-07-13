import axios from "axios";
import React, { Children, useContext, useEffect, useState } from "react";
import Paginate from "./panigate";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Test() {
  const [user, setUser] = useContext(UserContext);

  const [ownArticle, setOwnArticle] = useState([]);
  const [globalArticle, setGlobalArticle] = useState([]);
  const [tagArticle, setTagArticle] = useState([]);

  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [currentPage3, setCurrentPage3] = useState(1);

  const [totalPost, setTotalPost] = useState(0);
  const [totalPost2, setTotalPost2] = useState(0);
  const [totalPost3, setTotalPost3] = useState(0);

  const [postPerPage] = useState(10);

  const [isActiveTab, setIsActiveTab] = useState(0);

  const [follow, setFollow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    fetchGlobalArticle();
    fetchOwnArticle();
    fetchByTag();
    fetchTag();
  }, [currentPage, currentPage2, currentPage3, postPerPage, tag]);

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

  const fetchOwnArticle = async () => {
    try {
      const res = await axios.get(
        `https://api.realworld.io/api/articles/?author=Ping Sokołowski&limit=${postPerPage}&offset=${
          currentPage * postPerPage - postPerPage
        }`
      );
      const { articles, articlesCount } = res.data;
      setOwnArticle(articles);
      setTotalPost(articlesCount);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const fetchGlobalArticle = async () => {
    try {
      const res = await axios.get(
        `https://api.realworld.io/api/articles/?limit=${postPerPage}&offset=${
          currentPage2 * postPerPage - postPerPage
        }`
      );
      const { articles, articlesCount } = res.data;
      setGlobalArticle(articles);
      setTotalPost2(articlesCount);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const fetchByTag = async () => {
    try {
      const res = await axios.get(
        `https://api.realworld.io/api/articles/?limit=${postPerPage}&tag=${tag}&offset=${
          currentPage3 * postPerPage - postPerPage
        }`
      );
      const { articles, articlesCount } = res.data;
      setTagArticle(articles);
      setTotalPost3(articlesCount);
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

  const paginate2 = (pageNumber) => {
    setCurrentPage2(pageNumber);
  };

  const paginate3 = (pageNumber) => {
    setCurrentPage3(pageNumber);
  };

  const changeTag = async (e, tag) => {
    e.preventDefault();
    setTag(tag);
    user.username ? setIsActiveTab(2) : setIsActiveTab(1);
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

  const Tab = ({ title, isActive, handleTabClick }) => {
    return (
      <li className="nav-item">
        <a
          href="#!"
          className={`nav-link ${isActive ? "active" : ""}`}
          onClick={handleTabClick}
        >
          {title}
        </a>
      </li>
    );
  };

  const Tabs = ({ children }) => {
    const [filteredChildren, setFilteredChildren] = useState(
      !user.username && !tag
        ? children.slice(1, children.length - 1)
        : user.username && !tag
        ? children.slice(0, children.length - 1)
        : !user.username && tag
        ? children.slice(1)
        : children
    );

    const activeTab = filteredChildren[isActiveTab].props;

    const handleTabClick = (index, e) => {
      e.preventDefault();

      setIsActiveTab(index);
      setCurrentPage(1);
      setCurrentPage2(1);
      setCurrentPage3(1);

      if (user.username && index !== 2) {
        setTag("");
        setFilteredChildren(filteredChildren.slice(0, 2));
      } else if (!user.username && index !== 1) {
        setTag("");
        setFilteredChildren(filteredChildren.slice(0, 1));
      }
    };

    return (
      <div>
        <div className="feed-toggle">
          <ul className="nav nav-pills outline-active">
            {filteredChildren.map((item, index) => (
              <Tab
                title={item.props.title}
                key={index}
                isActive={index === isActiveTab}
                handleTabClick={(e) => handleTabClick(index, e)}
              />
            ))}
          </ul>
        </div>

        {activeTab.data.map((item, index) => (
          <div className="article-preview" key={index}>
            <div className="article-meta">
              <a href={"/profile/" + item.author.username}>
                <img src={item.author.image} alt={item.author.username} />
              </a>
              <div className="info">
                <a href={"/profile/" + item.author.username} className="author">
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
                  <li className="tag-default tag-pill tag-outline" key={index}>
                    {tag}
                  </li>
                ))}
              </ul>
            </a>
          </div>
        ))}

        <Paginate
          postPerPage={postPerPage}
          totalPost={activeTab.total}
          currentPage={activeTab.currentPage}
          paginate={activeTab.paginate}
        />
      </div>
    );
  };

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">Test</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <Tabs>
              <div
                title="Your Feed"
                data={ownArticle}
                total={totalPost}
                currentPage={currentPage}
                paginate={paginate}
              />
              <div
                title="Global Feed"
                data={globalArticle}
                total={totalPost2}
                currentPage={currentPage2}
                paginate={paginate2}
              />
              <div
                title={`# ${tag}`}
                data={tagArticle}
                total={totalPost3}
                currentPage={currentPage3}
                paginate={paginate3}
              />
            </Tabs>
          </div>

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
