
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Settings } from 'lucide-react';

// Create a version of Header that doesn't depend on Router
const HeaderContent = ({ gameState }: { gameState?: any }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <a href="/" className="flex items-center space-x-2 text-xl font-semibold text-gray-100">
        <img src="/img/perso_loup.svg" alt="Loup Garou" className="h-6 w-6 text-werewolf-accent" />
        <span>Loup Garou - Maitre du jeu</span>
      </a>

      <div className="flex items-center gap-4">
        <a href="/rules" className="flex items-center gap-1 text-gray-300 hover:text-werewolf-accent">
          <Book className="h-5 w-5" />
          <span>Règles</span>
        </a>
        <a href="/config" className="flex items-center gap-1 text-gray-300 hover:text-werewolf-accent">
          <Settings className="h-5 w-5" />
          <span>Configuration</span>
        </a>
      </div>
    </div>
  </header>
);

const Header = () => {
  return <HeaderContent />;
};

export default Header;

