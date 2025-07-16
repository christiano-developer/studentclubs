"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoMenu,
  IoClose,
  IoHomeOutline,
  IoInformationCircleOutline,
  IoCalendarOutline,
  IoMailOutline,
  IoPersonOutline,
  IoShieldOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoDocumentTextOutline,
  IoGlobeOutline,
} from "react-icons/io5";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { organizationConfig } from "@/config/organization";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: <IoHomeOutline /> },
  { href: "/#about", label: "About", icon: <IoInformationCircleOutline /> },
  { href: "/#team", label: "Team", icon: <IoCalendarOutline /> },
  { href: "/contact", label: "Contact", icon: <IoMailOutline /> },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { user, loading, signOut } = useAuth();
  const isStaticMode = organizationConfig.features.enableStaticMode;

  const [showBackground, setShowBackground] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setSidebarOpen(false);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle route changes and reset states appropriately
  useEffect(() => {
    if (isHome) {
      // On home page: start with no background, show content based on scroll
      setShowBackground(false);
      // On mobile, always show content regardless of scroll
      setShowContent(isMobile ? true : window.scrollY > 50);
    } else {
      // On other pages: always show background and content
      setShowBackground(true);
      setShowContent(true);
    }
  }, [isHome, isMobile]);

  // Only attach scroll listeners on the home page
  useEffect(() => {
    if (!isHome) return;

    const handleContent = () => {
      // On mobile, always show content regardless of scroll
      if (isMobile) {
        setShowContent(true);
      } else {
        setShowContent(window.scrollY > 50);
      }
    };
    const handleBg = () => setShowBackground(window.scrollY > 700);

    // Set initial states based on current scroll position
    handleContent();
    handleBg();

    window.addEventListener("scroll", handleContent);
    window.addEventListener("scroll", handleBg);

    return () => {
      window.removeEventListener("scroll", handleContent);
      window.removeEventListener("scroll", handleBg);
    };
  }, [isHome, isMobile]);

  return (
    <>
      <nav
        className={[
          "fixed  left-0 w-full z-50 transition-all duration-500 flex items-center justify-between px-6 py-2  font-mono font-normal",
          showBackground
            ? " shadow-md text-black"
            : "bg-transparent text-white",
          showContent ? "top-0" : "-top-20 bg-black",
          showContent ? "bg-black/20 backdrop-blur-lg" : "",
        ].join(" ")}
      >
        <Link href="/" className="">
          <Image
            src="/logos/parent_org_logo.png"
            width={100}
            height={100}
            alt="logo"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm">
          {NAV_LINKS.map(({ href, label }, idx) => (
            <Link
              key={idx}
              href={href}
              className="hover:text-blue-400 transition-colors"
            >
              {label}
            </Link>
          ))}

          {!loading && !isStaticMode && (
            <>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                  >
                    <IoPersonOutline />
                    <span>Dashboard</span>
                  </Link>

                  {user.isRegistered &&
                    user.registrationData?.validationStatus === "approved" && (
                      <Link
                        href="/forms"
                        className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                      >
                        <IoDocumentTextOutline />
                        <span>Forms</span>
                      </Link>
                    )}

                  {user.isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                    >
                      <IoShieldOutline />
                      <span>Admin</span>
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                  >
                    <IoLogOutOutline />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <IoLogInOutline />
                  <span>Sign In</span>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <IoMenu
              size={30}
              color={showBackground ? "black" : "white"}
              className="transition-all duration-1000"
            />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Drawer */}
      <aside
        className={[
          "fixed top-0 right-0 h-full w-64 z-50 bg-black/70 backdrop-blur-md transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <IoClose size={24} className="text-white" />
          </button>
        </div>
        <ul className="flex flex-col px-6 space-y-4">
          {NAV_LINKS.map(({ href, label, icon }, idx) => (
            <li key={idx}>
              <Link
                href={href}
                className="flex items-center space-x-3 text-white text-lg hover:text-blue-400 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          ))}

          {!loading && !isStaticMode && (
            <>
              {user ? (
                <>
                  <li>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 text-white text-lg hover:text-blue-400 transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <IoPersonOutline />
                      <span>Dashboard</span>
                    </Link>
                  </li>

                  {user.isRegistered &&
                    user.registrationData?.validationStatus === "approved" && (
                      <li>
                        <Link
                          href="/forms"
                          className="flex items-center space-x-3 text-white text-lg hover:text-blue-400 transition-colors"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <IoDocumentTextOutline />
                          <span>Forms</span>
                        </Link>
                      </li>
                    )}

                  {user.isAdmin && (
                    <li>
                      <Link
                        href="/admin"
                        className="flex items-center space-x-3 text-white text-lg hover:text-blue-400 transition-colors"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <IoShieldOutline />
                        <span>Admin</span>
                      </Link>
                    </li>
                  )}

                  <li>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 text-white text-lg hover:text-blue-400 transition-colors w-full text-left"
                    >
                      <IoLogOutOutline />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/auth"
                    className="flex items-center space-x-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <IoLogInOutline />
                    <span>Sign In</span>
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </aside>
    </>
  );
};

export default Navbar;
