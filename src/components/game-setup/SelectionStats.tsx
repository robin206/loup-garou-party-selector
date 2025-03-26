
import React from 'react';

interface SelectionStatsProps {
  selectedCharactersCount: number;
  teamCounts: {
    werewolf: number;
    village: number;
    solo: number;
  };
}

const SelectionStats: React.FC<SelectionStatsProps> = ({ 
  selectedCharactersCount,
  teamCounts
}) => {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 backdrop-blur-sm border-b border-gray-100 py-2 shadow-sm bg-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="font-medium">
            <span className="text-werewolf-accent">{selectedCharactersCount}</span> personnages sélectionnés
          </div>
          <div className="text-sm">
            <span className="text-werewolf-accent">{teamCounts.werewolf}</span> loups-garous | 
            <span className="text-werewolf-accent ml-1">{teamCounts.village}</span> villageois | 
            <span className="text-werewolf-accent ml-1">{teamCounts.solo}</span> solitaires
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionStats;
