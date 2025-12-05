"use client";

import React, { useState, useEffect } from 'react';
import { useClerk, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

const primaryColor = '#70001A';
const secondaryColor = '#C89446';
const backgroundColor = '#FAF9F8';
const serifBold = 'font-serif font-extrabold';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'All Clubs', href: '/clubs' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/admin/check');
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    if (isSignedIn) {
      checkAdmin();
    }
  }, [isSignedIn]);

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
                <Link href="/dashboard" className="px-4 py-2 rounded font-medium tracking-widest transition-all hover:opacity-80 text-white" style={{ backgroundColor: primaryColor }}>
                  My Dashboard
                </Link>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link href="/admin" className="px-4 py-2 rounded font-medium tracking-widest transition-all hover:opacity-80 text-white" style={{ backgroundColor: secondaryColor }}>
                  Admin Panel
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

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Slide-in Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-80 shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ backgroundColor: backgroundColor }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <span className="text-2xl font-serif font-bold" style={{ color: primaryColor }}>
              MENU
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col p-6 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            
            {isSignedIn && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  href="/dashboard"
                  className="px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  style={{ color: primaryColor }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Dashboard
                </Link>
              </>
            )}
            
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                style={{ color: secondaryColor }}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
            {isSignedIn ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Account</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleSignIn();
                }}
                className="w-full px-6 py-3 text-center rounded-lg font-medium tracking-wide transition-all hover:opacity-90 shadow-md text-white"
                style={{ backgroundColor: primaryColor }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
