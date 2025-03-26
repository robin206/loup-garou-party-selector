
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CharacterType, GameState } from '../types';
import { getCharactersByIds } from '../data/characters';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { shuffleCharacters } from '../utils/gameUtils';

const Distribution: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [shuffledCharacters, setShuffledCharacters] = useState<CharacterType[]>([]);
  const [showCharacter, setShowCharacter] = useState<boolean>(false);

  useEffect(() => {
    const savedState = localStorage.getItem('werewolf-game');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setGameState(parsedState);
      
      // Get the character objects from their IDs and shuffle them
      const characterObjects = getCharactersByIds(parsedState.selectedCharacters);
      setShuffledCharacters(shuffleCharacters(characterObjects));
    } else {
      navigate('/setup');
    }
  }, [navigate]);

  const handleNext = () => {
    if (showCharacter) {
      setShowCharacter(false);
      if (currentStep < shuffledCharacters.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Game setup is complete, move to first day
        const updatedGameState: GameState = {
          ...gameState!,
          currentPhase: 'firstDay',
          aliveCharacters: [...gameState!.selectedCharacters],
          dayCount: 1
        };
        localStorage.setItem('werewolf-game', JSON.stringify(updatedGameState));
        navigate('/game');
      }
    } else {
      setShowCharacter(true);
    }
  };

  const handleShuffle = () => {
    if (gameState) {
      const characterObjects = getCharactersByIds(gameState.selectedCharacters);
      setShuffledCharacters(shuffleCharacters(characterObjects));
      setCurrentStep(-1);
      setShowCharacter(false);
    }
  };

  const startDistribution = () => {
    setCurrentStep(0);
  };

  const currentCharacter = currentStep >= 0 && currentStep < shuffledCharacters.length 
    ? shuffledCharacters[currentStep] 
    : null;

  if (!gameState) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        {currentStep === -1 ? (
          <CardContent className="text-center space-y-6 py-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Distribution des cartes</CardTitle>
            </CardHeader>
            <p className="text-gray-300">
              Chaque joueur va recevoir une carte de personnage.
              <br />Passez le téléphone à chaque joueur à tour de rôle.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
              <Button onClick={startDistribution}>Commencer la distribution</Button>
              <Button onClick={handleShuffle} variant="secondary">Mélanger à nouveau</Button>
            </div>
          </CardContent>
        ) : (
          <CardContent className="text-center space-y-6 py-8">
            {!showCharacter ? (
              <>
                <h2 className="text-xl font-bold">Joueur {currentStep + 1}</h2>
                <p className="text-gray-300">Appuyez sur le bouton pour voir votre personnage</p>
                <Button onClick={handleNext}>Révéler ma carte</Button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center space-y-4">
                  <img 
                    src={currentCharacter?.icon} 
                    alt={currentCharacter?.name} 
                    className="w-32 h-32 object-contain"
                  />
                  <h2 className="text-2xl font-bold">{currentCharacter?.name}</h2>
                  <div className="bg-gray-800 p-3 rounded-lg max-w-lg">
                    <p className="text-gray-300">{currentCharacter?.description}</p>
                  </div>
                  <div className="mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm 
                      ${currentCharacter?.team === 'village' ? 'bg-blue-700' : 
                        currentCharacter?.team === 'werewolf' ? 'bg-red-700' : 'bg-purple-700'}`}>
                      {currentCharacter?.team === 'village' ? 'Village' : 
                        currentCharacter?.team === 'werewolf' ? 'Loup-Garou' : 'Solitaire'}
                    </span>
                  </div>
                </div>
                <div className="pt-4">
                  <Button onClick={handleNext}>
                    {currentStep < shuffledCharacters.length - 1 ? 'Joueur suivant' : 'Commencer la partie'}
                  </Button>
                </div>
              </>
            )}
            <div className="text-sm text-gray-500 mt-6">
              {`${currentStep + 1} / ${shuffledCharacters.length}`}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Distribution;
