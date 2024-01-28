import { Outlet, Link } from "react-router-dom";
import React, { useState } from "react";
import './App.css';

const Layout = () => {
    const [navDisplay, setNavDisplay] = useState(false);

    const toggleNavDisplay = () => {
        setNavDisplay(!navDisplay);
    };

    return (
        <>
            <div className="navDropDown">
                <button className="navDropDownButton" onClick={toggleNavDisplay}><i className="material-symbols-outlined">menu</i></button>
                <div className={`navDropDownOptions ${navDisplay ? 'open' : 'closed'}`}>
                    {/*
                    <Link to="/"><p className="navPara">NBA Stats</p></Link>
                    <Link to="/guess-the-player"><p className="navPara">Guess The NBA Player</p></Link>
                    <Link to="/full-table"><p className="navPara">Full Table</p></Link>
                    */}
                    <Link to="/"><p className="navPara">NBA Stats</p></Link>
                    <Link to="/guess-the-player"><p className="navPara">Guess The NBA Player</p></Link>
                </div>
            </div>

            <Outlet />
        </>
    );
};

export default Layout;