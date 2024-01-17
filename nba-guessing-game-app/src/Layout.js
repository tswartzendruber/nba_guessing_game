import { Outlet, Link } from "react-router-dom";
import React, { useState } from "react";
import './App.css';

const Layout = () => {
    const [display, setNavDisplay] = useState("none");

    const toggleNavDisplay = () => {
        setNavDisplay((previousDisplay) => (previousDisplay === "none" ? "block" : "none"));
    };

  return (
    <>

      <div class="navDropDown">
          <button class="navDropDownButton" onClick={toggleNavDisplay}><i class="material-symbols-outlined">menu</i></button>
          <div class="navDropDownOptions" style={{display: display,}}>
              <p className="navPara"><Link to="/">Home</Link></p>
              <p className="navPara"><Link to="/stats">NBA Stats</Link></p>
              <p className="navPara"><Link to="/guess-the-player">Guess The NBA Player</Link></p>
          </div>
      </div>

      <Outlet />
    </>
  )
};

export default Layout;
