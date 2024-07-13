import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import Paginate from "./panigate";

export default function Tabs({ children }) {
  const [isActiveTab, setIsActiveTab] = useState(0);
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("https://api.realworld.io/api/user", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setUser(res.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const activeTab = children[isActiveTab].props;

  const handleTabClick = (index, e) => {
    e.preventDefault();
    setIsActiveTab(index);
    children[isActiveTab].props.clickTab(1);
  };

  return (
    <div>
      <div className="feed-toggle articles-toggle">
        <ul className="nav nav-pills outline-active">
          {children.map((item, index) => (
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
            <button className="btn btn-outline-primary btn-sm pull-xs-right ">
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
        postPerPage={activeTab.postPerPage}
        totalPost={activeTab.total}
        currentPage={activeTab.currentPage}
        paginate={activeTab.paginate}
      />
    </div>
  );
}

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
