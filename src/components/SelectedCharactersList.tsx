
import React from 'react';
import { CharacterType } from '../types';
import { getCharacterById } from '../data/characters';

interface SelectedCharactersListProps {
  selectedCharacters: string[];
  onRemoveCharacter: (characterId: string) => void;
}

const SelectedCharactersList: React.FC<SelectedCharactersListProps> = ({
  selectedCharacters,
  onRemoveCharacter,
}) => {
  // Group characters by ID and count occurrences
  const characterCounts = selectedCharacters.reduce((acc: Record<string, number>, id: string) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-white">Personnages sélectionnés ({selectedCharacters.length})</h2>
      
      {selectedCharacters.length === 0 ? (
        <p className="text-gray-400">Aucun personnage sélectionné</p>
      ) : (
        <div className="space-y-2">
          {Object.entries(characterCounts).map(([characterId, count]) => {
            const character = getCharacterById(characterId);
            if (!character) return null;
            
            return (
              <div 
                key={characterId}
                className="flex items-center justify-between p-2 rounded-md bg-gray-800 border border-gray-700"
              >
                <div className="flex items-center">
                  <img src={character.icon} alt={character.name} className="w-8 h-8 mr-3" />
                  <div>
                    <h3 className="font-semibold">{character.name}</h3>
                    <p className="text-xs text-gray-400">
                      {character.team === 'village' ? 'Village' : 
                       character.team === 'werewolf' ? 'Loup-Garou' : 'Solitaire'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="mx-2 bg-gray-700 px-2 py-1 rounded-full text-xs">
                    {count}
                  </span>
                  <button 
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => onRemoveCharacter(characterId)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectedCharactersList;
