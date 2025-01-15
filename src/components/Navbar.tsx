"use client";

import Link from "next/link";
import LogoutButton from "@components/LogoutButton";

const Navbar = () => {
  return (
    <div className="drawer">
      {/* Hidden Input for Drawer Toggle */}
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content relative z-0">
        {/* Navbar */}
        <div className="navbar bg-base-100 border-b w-full">
          {/* Mobile Drawer Toggle */}
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>

          {/* Navbar Title */}
          <div className="mx-2 flex-1 px-2">
            <Link href="/" className="text-xl font-bold text-primary">
              Bible Reading App
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden flex-none lg:flex items-center">
            <ul className="menu menu-horizontal space-x-6">
              <li><Link href="/" className="text-base text-gray-700 hover:text-primary">Home</Link></li>
              <li><Link href="/plans/create" className="text-base text-gray-700 hover:text-primary">Create Plan</Link></li>
              <li><Link href="/plans/view" className="text-base text-gray-700 hover:text-primary">View Plans</Link></li>
            </ul>

            {/* Logout Button */}
            <div className="ml-6">
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4">
        </main>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div className="drawer-side z-10">
        {/* Overlay */}
        <label
          htmlFor="my-drawer-3"
          className="drawer-overlay"
        ></label>
        {/* Sidebar Links */}
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          <li><Link href="/" className="text-lg text-gray-700 hover:text-primary">Home</Link></li>
          <li><Link href="/plans/create" className="text-lg text-gray-700 hover:text-primary">Create Plan</Link></li>
          <li><Link href="/plans/view" className="text-lg text-gray-700 hover:text-primary">View Plans</Link></li>
          <li><LogoutButton /></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
