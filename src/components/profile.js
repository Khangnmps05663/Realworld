import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";
import Tabs from "./tab";

export default function Profile() {
  const { username } = useParams();

  const [ownArticle, setOwnArticle] = useState([]);
  const [globalArticle, setGlobalArticle] = useState([]);
  const [favArticle, setFavArticle] = useState([]);

  const [profile, setProfile] = useState({});
  const [user, setUser] = useContext(UserContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);

  const [totalPost, setTotalPost] = useState(0);
  const [totalPost2, setTotalPost2] = useState(0);

  const [postPerPage] = useState(5);

  useEffect(() => {
    (async () => {
      getUser();
      fetchProfile();
      fetchOwnArticle();
      fetchGlobalArticle();
      // fetchFavArticle();
    })();
  }, [currentPage, currentPage2, postPerPage]);

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

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `https://api.realworld.io/api/profiles/${username}`
      );
      setProfile(res.data.profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchOwnArticle = async () => {
    try {
      const res = await axios.get(
        `https://api.realworld.io/api/articles/?author=${username}&limit=${postPerPage}&offset=${
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
        `https://api.realworld.io/api/articles/?author=Eugenia Weber&limit=${postPerPage}&offset=${
          currentPage2 * postPerPage - postPerPage
        }`
      );
      console.log(res);
      const { articles, articlesCount } = res.data;
      setGlobalArticle(articles);
      setTotalPost2(articlesCount);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const fetchFavArticle = async () => {
    try {
      const res = await axios.get(
        `https://api.realworld.io/api/articles/?limit=${postPerPage}&offset=${
          currentPage2 * postPerPage - postPerPage
        }`
      );
      const { articles, articlesCount } = res.data;
      setFavArticle(articles);
      setTotalPost2(articlesCount);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const followUser = async () => {
    // const token = localStorage.getItem("token");
    // if (!token) navigate("/register");
    // try {
    //   const res = await axios.post(
    //     `https://api.realworld.io/api/profiles/${username}/follow`,
    //     {},
    //     {
    //       headers: {
    //         Authorization: `Token ${token}`,
    //       },
    //     }
    //   );
    //   console.log(res);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const unFollowUser = async () => {};

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginate2 = (pageNumber) => {
    setCurrentPage2(pageNumber);
  };

  const clickTab = (current) => {
    setCurrentPage(current);
    setCurrentPage2(current);
  };

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image} className="user-img" />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              {user.username === profile.username ? (
                <a
                  href="/settings"
                  className="btn btn-sm btn-outline-secondary action-btn"
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; Edit {user.username} Settings
                </a>
              ) : (
                <button className="btn btn-sm btn-outline-secondary action-btn">
                  <i className="ion-plus-round"></i>
                  &nbsp; Follow {profile.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <Tabs>
              <div
                title="Your Feed"
                data={ownArticle}
                postPerPage={postPerPage}
                total={totalPost}
                currentPage={currentPage}
                paginate={paginate}
                clickTab={clickTab}
              />
              <div
                title="Favorited Articles"
                data={globalArticle}
                postPerPage={postPerPage}
                total={totalPost2}
                currentPage={currentPage2}
                paginate={paginate2}
                clickTab={clickTab}
              />
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
