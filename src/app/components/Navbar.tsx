"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false); // Scroll state

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

  return (
    <div className={`navbar bg-base-100 ${isScrolled ? 'shadow-md' : ''} transition-all`}>
      <div className="navbar-start">
        {/* Drawer Toggle Button */}
        <label htmlFor="drawer-toggle" className="btn btn-ghost lg:hidden">
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
        </label>

        <Link href="/" className="btn btn-ghost text-xl">Bible Reading App</Link>
      </div>

      {/* Drawer for Mobile */}
      <div className="drawer drawer-mobile">
        {/* Drawer Content */}
        <div className="drawer-content">
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/create_plan">Create Plan</Link></li>
              <li><Link href="/view_plans">View Plans</Link></li>
            </ul>
          </div>
        </div>

        {/* Drawer Side (Mobile Menu) */}
        <div className="drawer-side">
          <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
          <ul className="menu p-4 w-64 bg-base-100 text-base-content">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/create_plan">Create Plan</Link></li>
            <li><Link href="/view_plans">View Plans</Link></li>
          </ul>
        </div>
      </div>

      <div className="navbar-end">
        <a className="btn">Button</a>
      </div>
    </div>
  );
};

export default Navbar;
