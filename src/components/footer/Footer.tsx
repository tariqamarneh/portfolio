"use client";

import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useTheme } from '@/components/general/GradientBackground'

const Footer: React.FC = () => {
  const { isDark } = useTheme()

  return (
    <footer className={`py-6 mt-8 ${isDark?'text-white':'text-black'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Tariq Amarneh. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="https://github.com/tariqamarneh" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub className="text-2xl hover:text-gray-400 transition-colors" />
            </a>
            <a href="https://linkedin.com/in/tariq-naser" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className="text-2xl hover:text-gray-400 transition-colors" />
            </a>
          </div>
          <nav className="flex space-x-4 text-sm">
            <a href="#home" className="hover:text-gray-400 transition-colors">About</a>
            <a href="#journey" className="hover:text-gray-400 transition-colors">Journey</a>
            <a href="#projects" className="hover:text-gray-400 transition-colors">Projects</a>
            <a href="#skills" className="hover:text-gray-400 transition-colors">Skills</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;