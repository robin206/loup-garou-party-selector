
import React from 'react';
import { GameState } from '@/types';
import CharacterList from './CharacterList';
import { useGameSetup } from '@/hooks/useGameSetup';
import ExpansionSelector from './game-setup/ExpansionSelector';
import SelectionToolbar from './game-setup/SelectionToolbar';
import SelectionStats from './game-setup/SelectionStats';
import StartGameButton from './game-setup/StartGameButton';

interface GameSetupProps {
  onStartGame?: (gameState: GameState) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const {
    selectedCharacters,
    selectedExpansion,
    viewMode,
    expansionPacks,
    filteredCharacters,
    teamCounts,
    selectedCharactersCount,
    getSelectedCharacterCount,
    handleCharacterToggle,
    handleIncreaseCharacter,
    handleDecreaseCharacter,
    handleExpansionChange,
    resetSelection,
    toggleViewMode,
    handleStartGame,
    hasActiveGame,
    handleContinueGame
  } = useGameSetup(onStartGame);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 p-4">
      <SelectionStats 
        selectedCharactersCount={selectedCharactersCount} 
        teamCounts={teamCounts} 
      />

      <ExpansionSelector 
        selectedExpansion={selectedExpansion}
        expansionPacks={expansionPacks}
        onExpansionChange={handleExpansionChange}
      />

      <section className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <SelectionToolbar 
          viewMode={viewMode}
          onToggleViewMode={toggleViewMode}
          onResetSelection={resetSelection}
        />
        
        <p className="text-sm text-gray-500 mb-6">
          Sélectionnez au moins 3 personnages pour jouer. Vous pouvez ajouter plusieurs exemplaires du même rôle.
          <br />
          <strong>Vous pouvez sélectionner plusieurs villageois et plusieurs loups-garous.</strong>
        </p>
        
        <CharacterList 
          characters={filteredCharacters} 
          selectedCharacters={selectedCharacters} 
          onCharacterToggle={handleCharacterToggle} 
          getSelectedCount={getSelectedCharacterCount}
          viewMode={viewMode}
          onIncreaseCharacter={handleIncreaseCharacter}
          onDecreaseCharacter={handleDecreaseCharacter}
        />
      </section>

      <StartGameButton 
        onStartGame={handleStartGame}
        playersCount={selectedCharactersCount}
        disabled={selectedCharactersCount < 3}
        hasActiveGame={hasActiveGame}
        onContinueGame={handleContinueGame}
      />
    </div>
  );
};

export default GameSetup;
