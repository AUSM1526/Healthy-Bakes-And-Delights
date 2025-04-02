import React, { useState, useEffect, useRef } from "react";
import Cart from "./Cart";
import Logout from "./Logout";

const Navbar_Login = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);

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
      <header className="bg-chocolate-light shadow-md">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">

                  {/* Brand Name */}
                  <div className="text-2xl font-playfair font-bold text-chocolate-dark tracking-wide">
                      Healthy Bakes & Delights
                  </div>

                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex md:gap-8">
                      {["Home", "Products", "About Us", "Contact Us"].map((item) => (
                          <a
                              key={item}
                              href="#"
                              className="text-chocolate-dark text-lg font-medium transition hover:text-chocolate-gold"
                          >
                              {item}
                          </a>
                      ))}
                  </nav>

                  {/* Cart & User Profile */}
                  <div className="flex items-center gap-6">
                      {/* Cart Icon */}
                      <a href="/cart" className="text-chocolate-dark hover:text-chocolate-gold">
                          <Cart />
                      </a>

                      {/* User Profile */}
                      <div className="relative" ref={menuRef}>
                          <button
                              type="button"
                              className="overflow-hidden rounded-full border border-chocolate-dark shadow-inner"
                              onClick={() => setMenuOpen(!menuOpen)}
                          >
                              <span className="sr-only">Toggle user menu</span>
                              <img
                                  src="https://res.cloudinary.com/dyc2wudtr/image/upload/v1743596377/ucgp1exuhcwl4vyqu8yk.jpg"
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
                                          className="block rounded-lg px-4 py-2 text-sm text-chocolate-dark hover:bg-chocolate-light hover:text-chocolate-gold"
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
                          className="rounded-md p-2 text-chocolate-dark hover:text-chocolate-gold"
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
                  {["Home", "Products", "About Us", "Contact Us"].map((item) => (
                      <a
                          key={item}
                          href="#"
                          className="block text-chocolate-dark text-lg font-medium transition hover:text-chocolate-gold"
                          onClick={() => setMobileMenuOpen(false)}
                      >
                          {item}
                      </a>
                  ))}
              </div>
          )}
      </header>
    );
}

export default Navbar_Login;