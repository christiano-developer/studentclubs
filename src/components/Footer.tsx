"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SiInstagram, SiLinkedin } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-[#0a192f]/50 text-blue-100 lg:py-8 lg:px-4 px-2 py-6  backdrop-blur-xs   w-full">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Logo Section */}
        <div className="flex mb-6 md:mb-0 justify-center items-center gap-x-5">
          <Link href="/">
            <Image
              src="/logos/main_logo.png"
              alt="Organization Logo"
              width={350}
              height={50}
              className="object-contain"
            />
          </Link>
          <Link href="/">
            <Image
              src="/logos/secondary_logo.png"
              alt="Secondary Logo"
              width={80}
              height={50}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Important Links */}
        <nav className="mb-6 md:mb-0">
          <ul className="flex flex-wrap gap-6 justify-center">
            <li>
              <Link
                href="#about"
                className="hover:text-blue-400 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-blue-400 transition-colors">
                Events
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-blue-400 transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-blue-400 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Social Icons */}
        <div className="flex gap-6">
          <Link
            href="https://www.instagram.com/yourorg/"
            aria-label="Instagram"
            target="_blank"
          >
            <SiInstagram
              className="hover:text-blue-400 transition-colors"
              size={24}
            />
          </Link>
          <Link
            href="https://www.linkedin.com/company/yourorg/"
            aria-label="LinkedIn"
            target="_blank"
          >
            <SiLinkedin
              className="hover:text-blue-400 transition-colors"
              size={24}
            />
          </Link>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="mt-8 text-center text-sm text-blue-950">
        &copy; {new Date().getFullYear()} Your Organization Name. All rights
        reserved.
      </div>
    </footer>
  );
}
