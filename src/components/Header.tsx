
import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Book } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
          <Moon className="h-6 w-6 text-werewolf-accent" />
          <span>Loup Garou</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/rules" className="flex items-center gap-1 text-gray-600 hover:text-werewolf-accent">
            <Book className="h-5 w-5" />
            <span>Règles</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
