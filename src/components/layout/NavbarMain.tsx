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
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function NavbarMain() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full">
      <Navbar className="">
        {/* Desktop Navigation */}
        <NavBody className="hidden md:flex">
          <NavbarLogo />
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-white font-medium">Welcome, {user?.name}</span>
                <Link to="/profile">
                  <NavbarButton variant="secondary">Profile</NavbarButton>
                </Link>
                <Link to="/registration">
                  <NavbarButton variant="secondary">Registration</NavbarButton>
                </Link>
                <NavbarButton onClick={handleLogout} variant="secondary">Logout</NavbarButton>
              </>
            ) : (
              <>
                <NavbarButton variant="secondary" href="/login">Login</NavbarButton>
                <NavbarButton variant="primary" href="/signup">Signup</NavbarButton>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav className="flex md:hidden">
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
        </MobileNav>
      </Navbar>
    </div>
  );
}
