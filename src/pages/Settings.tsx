
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Options du jeu</h2>
        <p>Page de paramètres en cours de développement.</p>
      </div>
    </div>
  );
};

export default Settings;
