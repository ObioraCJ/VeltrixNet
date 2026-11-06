import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const linkClass = "text-sm font-medium text-slate-600 hover:text-brand";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Logo />

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="/" className={linkClass}>Home</a>
          <a href="/#packages" className={linkClass}>Packages</a>
          <a href="/#contact" className={linkClass}>Contact</a>

          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                My Account
              </Link>
              <button onClick={handleLogout} className={linkClass}>
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="text-2xl md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="flex flex-col gap-4 border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <a href="/" className={linkClass}>Home</a>
          <a href="/#packages" className={linkClass}>Packages</a>
          <a href="/#contact" className={linkClass}>Contact</a>
          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                My Account
              </Link>
              <button onClick={handleLogout} className={`${linkClass} text-left`}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className={linkClass}>
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;