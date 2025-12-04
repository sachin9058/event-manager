"use client";

import React, { useState } from 'react';
import { useClerk, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

const primaryColor = '#70001A';
const secondaryColor = '#C89446';
const backgroundColor = '#FAF9F8';
const serifBold = 'font-serif font-extrabold';

const navLinks = [
  { name: 'Past Fests', href: '#' },
  { name: 'Club Packages', href: '#' },
  { name: 'Sponsorship', href: '#' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const handleSignIn = () => {
    openSignIn({ 
      redirectUrl: "/dashboard", 
      signUpUrl: "/sign-up" 
    });
  };

  return (
    <>
      {/* Header & Navigation (Responsive with Menu Toggle) */}
      <nav className="py-4 md:py-6 border-b border-gray-200 sticky top-0 z-50 shadow-md" style={{ backgroundColor: backgroundColor }}>
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className={`text-3xl md:text-4xl ${serifBold} tracking-wider`} style={{ color: primaryColor }}>
            FEST ARCHITECTS
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 lg:space-x-12 text-sm tracking-widest uppercase items-center">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="font-light text-gray-600 hover:text-gray-900 transition-colors">
                  {link.name}
                </a>
              </li>
            ))}
            {isSignedIn && (
              <li>
                <Link href="/dashboard" className="font-light text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <button 
                  onClick={handleSignIn} 
                  className="px-5 py-2 rounded font-medium tracking-widest transition-all hover:opacity-80" 
                  style={{ backgroundColor: secondaryColor, color: 'white' }}
                >
                  Login
                </button>
              )}
            </li>
          </ul>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden p-2 text-xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Full-Screen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: primaryColor }}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="p-8 pt-24 text-white flex flex-col space-y-6 h-full">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xl uppercase tracking-wide font-light hover:text-gray-300 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          {isSignedIn && (
            <Link
              href="/dashboard"
              className="text-xl uppercase tracking-wide font-light hover:text-gray-300 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {isSignedIn ? (
            <div className="mt-6 flex justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleSignIn();
              }}
              className="text-base uppercase tracking-wide font-bold mt-6 px-6 py-4 text-center rounded-lg transition-all hover:opacity-90"
              style={{ backgroundColor: secondaryColor, color: 'white' }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </>
  );
}
