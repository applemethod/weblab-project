import React, { useContext, useEffect, useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { Link } from "react-router-dom";

import "../../utilities.css";
import "./ProfileIcon.css";
import CryptoJS from "crypto-js";
import { UserContext } from "../App";

const ProfileIcon = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);

  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        setUserInfo(response.data); // Set user info in state
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to fetch user information.");
      }
    };

    fetchUserInfo();
  }, [userId]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!userInfo) {
    return <p>Loading user information...</p>;
  }

  const emailHash = CryptoJS.MD5(userInfo.email.trim().toLowerCase()).toString();
  const profilePicture = `https://www.gravatar.com/avatar/${emailHash}?s=80&d=mp&r=g`;

  <img src={profilePicture} alt="Profile" />;

  return (
    <>
      <div className="profile-container">
        <img src={profilePicture} alt="Profile" />
        <div className="profile-name">{userInfo.username}</div>
      </div>
    </>
  );
};

export default ProfileIcon;
