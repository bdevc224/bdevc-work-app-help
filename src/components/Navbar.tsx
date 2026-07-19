// FILE: src/components/Navbar.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Home from "../Pages/Home";
import OldResumeBuilder from "../Pages/OldResumeBuilder";
import ResumeBuilder from "../Pages/ResumeBuilder";
import History from "../Pages/History";
import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "../context/ThemeContext";
import DirectionAwareLink from "./DirectionAwareLink";
import AboutBdevC from "../Pages/AboutBdevC";

const navLinkClass =
  "font-body font-bold border-2 border-cyan-900 text-lg text-cyan-400 px-3 py-2 text-center shadow-lg shadow-cyan-500 hover:text-white transition-colors duration-300";

function NavbarContent() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="font-heading font-semibold bg-white dark:bg-gray-950 fixed w-full top-0 z-40 text-blue-500 py-4 px-6 md:px-10 flex justify-between items-center transition-colors duration-300">
      <img src="./logo.svg" alt="Logo" className="w-36" />
      <div className="flex items-center space-x-4">
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4">
          <DirectionAwareLink to="/" className={navLinkClass}>
            Home
          </DirectionAwareLink>

          <DirectionAwareLink to="/oldresumebuilder" className={navLinkClass}>
            (Old) Resume Builder
          </DirectionAwareLink>

          <DirectionAwareLink to="/resumebuilder" className={navLinkClass}>
            Resume Builder (Upgraded)
          </DirectionAwareLink>

          <DirectionAwareLink to="/history" className={navLinkClass}>
            History
          </DirectionAwareLink>

          <ThemeToggle />
        </div>

        {/* Mobile: theme toggle always visible, links behind hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="text-cyan-600 p-2 rounded-md border border-cyan-500"
            onClick={toggleMenu}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-950 flex flex-col items-center space-y-3 py-4 md:hidden transition-colors duration-300">
          <DirectionAwareLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            Home
          </DirectionAwareLink>

                    
          <DirectionAwareLink to="/oldresumebuilder" className={navLinkClass}>
            (Old) Resume Builder
          </DirectionAwareLink>

          <DirectionAwareLink to="/resumebuilder" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            Resume Builder (Upgraded)
          </DirectionAwareLink>

          <DirectionAwareLink to="/history" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            History
          </DirectionAwareLink>
        </div>
      )}
    </nav>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/oldresumebuilder" 
          element={
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <OldResumeBuilder />
            </motion.div>
          }
        />
        <Route
          path="/resumebuilder" 
          element={
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <ResumeBuilder />
            </motion.div>
          }
        />
        <Route
          path="/resumebuilder/:id"
          element={
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <ResumeBuilder />
            </motion.div>
          }
        />
        <Route
          path="/history"
          element={
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <History />
            </motion.div>
          }
        />
          <Route path="/aboutbdevc"
          element={
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <AboutBdevC />
            </motion.div>
          }
          />
      </Routes>
    </AnimatePresence>
  );
}

const Navbar: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
          <NavbarContent />
          <div className="pt-24 px-4 md:px-6">
            <AnimatedRoutes />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default Navbar;
