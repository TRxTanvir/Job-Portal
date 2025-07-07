'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { CgProfile } from 'react-icons/cg';
import { BsBriefcaseFill, BsSun, BsMoonStars } from 'react-icons/bs';

export default function Navbar() {
  const { user, logout, theme, toggleTheme } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <BsBriefcaseFill />
            JobPortal
          </Link>
 
          <div className="flex items-center space-x-6">
            <Link href="/jobs" className="text-black dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 font-medium">
              Jobs
            </Link>

             <Link href="/contact" className="text-black dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 font-medium">
              Contact Us
            </Link>
             
            <div className='w-[1px] h-6 bg-gray-300 dark:bg-gray-700'></div> {/* Visual separator */}

            {/* Theme Toggle Button */}
            <button onClick={toggleTheme} className="text-xl text-black dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500">
              {theme === 'light' ? <BsMoonStars /> : <BsSun />}
            </button>
            
            {user ? (
              // Logged-in view
              <div className="flex items-center space-x-6">
                <span className="text-black dark:text-gray-300 hidden sm:block">Welcome, {user.email}</span>
                <Link href="/profile" title="Go to your profile">
                  <CgProfile className="w-7 h-7 text-black dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition-colors" />
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Logged-out view
              <div className="flex items-center space-x-6">
                 <Link href="/login" className="text-black dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 font-medium">
                    Login
                </Link>
                <Link href="/register" className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}