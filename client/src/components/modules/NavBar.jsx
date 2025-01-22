import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { Link } from "react-router-dom";

import "../../utilities.css";
import "./NavBar.css";
import Logo from "./logo.png";
import ProfileIcon from "./ProfileIcon";
import { UserContext } from "../App";

const NavBar = (props) => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);

  return (
    <>
      <Link to={`/`} className="logo">
        <img src={Logo} alt="logo" />
      </Link>
      <div className="profile">
        {userId ? (
          <>
            <ProfileIcon userId={userId} />
            <button
              onClick={() => {
                googleLogout();
                handleLogout();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
        )}
      </div>
    </>
  );
};

export default NavBar;
