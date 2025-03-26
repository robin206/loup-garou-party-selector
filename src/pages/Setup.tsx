
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CharacterType, GameState } from '../types';
import { allCharacters } from '../data/characters';
import CharacterSelection from '../components/CharacterSelection';
import SelectedCharactersList from '../components/SelectedCharactersList';
import NumberInput from '../components/NumberInput';
import Button from '../components/Button';
import Card from '../components/Card';
import { getRecommendedCharacters } from '../utils/gameUtils';

const Setup: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = localStorage.getItem('werewolf-game');
    if (savedState) {
      return JSON.parse(savedState);
    }
    return {
      players: 8,
      characters: allCharacters,
      selectedCharacters: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('werewolf-game', JSON.stringify(gameState));
  }, [gameState]);

  const handlePlayersChange = (players: number) => {
    setGameState(prev => ({ ...prev, players }));
  };

  const handleCharacterSelect = (character: CharacterType) => {
    setGameState(prev => ({
      ...prev,
      selectedCharacters: [...prev.selectedCharacters, character.id],
    }));
  };

  const handleCharacterRemove = (characterId: string) => {
    const index = gameState.selectedCharacters.lastIndexOf(characterId);
    if (index !== -1) {
      setGameState(prev => ({
        ...prev,
        selectedCharacters: [
          ...prev.selectedCharacters.slice(0, index),
          ...prev.selectedCharacters.slice(index + 1),
        ],
      }));
    }
  };

  const selectRecommendedCharacters = () => {
    const recommended = getRecommendedCharacters(gameState.players);
    setGameState(prev => ({
      ...prev,
      selectedCharacters: recommended.map(c => c.id),
    }));
  };

  const startGame = () => {
    if (gameState.selectedCharacters.length < gameState.players) {
      alert(`Il faut sélectionner au moins ${gameState.players} personnages pour commencer la partie.`);
      return;
    }
    
    if (gameState.selectedCharacters.length > gameState.players) {
      alert(`Vous avez sélectionné ${gameState.selectedCharacters.length} personnages, mais il n'y a que ${gameState.players} joueurs.`);
      return;
    }
    
    navigate('/distribution');
  };

  const clearSelectedCharacters = () => {
    setGameState(prev => ({
      ...prev,
      selectedCharacters: [],
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card title="Configuration de la partie">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Nombre de joueurs</h2>
            <NumberInput
              value={gameState.players}
              onChange={handlePlayersChange}
              min={3}
              max={40}
              className="w-full sm:w-1/2 lg:w-1/3"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button onClick={selectRecommendedCharacters}>
              Sélection recommandée
            </Button>
            <Button onClick={clearSelectedCharacters} variant="secondary">
              Réinitialiser
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4">Sélection des personnages</h2>
              <CharacterSelection
                selectedCharacters={gameState.selectedCharacters}
                onCharacterSelect={handleCharacterSelect}
                onCharacterRemove={handleCharacterRemove}
              />
            </div>
            
            <div>
              <SelectedCharactersList
                selectedCharacters={gameState.selectedCharacters}
                onRemoveCharacter={handleCharacterRemove}
              />
              
              <div className="mt-6">
                <Button
                  onClick={startGame}
                  disabled={gameState.selectedCharacters.length !== gameState.players}
                  fullWidth
                >
                  Commencer la partie
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Setup;
