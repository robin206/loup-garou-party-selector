
import React, { useState } from 'react';
import CharacterCard from './CharacterCard';
import { CharacterType } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CharacterListProps {
  characters: CharacterType[];
  selectedCharacters: string[];
  onCharacterToggle: (id: string) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ 
  characters, 
  selectedCharacters, 
  onCharacterToggle 
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredCharacters(tab).map((character, index) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  isSelected={selectedCharacters.includes(character.id)}
                  onSelect={onCharacterToggle}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CharacterList;
