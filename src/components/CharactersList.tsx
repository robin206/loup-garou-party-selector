
import React, { useState } from 'react';
import { CharacterType, CharacterLinks, GamePhase } from '@/types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skull, Settings, Heart, User, Leaf, Target, UserCheck } from 'lucide-react';
import CharacterDetailsDialog from './CharacterDetailsDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CharactersListProps {
  characters: CharacterType[];
  aliveCharacters: string[];
  onKillCharacter: (id: string) => void;
  characterLinks?: CharacterLinks;
  onLinkCharacter?: (type: 'cupid' | 'wildChild', characterId: string, targetId: string) => void;
  onPlayerNameChange?: (characterId: string, name: string) => void;
  showPlayerNames?: boolean;
  onTogglePlayerNames?: () => void;
  gamePhase?: GamePhase;
}

const CharactersList: React.FC<CharactersListProps> = ({ 
  characters,
  aliveCharacters,
  onKillCharacter,
  characterLinks,
  onLinkCharacter,
  onPlayerNameChange,
  showPlayerNames = false,
  onTogglePlayerNames,
  gamePhase = 'setup'
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const handleCharacterClick = (character: CharacterType) => {
    setSelectedCharacter(character);
  };
  
  const handleCloseDialog = () => {
    setSelectedCharacter(null);
  };
  
  const getStatusBadge = (characterId: string) => {
    const isAlive = aliveCharacters.includes(characterId);
    
    if (!isAlive) {
      return <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md">
        <Skull className="h-3 w-3" />
      </div>;
    }
    
    // Check if character is linked by Cupid
    if (characterLinks?.cupidLinks && characterLinks.cupidLinks.includes(characterId)) {
      return <div className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full p-1 shadow-md">
        <Heart className="h-3 w-3 fill-white" />
      </div>;
    }
    
    // Check if character is Wild Child's model
    if (characterLinks?.wildChildModel === characterId) {
      return <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1 shadow-md">
        <Target className="h-3 w-3" />
      </div>;
    }
    
    return null;
  };
  
  const getBorderStyle = (characterId: string) => {
    // Cupid links
    if (characterLinks?.cupidLinks && characterLinks.cupidLinks.includes(characterId)) {
      return "border-pink-500 shadow-pink-300/20 shadow-md";
    }
    
    // Wild Child model
    if (characterLinks?.wildChildModel === characterId) {
      return "border-green-500 shadow-green-300/20 shadow-md";
    }
    
    return "border-gray-700";
  };

  // Cette fonction filtre les personnages en fonction du type d'équipe
  const filterCharactersByTeam = (team: 'village' | 'werewolf' | 'solo' | 'all') => {
    if (team === 'all') return characters;
    return characters.filter(char => char.team === team);
  };
  
  return (
    <>
      <div className="bg-gray-950/60 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Personnages en jeu ({characters.length})</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onTogglePlayerNames} className="flex items-center gap-2">
                <User className="h-4 w-4" /> 
                {showPlayerNames ? "Masquer les prénoms" : "Afficher les prénoms"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center gap-2 text-pink-500"
                onClick={() => {
                  if (characterLinks?.linkedCharactersVisible !== undefined && onLinkCharacter) {
                    onLinkCharacter('cupid', 'visibility', characterLinks.linkedCharactersVisible ? 'hide' : 'show');
                  }
                }}
              >
                <Heart className={`h-4 w-4 ${characterLinks?.linkedCharactersVisible ? '' : 'fill-pink-500'}`} /> 
                {characterLinks?.linkedCharactersVisible 
                  ? "Masquer liens amoureux" 
                  : "Afficher liens amoureux"
                }
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all" className="text-xs">Tous</TabsTrigger>
            <TabsTrigger value="village" className="text-xs flex items-center gap-1">
              <UserCheck className="h-3 w-3" /> Village
            </TabsTrigger>
            <TabsTrigger value="werewolf" className="text-xs flex items-center gap-1">
              <Skull className="h-3 w-3" /> Loups
            </TabsTrigger>
            <TabsTrigger value="solo" className="text-xs flex items-center gap-1">
              <User className="h-3 w-3" /> Solo
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <ScrollArea className="h-96 pr-4">
          <TabsContent value="all" className="m-0">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {characters.map(character => {
                const charId = character.instanceId || character.id;
                const isAlive = aliveCharacters.includes(charId);
                
                return (
                  <div 
                    key={charId} 
                    className="relative flex flex-col items-center cursor-pointer"
                    onClick={() => handleCharacterClick(character)}
                  >
                    <div 
                      className={`w-14 h-14 rounded-full overflow-hidden border-2 relative ${getBorderStyle(charId)}`}
                    >
                      <img 
                        src={character.icon} 
                        alt={character.name} 
                        className={`w-full h-full object-cover ${!isAlive ? 'grayscale opacity-70' : ''}`}
                      />
                      {getStatusBadge(charId)}
                    </div>
                    <div className="mt-1 text-xs text-center leading-tight">
                      <div className={`font-medium ${!isAlive ? 'line-through text-gray-500' : ''}`}>
                        {character.name}
                      </div>
                      {showPlayerNames && character.playerName && (
                        <div className="text-[10px] text-gray-400">
                          {character.playerName}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="village" className="m-0">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filterCharactersByTeam('village').map(character => {
                const charId = character.instanceId || character.id;
                const isAlive = aliveCharacters.includes(charId);
                
                return (
                  <div 
                    key={charId} 
                    className="relative flex flex-col items-center cursor-pointer"
                    onClick={() => handleCharacterClick(character)}
                  >
                    <div 
                      className={`w-14 h-14 rounded-full overflow-hidden border-2 relative ${getBorderStyle(charId)}`}
                    >
                      <img 
                        src={character.icon} 
                        alt={character.name} 
                        className={`w-full h-full object-cover ${!isAlive ? 'grayscale opacity-70' : ''}`}
                      />
                      {getStatusBadge(charId)}
                    </div>
                    <div className="mt-1 text-xs text-center leading-tight">
                      <div className={`font-medium ${!isAlive ? 'line-through text-gray-500' : ''}`}>
                        {character.name}
                      </div>
                      {showPlayerNames && character.playerName && (
                        <div className="text-[10px] text-gray-400">
                          {character.playerName}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="werewolf" className="m-0">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filterCharactersByTeam('werewolf').map(character => {
                const charId = character.instanceId || character.id;
                const isAlive = aliveCharacters.includes(charId);
                
                return (
                  <div 
                    key={charId} 
                    className="relative flex flex-col items-center cursor-pointer"
                    onClick={() => handleCharacterClick(character)}
                  >
                    <div 
                      className={`w-14 h-14 rounded-full overflow-hidden border-2 relative ${getBorderStyle(charId)}`}
                    >
                      <img 
                        src={character.icon} 
                        alt={character.name} 
                        className={`w-full h-full object-cover ${!isAlive ? 'grayscale opacity-70' : ''}`}
                      />
                      {getStatusBadge(charId)}
                    </div>
                    <div className="mt-1 text-xs text-center leading-tight">
                      <div className={`font-medium ${!isAlive ? 'line-through text-gray-500' : ''}`}>
                        {character.name}
                      </div>
                      {showPlayerNames && character.playerName && (
                        <div className="text-[10px] text-gray-400">
                          {character.playerName}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="solo" className="m-0">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filterCharactersByTeam('solo').map(character => {
                const charId = character.instanceId || character.id;
                const isAlive = aliveCharacters.includes(charId);
                
                return (
                  <div 
                    key={charId} 
                    className="relative flex flex-col items-center cursor-pointer"
                    onClick={() => handleCharacterClick(character)}
                  >
                    <div 
                      className={`w-14 h-14 rounded-full overflow-hidden border-2 relative ${getBorderStyle(charId)}`}
                    >
                      <img 
                        src={character.icon} 
                        alt={character.name} 
                        className={`w-full h-full object-cover ${!isAlive ? 'grayscale opacity-70' : ''}`}
                      />
                      {getStatusBadge(charId)}
                    </div>
                    <div className="mt-1 text-xs text-center leading-tight">
                      <div className={`font-medium ${!isAlive ? 'line-through text-gray-500' : ''}`}>
                        {character.name}
                      </div>
                      {showPlayerNames && character.playerName && (
                        <div className="text-[10px] text-gray-400">
                          {character.playerName}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </ScrollArea>
      </div>
      
      {selectedCharacter && (
        <CharacterDetailsDialog
          character={selectedCharacter}
          isOpen={true}
          onClose={handleCloseDialog}
          onKillCharacter={onKillCharacter}
          isAlive={aliveCharacters.includes(selectedCharacter.instanceId || selectedCharacter.id)}
          gameCharacters={characters}
          characterLinks={characterLinks}
          onLinkCharacter={onLinkCharacter}
          playerName={selectedCharacter.playerName}
          onPlayerNameChange={onPlayerNameChange}
          showPlayerNames={showPlayerNames}
          gamePhase={gamePhase}
        />
      )}
    </>
  );
};

export default CharactersList;
