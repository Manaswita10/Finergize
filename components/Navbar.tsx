"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    path: "/",
    label: "Home",
  },
  {
    path: "/banking",
    label: "Banking",
  },
  {
    path: "/savings",
    label: "Savings",
  },
  {
    path: "/loans",
    label: "Loans",
  },
  {
    path: "/security",
    label: "Security",
  },
  {
    path: "/analytics",
    label: "Analytics",
  },
  {
    path: "/education",
    label: "Education",
  },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Finergize
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="px-3 py-2 text-gray-300 hover:text-white rounded-md text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="border-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-400" />
              ) : (
                <Menu className="h-6 w-6 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="px-3 py-2 text-gray-300 hover:text-white rounded-md text-sm transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col space-y-2">
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}