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
