
import React from 'react';
import { useGameSetup } from '@/hooks/useGameSetup';
import Header from '@/components/Header';
import GameSetup from '@/components/GameSetup';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import StartGameButton from '@/components/game-setup/StartGameButton';
import SelectionStats from '@/components/game-setup/SelectionStats';
import SelectionToolbar from '@/components/game-setup/SelectionToolbar';
import ExpansionSelector from '@/components/game-setup/ExpansionSelector';

const Setup = () => {
  const navigate = useNavigate();
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
  } = useGameSetup();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="w-full max-w-4xl mx-auto pt-24 pb-24 px-4 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Sélection des cartes</h1>
          <Button variant="outline" onClick={handleBack} size="sm">
            Retour
          </Button>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-3/4">
              <ExpansionSelector 
                expansionPacks={expansionPacks}
                selectedExpansion={selectedExpansion}
                onExpansionChange={handleExpansionChange}
              />
              
              <GameSetup 
                characters={filteredCharacters}
                onCharacterToggle={handleCharacterToggle}
                onCharacterIncrease={handleIncreaseCharacter}
                onCharacterDecrease={handleDecreaseCharacter}
                getSelectedCount={getSelectedCharacterCount}
                viewMode={viewMode}
              />
            </div>
            
            <div className="w-full lg:w-1/4 space-y-6">
              <SelectionStats 
                selectedCharactersCount={selectedCharactersCount}
                teamCounts={teamCounts}
              />
              
              <SelectionToolbar 
                viewMode={viewMode}
                onToggleViewMode={toggleViewMode}
                onResetSelection={resetSelection}
              />
              
              <StartGameButton 
                onStartGame={handleStartGame}
                playersCount={selectedCharactersCount}
                disabled={selectedCharactersCount < 3}
                hasActiveGame={hasActiveGame}
                onContinueGame={handleContinueGame}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Setup;
