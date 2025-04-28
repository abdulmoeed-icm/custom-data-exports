
import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                Data Forge Exports
              </Link>
            </div>
            <nav className="ml-6 flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/export"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              >
                Export Data
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
