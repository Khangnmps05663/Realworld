// import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useEffect, useState } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./components/profile";
import Setting from "./components/setting";
import Article from "./components/article";
import Editor from "./components/editor";
import Tab from "./components/tab";
import Test from "./components/test";

export const UserContext = React.createContext({
  email: "",
  username: "",
  token: "",
});

function App() {
  const [user, setUser] = useState({
    email: "",
    username: "",
    token: "",
  });

  return (
    <UserContext.Provider value={[user, setUser]}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route expact path="/" element={<Home />}></Route>
          <Route expact path="/test" element={<Test />}></Route>
          <Route expact path="/login" element={<Login />}></Route>
          <Route expact path="/register" element={<Register />}></Route>
          <Route expact path="/profile/:username" element={<Profile />}></Route>
          <Route expact path="/settings" element={<Setting />}></Route>
          <Route expact path="/article/:slug" element={<Article />}></Route>
          <Route expact path="/editor" element={<Editor />}></Route>
          <Route expact path="/tab" element={<Tab />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
