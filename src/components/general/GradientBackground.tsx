"use client"
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion'

// Define types
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

interface ThemeColors {
  startColor: [number, number, number];
  endColor: [number, number, number];
  textColor: string;
  starColor: string;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
}

// Theme context with proper typing
const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => { }
});

// Updated Theme colors with morning sky effect for light theme
const THEMES: Record<'dark' | 'light', ThemeColors> = {
  dark: {
    startColor: [0, 31, 63],
    endColor: [0, 0, 0],
    textColor: 'text-white',
    starColor: 'white'
  },
  light: {
    startColor: [255, 255, 255],
    endColor: [255, 223, 166],
    textColor: 'text-gray-900',
    starColor: 'black'
  }
};

// Modified GradientBackground to use theme context directly
const GradientBackground: React.FC = () => {
  const { isDark } = useContext(ThemeContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const stars: Star[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      vx: Math.random() * 0.5 - 0.25,
      vy: Math.random() * 0.5 - 0.25
    }));

    const drawGradient = (scrollPosition: number) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.min(scrollPosition / maxScroll, 1);

      const theme = isDark ? THEMES.dark : THEMES.light;
      const currentColor = theme.startColor.map((start, i) =>
        Math.round(start + (theme.endColor[i] - start) * scrollPercentage)
      );

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, `rgb(${currentColor.join(',')})`);
      gradient.addColorStop(1, `rgb(${theme.endColor.join(',')})`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawStars = () => {
      // Only draw stars in dark mode
      // if (!isDark) return;

      ctx.save();
      ctx.fillStyle = isDark ? THEMES.dark.starColor : THEMES.light.starColor;
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    };

    const moveStars = () => {
      // if (!isDark) return;

      stars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0 || star.x > canvas.width) star.vx = -star.vx;
        if (star.y < 0 || star.y > canvas.height) star.vy = -star.vy;
      });
    };

    const animate = () => {
      drawGradient(window.scrollY);
      drawStars();
      moveStars();
      requestAnimationFrame(animate);
    };

    animate();

    const handleScroll = () => {
      drawGradient(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
};

// Theme Provider Component with proper typing
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`min-h-screen ${isDark ? THEMES.dark.textColor : THEMES.light.textColor}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};


// Theme Toggle Button
export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="fixed bottom-4 left-4 z-[100] pointer-events-auto">
      <motion.button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 backdrop-blur-sm shadow-lg z-50"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-gray-300" />
        )}
      </motion.button>
    </div>
  );
};

// Custom hook to use theme with proper typing
export const useTheme = (): ThemeContextType => useContext(ThemeContext);

export default GradientBackground;