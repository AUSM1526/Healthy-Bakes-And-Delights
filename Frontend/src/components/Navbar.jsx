import React, {useState} from "react";
import Navbar_Login from "./Navbar_Login";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {useNavigate} from "react-router-dom";

const Navbar = () => {
    const user = useSelector((state) => state.auth.user);
    const isLoggedIn = Boolean(user);
    console.log("User:", user);
    console.log("isLoggedIn", isLoggedIn);
    const location = useLocation();
    const currentPath = location.pathname;

    const navigate = useNavigate();
    
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
      <>
        {!isLoggedIn && (
          <header className="fixed top-0 left-0 w-full z-50 bg-chocolate-light transition duration-300 shadow-md backdrop-blur-sm">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Brand Name */}
                <button 
                className="text-2xl font-playfair font-bold text-chocolate-dark transition-colors duration-300 tracking-wide" onClick={() => navigate("/")} >
                  Healthy Bakes & Delights
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex md:gap-8">
                  {[
                      { name: "Home", path: "/" },
                      { name: "Products", path: "/products" },
                      { name: "About Us", path: "/about" },
                      { name: "Contact Us", path: "/contact" },
                  ].map((item) =>  {
                        const isActive = currentPath === item.path;
                        return isActive ? (
                          <span
                            key={item.name}
                            className="text-chocolate-gold font-semibold text-lg cursor-default transition-colors duration-300"
                          >
                          {item.name}
                          </span>
                          ) : (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="text-chocolate-dark hover:text-chocolate-gold text-lg font-medium transition-colors duration-300"
                          >
                          {item.name}
                          </Link>
                        );
                  })}
                </nav>

                {/* Buttons */}
                <div className="hidden md:flex items-center gap-4">
                  <Link
                    className="rounded-md bg-[#4A2C1A] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-opacity-90"
                    to="/login"
                  >
                    Login
                  </Link>
                  <Link
                    className="rounded-md bg-chocolate-dark px-5 py-2 text-sm font-semibold text-white transition hover:bg-opacity-90"
                    to="/register"
                  >
                    Register
                  </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                  <button
                    className="rounded-md p-2 text-chocolate-dark hover:text-chocolate-gold"
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden bg-white shadow-md p-4 space-y-2">
                {[
                    { name: "Home", path: "/" },
                    { name: "Products", path: "/products" },
                    { name: "About Us", path: "/about" },
                    { name: "Contact Us", path: "/contact" },
                  ].map((item) => {
                      const isActive = currentPath === item.path;
                      return isActive ? (
                        <span
                          key={item.name}
                          className="block text-chocolate-gold text-lg font-semibold cursor-default"
                        >
                        {item.name}
                        </span>
                        ) : (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block text-chocolate-dark text-lg font-medium transition hover:text-chocolate-gold"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                        {item.name}
                        </Link>
                      );
                    }
                  )
                }
                <Link
                  className="block w-full text-center rounded-md bg-[#4A2C1A] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-opacity-90"
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  className="block w-full text-center rounded-md bg-chocolate-dark px-5 py-2 text-sm font-semibold text-white transition hover:bg-opacity-90"
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </header>
        )}
        {isLoggedIn && <Navbar_Login />}
      </>
    );
}

export default Navbar;