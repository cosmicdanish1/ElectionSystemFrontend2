"use client";
import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../../components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function NavbarMain({ onLoginClick, onSignupClick, isHomePage }: { onLoginClick?: () => void, onSignupClick?: () => void, isHomePage?: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full">
      <Navbar className="">
        {/* Desktop Navigation */}
        <NavBody className="flex">
          <NavbarLogo />
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Profile Avatar Dropdown */}
                <ProfileDropdown user={user} />
                <button
                  className="px-4 py-2 rounded-md bg-white text-red-600 font-bold border border-gray-200 shadow hover:bg-red-600 hover:text-white transition"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {isHomePage ? (
                  <>
                    <NavbarButton
                      className="drop-shadow text-black"
                      onClick={() => navigate('/login', { state: { background: location } })}
                    >
                      Login
                    </NavbarButton>
                    <NavbarButton
                      variant="primary"
                      onClick={() => navigate('/signup', { state: { background: location } })}
                    >
                      Signup
                    </NavbarButton>
                  </>
                ) : (
                  <>
                    <NavbarButton
                      className="drop-shadow text-black"
                      href="/login"
                    >
                      Login
                    </NavbarButton>
                    <NavbarButton
                      variant="primary"
                      href="/signup"
                    >
                      Signup
                    </NavbarButton>
                  </>
                )}
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        {/* <MobileNav className="flex md:hidden">
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex w-full flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-white font-medium text-center py-2">Welcome, {user?.name}</span>
                  <Link to="/profile" className="w-full">
                    <NavbarButton
                      onClick={() => setIsMobileMenuOpen(false)}
                      variant="primary"
                      className="w-full"
                    >
                      Profile
                    </NavbarButton>
                  </Link>
                  <Link to="/registration" className="w-full">
                    <NavbarButton
                      onClick={() => setIsMobileMenuOpen(false)}
                      variant="primary"
                      className="w-full"
                    >
                      Registration
                    </NavbarButton>
                  </Link>
                  <NavbarButton
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="primary"
                    className="w-full"
                  >
                    Logout
                  </NavbarButton>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full">
                    <NavbarButton
                      onClick={() => setIsMobileMenuOpen(false)}
                      variant="primary"
                      className="w-full"
                    >
                      Login
                    </NavbarButton>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <NavbarButton
                      onClick={() => setIsMobileMenuOpen(false)}
                      variant="primary"
                      className="w-full"
                    >
                      Signup
                    </NavbarButton>
                  </Link>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav> */}
      </Navbar>
    </div>
  );
}

function ProfileDropdown({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg focus:outline-none border-2 border-white shadow hover:ring-2 hover:ring-blue-300 transition"
        onClick={() => setOpen((v) => !v)}
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
          <button
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
            onClick={() => { setOpen(false); navigate('/profile'); }}
          >
            Profile
          </button>
          {user?.role === 'voter' && (
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
              onClick={() => { setOpen(false); navigate('/registration'); }}
            >
              Registration
            </button>
          )}
        </div>
      )}
    </div>
  );
}
