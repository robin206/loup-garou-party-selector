
import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { GameState, CharacterType, GamePhase, CharacterLinks } from '@/types';
import Header from '@/components/Header';
import GameMasterGuide from '@/components/GameMasterGuide';
import SoundSampler from '@/components/SoundSampler';
import CharactersList from '@/components/CharactersList'; 
import { toast } from 'sonner';

const Game = () => {
  const location = useLocation();
  const gameState = location.state as GameState;
  
  if (!gameState) {
    return <Navigate to="/" replace />;
  }

  const { players, characters, selectedCharacters } = gameState;
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [dayCount, setDayCount] = useState<number>(1);
  const [selectedGameCharacters, setSelectedGameCharacters] = useState<CharacterType[]>([]);
  const [aliveCharacters, setAliveCharacters] = useState<string[]>([]);
  const [characterLinks, setCharacterLinks] = useState<CharacterLinks>({
    cupidLinks: [],
    wildChildModel: null,
    linkedCharactersVisible: true
  });

  useEffect(() => {
    if (characters && selectedCharacters && selectedCharacters.length > 0) {
      const characterCounts: Record<string, number> = {};
      selectedCharacters.forEach(charId => {
        characterCounts[charId] = (characterCounts[charId] || 0) + 1;
      });
      
      const expandedCharacters: CharacterType[] = [];
      
      Object.entries(characterCounts).forEach(([charId, count]) => {
        const character = characters.find(c => c.id === charId);
        if (!character) return;
        
        const updatedCharacter = createCharacterWithActions(character);
        
        for (let i = 0; i < count; i++) {
          const instanceId = count > 1 ? `${charId}-${i+1}` : charId;
          expandedCharacters.push({
            ...updatedCharacter,
            instanceId
          });
        }
      });
      
      setSelectedGameCharacters(expandedCharacters);
      
      const aliveIds = expandedCharacters.map(char => char.instanceId || char.id);
      setAliveCharacters(aliveIds);
      
      toast.success(`${players} joueurs prêts à jouer avec ${selectedCharacters.length} rôles!`);
    }
  }, [characters, selectedCharacters, players]);

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
    return char;
  };

  const handlePhaseChange = (newPhase: GamePhase) => {
    setGamePhase(newPhase);
    
    if (newPhase === 'day' && gamePhase === 'night') {
      setDayCount(prevCount => prevCount + 1);
    }
    
    toast.success(`Phase changée: ${newPhase}`);
  };

  const handleKillCharacter = (characterId: string) => {
    if (aliveCharacters.includes(characterId)) {
      setAliveCharacters(prev => prev.filter(id => id !== characterId));
      const characterName = selectedGameCharacters.find(c => c.instanceId === characterId || c.id === characterId)?.name;
      toast.error(`Le personnage ${characterName} a été éliminé`);
      
      // Check if this character was part of a Cupid link
      if (characterLinks.cupidLinks && characterLinks.cupidLinks.includes(characterId)) {
        // Find the other lover
        const otherLoverId = characterLinks.cupidLinks.find(id => id !== characterId);
        if (otherLoverId) {
          const otherLover = selectedGameCharacters.find(c => (c.instanceId || c.id) === otherLoverId);
          if (otherLover) {
            toast.warning(`L'amoureux de ${characterName} doit mourir de chagrin!`, {
              description: `N'oubliez pas d'éliminer ${otherLover.name} aussi.`,
              duration: 8000,
            });
          }
        }
      }
    } else {
      setAliveCharacters(prev => [...prev, characterId]);
      const characterName = selectedGameCharacters.find(c => c.instanceId === characterId || c.id === characterId)?.name;
      toast.success(`Le personnage ${characterName} a été ressuscité`);
    }
  };

  const handleLinkCharacter = (type: 'cupid' | 'wildChild', characterId: string, targetId: string) => {
    if (type === 'cupid') {
      if (!targetId) {
        // Remove Cupid links
        setCharacterLinks(prev => ({
          ...prev,
          cupidLinks: []
        }));
        toast.info('Lien amoureux retiré');
        return;
      }
      
      // If Cupid already has complete links (2 lovers), reset and start over
      if (characterLinks.cupidLinks && characterLinks.cupidLinks.length === 2) {
        setCharacterLinks(prev => ({
          ...prev,
          cupidLinks: [targetId]
        }));
        
        toast.info('Nouvelle sélection d\'amoureux commencée');
        return;
      }
      
      // If Cupid already has one link, complete the pair
      if (characterLinks.cupidLinks && characterLinks.cupidLinks.length === 1) {
        // Check if trying to select the same character twice
        if (characterLinks.cupidLinks[0] === targetId) {
          toast.error('Vous ne pouvez pas sélectionner le même personnage deux fois');
          return;
        }
        
        const newLinks = [characterLinks.cupidLinks[0], targetId];
        
        setCharacterLinks(prev => ({
          ...prev,
          cupidLinks: newLinks
        }));
        
        const char1 = selectedGameCharacters.find(c => (c.instanceId || c.id) === newLinks[0]);
        const char2 = selectedGameCharacters.find(c => (c.instanceId || c.id) === targetId);
        
        if (char1 && char2) {
          toast.success(`${char1.name} et ${char2.name} sont maintenant amoureux!`);
        }
      } else {
        // Start a new pair with the first lover
        setCharacterLinks(prev => ({
          ...prev,
          cupidLinks: [targetId]
        }));
        
        toast.info('Premier amoureux sélectionné, choisissez maintenant le second');
      }
    } 
    
    if (type === 'wildChild') {
      if (targetId === 'convert-to-werewolf') {
        // Special case: convert Wild Child to werewolf
        const wildChild = selectedGameCharacters.find(c => (c.instanceId || c.id) === characterId);
        
        if (wildChild) {
          // Update the Wild Child's team with animation effect
          setSelectedGameCharacters(prev => 
            prev.map(c => 
              (c.instanceId || c.id) === characterId 
                ? { ...c, team: 'werewolf' as const } 
                : c
            )
          );
          
          toast.warning(`${wildChild.name} est maintenant un Loup-Garou!`, {
            description: "Son modèle a été tué et il a rejoint le camp des Loups-Garous.",
            duration: 5000,
          });
        }
        
        return;
      }
      
      if (!targetId) {
        // Remove Wild Child model
        setCharacterLinks(prev => ({
          ...prev,
          wildChildModel: null
        }));
        toast.info('Modèle de l\'Enfant Sauvage retiré');
        return;
      }
      
      // Set the Wild Child model
      setCharacterLinks(prev => ({
        ...prev,
        wildChildModel: targetId
      }));
      
      const model = selectedGameCharacters.find(c => (c.instanceId || c.id) === targetId);
      
      if (model) {
        toast.success(`${model.name} est maintenant le modèle de l'Enfant Sauvage!`);
      }
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
            aliveCharacters={aliveCharacters}
          />
          
          {selectedGameCharacters.length > 0 && (
            <div className="mt-6 w-full max-w-md">
              <CharactersList 
                characters={selectedGameCharacters}
                aliveCharacters={aliveCharacters}
                onKillCharacter={handleKillCharacter}
                characterLinks={characterLinks}
                onLinkCharacter={handleLinkCharacter}
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
