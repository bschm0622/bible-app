"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false); // Scroll state
  const [isMenuOpen, setIsMenuOpen] = useState(false);  // Mobile menu state

  // Scroll effect to toggle navbar styling based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); // Change navbar style if scrolled past 10px
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle mobile menu on hamburger click
  };

  return (
    <div className={`navbar bg-base-100 ${isScrolled ? 'shadow-md' : ''} transition-all`}>
      <div className="navbar-start">
        <div className="dropdown">
          {/* Hamburger Icon */}
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost lg:hidden" 
            onClick={toggleMenu}  // Toggle menu on click
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" 
              />
            </svg>
          </div>
          {/* Mobile Menu */}
          <ul
            tabIndex={0}
            className={`menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow ${isMenuOpen ? 'block' : 'hidden'}`}  // Toggle visibility
          >
            <li><Link href="/">Home</Link></li>
            <li><Link href="/create_plan">Create Plan</Link></li>
            <li><Link href="/view_plans">View Plans</Link></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">Bible Reading App</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/create_plan">Create Plan</Link></li>
          <li><Link href="/view_plans">View Plans</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn">Button</a>
      </div>
    </div>
  );
};

export default Navbar;
=======
  return (
    <nav
      className={`navbar bg-base-100 sticky top-0 w-full transition-all duration-300 ${
        isScrolled
          ? "shadow-md backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Bible Reading App
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/create_plan">Create Plan</Link>
          </li>
          <li>
            <Link href="/view_plans">View Plans</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <button className="btn btn-primary">Log In</button>
      </div>
    </nav>
  );
}
export default Navbar;
