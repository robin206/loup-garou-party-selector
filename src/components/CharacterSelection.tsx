
import React, { useState } from 'react';
import { CharacterType } from '../types';
import { allCharacters, getExpansions, getCharactersByExpansion } from '../data/characters';

interface CharacterSelectionProps {
  selectedCharacters: string[];
  onCharacterSelect: (character: CharacterType) => void;
  onCharacterRemove: (characterId: string) => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  selectedCharacters,
  onCharacterSelect,
  onCharacterRemove
}) => {
  const [selectedExpansion, setSelectedExpansion] = useState<string>('base');
  const expansions = getExpansions();
  const filteredCharacters = selectedExpansion 
    ? getCharactersByExpansion(selectedExpansion) 
    : allCharacters;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          className={`px-3 py-1 rounded-full text-sm ${selectedExpansion === '' ? 'bg-red-700 text-white' : 'bg-gray-800 text-gray-300'}`}
          onClick={() => setSelectedExpansion('')}
        >
          Tous
        </button>
        {expansions.map(expansion => (
          <button 
            key={expansion.id}
            className={`px-3 py-1 rounded-full text-sm ${selectedExpansion === expansion.id ? 'bg-red-700 text-white' : 'bg-gray-800 text-gray-300'}`}
            onClick={() => setSelectedExpansion(expansion.id)}
          >
            {expansion.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredCharacters.map(character => {
          const isSelected = selectedCharacters.includes(character.id);
          const count = selectedCharacters.filter(id => id === character.id).length;
          
          return (
            <div 
              key={character.id}
              className={`relative p-3 rounded-lg border cursor-pointer transition-all transform hover:scale-105 
                ${isSelected ? 'border-red-700 bg-gray-900' : 'border-gray-700 bg-gray-800'}`}
              onClick={() => onCharacterSelect(character)}
            >
              <div className="flex flex-col items-center">
                <img 
                  src={character.icon} 
                  alt={character.name} 
                  className="w-16 h-16 object-contain mb-2" 
                />
                <h3 className="text-sm text-center font-bold">{character.name}</h3>
                <p className="text-xs text-gray-400">{character.team === 'village' ? 'Village' : character.team === 'werewolf' ? 'Loup-Garou' : 'Solitaire'}</p>
                
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    {count}
                  </div>
                )}
              </div>
              
              {isSelected && (
                <button 
                  className="absolute bottom-2 right-2 bg-gray-700 hover:bg-gray-600 rounded-full p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCharacterRemove(character.id);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterSelection;
