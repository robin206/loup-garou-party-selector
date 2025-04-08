
import React, { useState } from 'react';
import CharacterCard from './CharacterCard';
import SimpleCharacterCard from './SimpleCharacterCard';
import { CharacterType } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CharacterListProps {
  characters: CharacterType[];
  selectedCharacters: string[];
  onCharacterToggle: (id: string) => void;
  getSelectedCount: (id: string) => number;
  viewMode: 'detailed' | 'simple';
  onIncreaseCharacter?: (id: string) => void;
  onDecreaseCharacter?: (id: string) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ 
  characters, 
  selectedCharacters, 
  onCharacterToggle,
  getSelectedCount,
  viewMode,
  onIncreaseCharacter,
  onDecreaseCharacter
}) => {
  const [activeTab, setActiveTab] = useState<string>("tous");

  const filteredCharacters = (tab: string) => {
    if (tab === "tous") return characters;
    if (tab === "village") return characters.filter(c => c.team === "village");
    if (tab === "loups") return characters.filter(c => c.team === "werewolf");
    if (tab === "special") return characters.filter(c => c.team === "solo");
    return characters;
  };

  return (
    <div className="w-full max-w-4xl">
      <Tabs defaultValue="tous" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-center mb-4">
          <TabsList className="glass-card">
            <TabsTrigger value="tous" className="px-4">Tous</TabsTrigger>
            <TabsTrigger value="village" className="px-4">Village</TabsTrigger>
            <TabsTrigger value="loups" className="px-4">Loups</TabsTrigger>
            <TabsTrigger value="special" className="px-4">Spéciaux</TabsTrigger>
          </TabsList>
        </div>
        
        {["tous", "village", "loups", "special"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0">
            <div className={cn(
              "grid gap-4",
              viewMode === 'detailed' 
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" 
                : "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
            )}>
              {filteredCharacters(tab).map((character) => {
                const count = getSelectedCount(character.id);
                return (
                  <div key={character.id} className="relative">
                    {viewMode === 'detailed' ? (
                      <CharacterCard
                        character={character}
                        isSelected={count > 0}
                        onSelect={onCharacterToggle}
                        selectedCount={count}
                        onIncrease={onIncreaseCharacter}
                        onDecrease={onDecreaseCharacter}
                      />
                    ) : (
                      <SimpleCharacterCard
                        character={character}
                        isSelected={count > 0}
                        onSelect={onCharacterToggle}
                        selectedCount={count}
                        onIncrease={onIncreaseCharacter}
                        onDecrease={onDecreaseCharacter}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CharacterList;
