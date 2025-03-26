
import React from 'react';
import { Moon, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { GameState } from '@/types';

const Rules = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameState = location.state as GameState;
  
  const handleBackToGame = () => {
    if (gameState) {
      navigate('/game', { state: gameState });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto pt-24 pb-12 px-4">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={handleBackToGame}
          >
            <ArrowLeft className="h-4 w-4" />
            {gameState ? "Retour au jeu" : "Retour"}
          </Button>
        </div>
        
        <section className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-werewolf-accent/10 rounded-full mb-4 animate-fade-in">
            <Moon className="h-8 w-8 text-werewolf-accent animate-pulse-subtle" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl animate-fade-up">
            Règles du Jeu
          </h1>
          
          <p className="mx-auto max-w-2xl text-gray-500 text-lg animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Apprenez à jouer au Loup Garou de Thiercelieux
          </p>
        </section>

        <div className="glass-card p-8 rounded-xl mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-semibold mb-4">Principe du jeu</h2>
          <p className="mb-4">
            Le Loup-Garou de Thiercelieux est un jeu de société d'ambiance qui se joue à partir de 8 joueurs. Chaque joueur incarne un personnage du village de Thiercelieux qui est envahi par les loups-garous.
          </p>
          <p className="mb-4">
            Chaque nuit, les loups-garous dévorent un villageois. Chaque jour, les villageois survivants se réunissent et tentent de démasquer un loup-garou pour l'éliminer.
          </p>
          <p>
            Le but des loups-garous est d'éliminer tous les villageois tandis que le but des villageois est d'éliminer tous les loups-garous.
          </p>
        </div>

        <div className="glass-card p-8 rounded-xl mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-semibold mb-4">Déroulement d'une partie</h2>
          <h3 className="text-xl font-medium mb-2">1. Distribution des rôles</h3>
          <p className="mb-4">
            Chaque joueur reçoit une carte personnage qu'il garde secrète.
          </p>
          
          <h3 className="text-xl font-medium mb-2">2. La nuit</h3>
          <p className="mb-4">
            Tous les joueurs ferment les yeux. Le maître du jeu appelle les personnages qui ont un rôle spécial pendant la nuit.
          </p>
          
          <h3 className="text-xl font-medium mb-2">3. Le jour</h3>
          <p className="mb-4">
            Tous les joueurs ouvrent les yeux. Le maître du jeu annonce qui a été dévoré pendant la nuit. Ce joueur révèle son rôle et est éliminé.
          </p>
          <p className="mb-4">
            Les joueurs débattent ensuite pour tenter d'identifier un loup-garou parmi eux. Un vote a lieu et le joueur qui reçoit le plus de voix est éliminé. Il révèle son rôle.
          </p>
          
          <h3 className="text-xl font-medium mb-2">4. Alternance</h3>
          <p>
            Le jeu continue avec l'alternance jour/nuit jusqu'à ce qu'un camp l'emporte.
          </p>
        </div>

        <div className="glass-card p-8 rounded-xl animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-semibold mb-4">Rôles spéciaux</h2>
          <p className="mb-4">
            De nombreux personnages ont des pouvoirs spéciaux, parmi eux :
          </p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>La Voyante</strong> : Chaque nuit, elle peut voir le rôle d'un joueur.</li>
            <li><strong>La Sorcière</strong> : Dispose d'une potion de vie et une potion de mort.</li>
            <li><strong>Le Chasseur</strong> : Quand il meurt, il peut emmener quelqu'un avec lui.</li>
            <li><strong>Cupidon</strong> : Désigne deux amoureux qui vivront ou mourront ensemble.</li>
            <li><strong>Le Garde du Corps</strong> : Protège un joueur chaque nuit contre les loups-garous.</li>
            <li><strong>La Petite Fille</strong> : Peut espionner les loups-garous pendant leur tour.</li>
          </ul>
        </div>
      </main>
      
      <footer className="w-full border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        <p>Loup Garou de Thiercelieux © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Rules;
