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
              <Link to="/"><p className="navPara">NBA Stats</p></Link>
              <Link to="/guess-the-player"><p className="navPara">Guess The NBA Player</p></Link>
              {/*<Link to="/full-table"><p className="navPara">Full Table</p></Link>*/}
          </div>
      </div>

      <Outlet />
    </>
  )
};

export default Layout;
