import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Settings, Palette, HelpCircle } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Loups-Garous de Thiercelieux
      </h1>
      <div className="flex flex-col md:flex-wrap md:flex-row items-center justify-center gap-4">
        <Link
          to="/game"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors mb-2 w-full md:w-64 text-center flex items-center justify-center gap-2"
        >
          <Play className="h-5 w-5" />
          Jouer
        </Link>
        <Link
          to="/setup"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors mb-2 w-full md:w-64 text-center flex items-center justify-center gap-2"
        >
          <Settings className="h-5 w-5" />
          Configuration
        </Link>
        <Link
          to="/themes"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors mb-2 w-full md:w-64 text-center flex items-center justify-center gap-2"
        >
          <Palette className="h-5 w-5" />
          Thèmes
        </Link>
        <Link to="/help" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors mb-2 w-full md:w-64 text-center flex items-center justify-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Aide
        </Link>
      </div>
    </div>
  );
};

export default Home;
