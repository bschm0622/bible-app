"use client";

import Link from "next/link";

const Navbar = () => {
  const closeDrawer = () => {
    // This will uncheck the checkbox to close the drawer
    const drawerToggle = document.getElementById('my-drawer-3') as HTMLInputElement;
    if (drawerToggle) {
      drawerToggle.checked = false;
    }
  };

  return (
    <div className="drawer">
      {/* Hidden Input for Drawer Toggle */}
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content relative z-0">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full">
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

          {/* Navbar Logo and Title */}
          <div className="mx-2 flex items-center">
            <img
              src="https://szpufgqjhqnfsjdkcrba.supabase.co/storage/v1/object/public/images/bible-reading-logo.png"
              alt="Bible Reading App Logo"
              className="h-10 mr-2"
            />
            <Link href="/" className="text-xl font-bold">
              Verdant Verse
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/create_plan">Create Plan</Link></li>
              <li><Link href="/view_plans">View Plans</Link></li>
            </ul>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4"></main>
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
          <li><Link href="/" onClick={closeDrawer}>Home</Link></li>
          <li><Link href="/create_plan" onClick={closeDrawer}>Create Plan</Link></li>
          <li><Link href="/view_plans" onClick={closeDrawer}>View Plans</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
