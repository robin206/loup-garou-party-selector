import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { GameState, CharacterType, GamePhase } from '@/types';
import Header from '@/components/Header';
import GameMasterGuide from '@/components/GameMasterGuide';
import SoundSampler from '@/components/SoundSampler';
import CharactersList from '@/components/CharactersList'; 
import { toast } from 'sonner';

const Game = () => {
  const location = useLocation();
  const gameState = location.state as GameState;
  
  // If no game state is provided, redirect to the home page
  if (!gameState) {
    return <Navigate to="/" replace />;
  }

  const { players, characters, selectedCharacters } = gameState;
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [dayCount, setDayCount] = useState<number>(1);
  const [selectedGameCharacters, setSelectedGameCharacters] = useState<CharacterType[]>([]);
  const [aliveCharacters, setAliveCharacters] = useState<string[]>([]);

  // Prepare characters with action information and handle multiple instances
  useEffect(() => {
    if (characters && selectedCharacters && selectedCharacters.length > 0) {
      // Count occurrences of each character ID
      const characterCounts: Record<string, number> = {};
      selectedCharacters.forEach(charId => {
        characterCounts[charId] = (characterCounts[charId] || 0) + 1;
      });
      
      // Create an expanded array with multiple instances of the same character
      const expandedCharacters: CharacterType[] = [];
      
      // For each character ID in the counts
      Object.entries(characterCounts).forEach(([charId, count]) => {
        const character = characters.find(c => c.id === charId);
        if (!character) return;
        
        // Create character with action information
        const updatedCharacter = createCharacterWithActions(character);
        
        // Add the required number of instances of this character
        for (let i = 0; i < count; i++) {
          // Create a unique ID for each instance by adding an index
          const instanceId = count > 1 ? `${charId}-${i+1}` : charId;
          expandedCharacters.push({
            ...updatedCharacter,
            instanceId
          });
        }
      });
      
      setSelectedGameCharacters(expandedCharacters);
      
      // Initialize alive characters with all instanceIds
      const aliveIds = expandedCharacters.map(char => char.instanceId || char.id);
      setAliveCharacters(aliveIds);
      
      toast.success(`${players} joueurs prêts à jouer avec ${selectedCharacters.length} rôles!`);
    }
  }, [characters, selectedCharacters, players]);

  // Helper function to add action information to characters
  const createCharacterWithActions = (char: CharacterType): CharacterType => {
    if (char.id === 'werewolf') {
      return {
        ...char, 
        actionPhase: 'night' as const, 
        actionOrder: 10, 
        actionDescription: 'Demandez aux Loups-Garous de se réveiller et de choisir une victime.'
      };
    } else if (char.id === 'seer') {
      return {
        ...char, 
        actionPhase: 'night' as const, 
        actionOrder: 20, 
        actionDescription: 'Demandez à la Voyante de se réveiller et de désigner un joueur dont elle veut connaître l\'identité.'
      };
    } else if (char.id === 'witch') {
      return {
        ...char, 
        actionPhase: 'night' as const, 
        actionOrder: 30, 
        actionDescription: 'Demandez à la Sorcière de se réveiller. Montrez-lui la victime et demandez si elle veut utiliser sa potion de vie ou de mort.'
      };
    } else if (char.id === 'hunter') {
      return {
        ...char, 
        actionPhase: 'day' as const, 
        actionOrder: 10, 
        actionDescription: 'Si le Chasseur est tué, il doit immédiatement désigner un joueur qui mourra avec lui.'
      };
    } else if (char.id === 'cupid') {
      return {
        ...char, 
        actionPhase: 'night' as const, 
        actionOrder: 5, 
        actionDescription: 'Lors de la première nuit uniquement, demandez à Cupidon de désigner deux amoureux.'
      };
    } else if (char.id === 'white-werewolf') {
      return {
        ...char, 
        actionPhase: 'night' as const, 
        actionOrder: 35, 
        actionDescription: 'Une fois dans la partie, le Loup-Garou Blanc peut éliminer un autre Loup-Garou.'
      };
    } else if (char.id === 'big-bad-wolf') {
      return {
        ...char, 
        actionPhase: 'night' as const, 
        actionOrder: 11, 
        actionDescription: 'Si le Grand Méchant Loup est seul, il peut dévorer une seconde victime.'
      };
    } else if (char.id === 'wild-child') {
      return {
        ...char, 
        actionPhase: 'night' as const, 
        actionOrder: 3, 
        actionDescription: 'Lors de la première nuit, l\'Enfant Sauvage choisit un modèle parmi les joueurs.'
      };
    } else if (char.id === 'fox') {
      return {
        ...char, 
        actionPhase: 'night' as const, 
        actionOrder: 22, 
        actionDescription: 'Le Renard peut désigner 3 joueurs adjacents et savoir s\'il y a un loup-garou parmi eux.'
      };
    } else if (char.id === 'stuttering-judge') {
      return {
        ...char, 
        actionPhase: 'day' as const, 
        actionOrder: 5, 
        actionDescription: 'Le Juge Bègue peut demander un second vote pendant la journée (une fois par partie).'
      };
    } else if (char.id === 'two-sisters') {
      return {
        ...char, 
        actionPhase: 'night' as const, 
        actionOrder: 27, 
        actionDescription: 'Les Deux Soeurs se réveillent et peuvent échanger des informations.'
      };
    } else if (char.id === 'three-brothers') {
      return {
        ...char, 
        actionPhase: 'night' as const, 
        actionOrder: 28, 
        actionDescription: 'Les Trois Frères se réveillent et peuvent échanger des informations.'
      };
    } else if (char.id === 'pied-piper') {
      return {
        ...char, 
        actionPhase: 'night' as const, 
        actionOrder: 40, 
        actionDescription: 'Le Joueur de Flûte peut enchanter 2 joueurs chaque nuit.'
      };
    } else if (char.id === 'elder') {
      return {
        ...char, 
        actionPhase: 'night' as const, 
        actionOrder: 50, 
        actionDescription: 'L\'Ancien peut survivre à la première attaque des loups-garous.'
      };
    }
    // Return character with default values if not specifically configured
    return char;
  };

  const handlePhaseChange = (newPhase: GamePhase) => {
    setGamePhase(newPhase);
    
    // Increment day count when moving from night to day
    if (newPhase === 'day' && gamePhase === 'night') {
      setDayCount(prevCount => prevCount + 1);
    }
    
    toast.success(`Phase changée: ${newPhase}`);
  };

  const handleKillCharacter = (characterId: string) => {
    if (aliveCharacters.includes(characterId)) {
      // Kill character
      setAliveCharacters(prev => prev.filter(id => id !== characterId));
      const characterName = selectedGameCharacters.find(c => c.instanceId === characterId || c.id === characterId)?.name;
      toast.error(`Le personnage ${characterName} a été éliminé`);
    } else {
      // Revive character
      setAliveCharacters(prev => [...prev, characterId]);
      const characterName = selectedGameCharacters.find(c => c.instanceId === characterId || c.id === characterId)?.name;
      toast.success(`Le personnage ${characterName} a été ressuscité`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto pt-24 pb-24 px-4 flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center">
          <GameMasterGuide 
            characters={selectedGameCharacters}
            phase={gamePhase}
            onPhaseChange={handlePhaseChange}
            dayCount={dayCount}
          />
          
          {selectedGameCharacters.length > 0 && (
            <div className="mt-6 w-full max-w-md">
              <CharactersList 
                characters={selectedGameCharacters}
                aliveCharacters={aliveCharacters}
                onKillCharacter={handleKillCharacter}
              />
            </div>
          )}
        </div>
      </main>

      <div className="sticky bottom-0 left-0 right-0 w-full">
        <SoundSampler />
      </div>
    </div>
  );
};

export default Game;
