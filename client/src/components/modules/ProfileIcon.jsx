import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./ProfileIcon.css";
import { get, post } from "../../utilities";
import CryptoJS from "crypto-js";
import { UserContext } from "../App";

const ProfileIcon = (props) => {
  const userId = props.userId;

  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${userId}`);
  };

  if (!userId) {
    const emailHash = CryptoJS.MD5("name@example.com").toString();
    const profilePicture = `https://www.gravatar.com/avatar/${emailHash}?s=80&d=mp&r=g`;
    return (
      <>
        <button className="profile-container" onClick={handleClick}>
          <img src={profilePicture} alt="Profile" />
          <div className="profile-name">{userInfo.username}</div>
        </button>
      </>
    );
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await get(`/api/user/${userId}`);
        console.log("Received user info:", response);
        setUserInfo(response); // Set user info in state
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
      <button className="profile-container" onClick={handleClick}>
        <img src={profilePicture} alt="Profile" />
        <div className="profile-name">{userInfo.username}</div>
      </button>
    </>
  );
};

export default ProfileIcon;
