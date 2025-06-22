"use client";

import { FiSun, FiMoon, FiZap, FiGithub } from "react-icons/fi";
import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <FiZap className="text-white text-lg" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                JUICE
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                JSON UI Converter Engine
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* GitHub Link */}
            <Link
              href={"https://github.com/Echoinbyte/Juice"}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
            >
              <FiGithub
                className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors"
                size={18}
              />
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group overflow-hidden"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <div className="relative z-10">
                {theme === "light" ? (
                  <FiMoon
                    className="text-gray-600 group-hover:text-gray-900 transition-colors"
                    size={18}
                  />
                ) : (
                  <FiSun
                    className="text-yellow-500 group-hover:text-yellow-400 transition-colors"
                    size={18}
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
