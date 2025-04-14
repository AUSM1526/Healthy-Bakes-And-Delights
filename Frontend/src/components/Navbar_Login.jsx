import React, { useState, useEffect, useRef } from "react";
import Cart from "./CartLogo";
import Logout from "./Logout";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import DefaultIcon from "../assets/DefaultIcon.jpg";
import { useSelector } from "react-redux";

const Navbar_Login = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const location = useLocation();
    const currentPath = location.pathname;
    const user = useSelector((state) => state.auth.user);
    const avatar = user?.avatar || null;

    //Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);
    
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-chocolate-light transition duration-300 shadow-md backdrop-blur-sm">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* Brand Name */}
                    <div className="text-2xl font-playfair font-bold text-chocolate-dark transition-colors duration-300 tracking-wide">
                        Healthy Bakes & Delights
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex md:gap-8">
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

                    {/* Cart & User Profile */}
                    <div className="flex items-center gap-6">
                        {/* Cart Icon */}
                        <a href="/cart" className="text-chocolate-dark   hover:text-chocolate-gold transition-colors duration-300">
                            <Cart />
                        </a>

                        {/* User Profile */}
                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                className="overflow-hidden rounded-full border border-white group-hover:border-chocolate-dark transition-colors duration-300 shadow-inner"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <span className="sr-only">Toggle user menu</span>
                                <img
                                    src={avatar || `${DefaultIcon}`}
                                    alt="User Profile"
                                    className="size-11 object-cover"
                                />
                            </button>

                            {/* User Dropdown Menu */}
                            {menuOpen && (
                                <div
                                    className="absolute right-0 z-10 mt-2 w-48 divide-y divide-chocolate-light rounded-md border border-chocolate-dark bg-white shadow-lg"
                                    role="menu"
                                >
                                    <div className="p-2">
                                        <a
                                            href="/profile"
                                            className="block rounded-lg px-4 py-2 text-chocolate-dark hover:bg-chocolate-light hover:text-chocolate-gold"
                                            role="menuitem"
                                        >
                                            View Profile
                                        </a>
                                    </div>
                                    <Logout />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            className="rounded-md p-2 text-chocolate-dark group-hover:text-chocolate-dark transition-colors duration-300"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
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
                </div>
            )}
        </header>


    );
}

export default Navbar_Login;