import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar bg-base-100 shadow-md">
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
};

export default Navbar;
