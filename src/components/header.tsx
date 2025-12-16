"use client";

import { ToolCase } from "lucide-react";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";
import { Link } from "react-router-dom";


const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-[#0f0f0f]/50 ">
      <div className="max-w-6xl mx-auto px-6 py-4 flex border-b border-gray-200 dark:border-gray-800 justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <ToolCase className="text-gray-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Image Toolkit</h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 text-sm text-gray-700 dark:text-gray-300">
          <Link
            to="/"
            className="hover:text-orange-500 dark:hover:text-orange-400 hover:underline hover:underline-offset-4 decoration-2 transition-all"
          >
            Home
          </Link>
          <Link
            to="/exploreTools"
            className="hover:text-orange-500 dark:hover:text-orange-400 hover:underline hover:underline-offset-4 decoration-2 transition-all"
          >
            Know Tools
          </Link>
          <Link
            to="/convert"
            className=" font-bold hover:text-orange-500 dark:hover:text-orange-400 hover:underline hover:underline-offset-4 decoration-2 transition-all"
          >
            Convert
          </Link>
          <Link
            to="/Compress"
            className=" font-bold hover:text-orange-500 dark:hover:text-orange-400 hover:underline hover:underline-offset-4 decoration-2 transition-all"
          >
            Compress
          </Link>
          <Link
            to="/tools"
            className="font-bold hover:text-orange-500 dark:hover:text-orange-400 hover:underline hover:underline-offset-4 decoration-2 transition-all"
          >
            More Tools
          </Link>
        </nav>
        <div className=" flex flow-row gap-6">
          <Link
            to="/pricing"
            className="hover:text-orange-500 dark:hover:text-orange-400 hover:underline hover:underline-offset-4 decoration-2 transition-all"
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className="hover:text-orange-500 dark:hover:text-orange-400 hover:underline hover:underline-offset-4 decoration-2 transition-all"
          >
            Contact
          </Link>

          <AnimatedThemeToggler className="cursor-pointer" />

        </div>
      </div>
    </header>
  );
};

export default Header;
