
import React from 'react';
import { Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 px-6 py-4 border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Moon className="h-6 w-6 text-werewolf-accent" />
          <span className="font-semibold text-xl tracking-tight">Loup Garou</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-werewolf-accent transition-colors">
            Nouvelle Partie
          </Link>
          <Link to="/rules" className="text-sm font-medium hover:text-werewolf-accent transition-colors">
            Règles
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
