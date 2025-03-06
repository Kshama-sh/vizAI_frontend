import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [click, setCLick] = useState(false);
  const [loggedIn, setLogin] = useState(false);
  useEffect(() => {
    setLogin(localStorage.getItem("login"));
  }, [loggedIn]);

  const handleClick = () => setCLick(!click);

  return (
    <>
      <nav>
        <div>
          <Link to="/">Paws and claws</Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menuactive" : "nav-menu"}>
            <li>
              <Link to="/" className="nav-links">
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="nav-links">
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="nav-links"
                /*onClick={handleClick}*/
              >
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Support" className="nav-links">
                Support
              </Link>
            </li>
          </ul>
          {loggedIn ? (
            <>
              <li classname="nav-item">
                <Link to="/" className="nav-links prof">
                  Profile
                </Link>
              </li>
            </>
          ) : (
            <Link className="btn--outline" to="/SignUp">
              Sign up
            </Link>
          )}

          {loggedIn ? (
            <>
              <li classname="nav-item log">
                <button
                  onClick={() => {
                    localStorage.clear();
                    setLogin(false);
                  }}
                  className="btn--outline"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <Link className="btn--outline" to="/login">
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
