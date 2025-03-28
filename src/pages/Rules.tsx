
import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { GameState } from '@/types';

const Rules = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameState = location.state as GameState;
  const [rulesContent, setRulesContent] = useState<string>('');
  
  useEffect(() => {
    // Fetch the rules HTML content when the component mounts
    fetch('/regles.html')
      .then(response => response.text())
      .then(html => {
        setRulesContent(html);
      })
      .catch(error => {
        console.error('Error fetching rules content:', error);
      });
  }, []);
  
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
        
        {/* Render the fetched HTML content */}
        <div 
          className="rules-content glass-card p-8 rounded-xl animate-fade-up"
          dangerouslySetInnerHTML={{ __html: rulesContent }}
        />
      </main>
      
      <footer className="w-full border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        <p>Loup Garou de Thiercelieux © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Rules;
