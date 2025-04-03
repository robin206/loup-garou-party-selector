import React, { useState, useEffect } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { GameState, CharacterType, GamePhase, CharacterLinks, GameNotification } from '@/types';
import Header from '@/components/Header';
import GameMasterGuide from '@/components/GameMasterGuide';
import SoundSampler from '@/components/SoundSampler';
import CharactersList from '@/components/CharactersList';
import GameNotifications from '@/components/GameNotifications';
import { Heart, Skull, Leaf, Target } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useAudio } from '@/hooks/useAudio';
import { Button } from '@/components/ui/button';

const GAME_STATE_STORAGE_KEY = 'werewolf-game-current-state';

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playHunterWarning } = useAudio();
  
  const initialGameState = location.state as GameState || JSON.parse(localStorage.getItem(GAME_STATE_STORAGE_KEY) || 'null');
  
  if (!initialGameState) {
    return <Navigate to="/" replace />;
  }

  const { players, characters, selectedCharacters } = initialGameState;
  const [gamePhase, setGamePhase] = useState<GamePhase>(initialGameState.currentPhase || 'setup');
  const [dayCount, setDayCount] = useState<number>(initialGameState.dayCount || 1);
  const [selectedGameCharacters, setSelectedGameCharacters] = useState<CharacterType[]>([]);
  const [aliveCharacters, setAliveCharacters] = useState<string[]>(initialGameState.aliveCharacters || []);
  const [characterLinks, setCharacterLinks] = useState<CharacterLinks>(initialGameState.characterLinks || {
    cupidLinks: [],
    wildChildModel: null,
    linkedCharactersVisible: true
  });
  const [gameNotifications, setGameNotifications] = useState<GameNotification[]>([]);
  const [showPlayerNames, setShowPlayerNames] = useState<boolean>(initialGameState.showPlayerNames || false);

  const WILD_CHILD_ANIMATION_DURATION = 20000; // 20 seconds

  useEffect(() => {
    if (characters && selectedCharacters && selectedCharacters.length > 0) {
      if (initialGameState && initialGameState.gameCharacters) {
        setSelectedGameCharacters(initialGameState.gameCharacters);
        
        if (!initialGameState.aliveCharacters) {
          const aliveIds = initialGameState.gameCharacters.map(char => char.instanceId || char.id);
          setAliveCharacters(aliveIds);
        }
        
        toast.success(`Partie restaurée avec ${players} joueurs et ${selectedCharacters.length} rôles!`);
      } else {
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
    }
  }, [characters, selectedCharacters, players, initialGameState]);

  useEffect(() => {
    if (selectedGameCharacters.length > 0) {
      const currentGameState: GameState = {
        players,
        characters,
        selectedCharacters,
        currentPhase: gamePhase,
        dayCount,
        aliveCharacters,
        characterLinks,
        showPlayerNames,
        gameCharacters: selectedGameCharacters
      };
      
      localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(currentGameState));
    }
  }, [gamePhase, dayCount, aliveCharacters, characterLinks, showPlayerNames, selectedGameCharacters, players, characters, selectedCharacters]);

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

  const addNotification = (notification: Omit<GameNotification, 'id' | 'timestamp'>) => {
    const id = uuidv4();
    const newNotification: GameNotification = {
      ...notification,
      id,
      timestamp: Date.now()
    };

    setGameNotifications(prev => [...prev, newNotification]);

    if (notification.duration && 
        !notification.message.includes('amoureux') && 
        !notification.message.includes('Enfant Sauvage') &&
        !notification.message.includes('Chasseur')) {
      setTimeout(() => {
        dismissNotification(id);
      }, notification.duration);
    }
  };

  const dismissNotification = (id: string) => {
    setGameNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleKillCharacter = (characterId: string) => {
    if (aliveCharacters.includes(characterId)) {
      setAliveCharacters(prev => prev.filter(id => id !== characterId));
      const character = selectedGameCharacters.find(c => c.instanceId === characterId || c.id === characterId);
      
      if (character) {
        toast.error(`Le personnage ${character.name} a été éliminé`);
        
        if (characterLinks.cupidLinks && characterLinks.cupidLinks.includes(characterId)) {
          const otherLoverId = characterLinks.cupidLinks.find(id => id !== characterId);
          if (otherLoverId) {
            const otherLover = selectedGameCharacters.find(c => (c.instanceId || c.id) === otherLoverId);
            if (otherLover) {
              addNotification({
                message: `${character.name} était amoureux. ${otherLover.name} doit mourir de chagrin !`,
                type: 'warning',
                icon: <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
              });
            }
          }
        }
        
        if (characterLinks.wildChildModel === characterId) {
          const wildChild = selectedGameCharacters.find(c => c.id === 'wild-child');
          if (wildChild) {
            addNotification({
              message: `Le modèle de l'Enfant Sauvage est mort ! L'Enfant Sauvage rejoint maintenant le camp des Loups-Garous.`,
              type: 'warning',
              icon: <Leaf className="h-5 w-5 text-green-500" />
            });
            
            if (wildChild) {
              const wildChildId = wildChild.instanceId || wildChild.id;
              handleLinkCharacter('wildChild', wildChildId, 'convert-to-werewolf');
            }
          }
        }
        
        if (character.id === 'hunter') {
          addNotification({
            message: `Le Chasseur (${character.playerName || character.name}) est mort ! Il doit immédiatement désigner un joueur qui mourra avec lui.`,
            type: 'warning',
            icon: <Target className="h-5 w-5 text-red-500" />
          });
          
          playHunterWarning();
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
        setCharacterLinks(prev => ({
          ...prev,
          cupidLinks: []
        }));
        toast.info('Lien amoureux retiré');
        return;
      }
      
      if (characterLinks.cupidLinks && characterLinks.cupidLinks.length === 2) {
        setCharacterLinks(prev => ({
          ...prev,
          cupidLinks: [targetId]
        }));
        
        toast.info('Nouvelle sélection d\'amoureux commencée');
        return;
      }
      
      if (characterLinks.cupidLinks && characterLinks.cupidLinks.length === 1) {
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
          
          addNotification({
            message: `${char1.name} et ${char2.name} sont maintenant amoureux ! Si l'un d'eux meurt, l'autre mourra de chagrin.`,
            type: 'info',
            icon: <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />,
            duration: 15000
          });
        }
      } else {
        setCharacterLinks(prev => ({
          ...prev,
          cupidLinks: [targetId]
        }));
        
        toast.info('Premier amoureux sélectionné, choisissez maintenant le second');
      }
    } 
    
    if (type === 'wildChild') {
      if (targetId === 'convert-to-werewolf') {
        const wildChild = selectedGameCharacters.find(c => (c.instanceId || c.id) === characterId);
        
        if (wildChild) {
          setSelectedGameCharacters(prev => 
            prev.map(c => 
              (c.instanceId || c.id) === characterId 
                ? { 
                    ...c, 
                    team: 'werewolf' as const,
                    className: 'animate-wild-child-transformation'
                  } 
                : c
            )
          );
          
          toast.warning(`${wildChild.name} est maintenant un Loup-Garou!`, {
            description: "Son modèle a été tué et il a rejoint le camp des Loups-Garous.",
            duration: WILD_CHILD_ANIMATION_DURATION,
          });
        }
        
        return;
      }
      
      if (!targetId) {
        setCharacterLinks(prev => ({
          ...prev,
          wildChildModel: null
        }));
        toast.info('Modèle de l\'Enfant Sauvage retiré');
        return;
      }
      
      setCharacterLinks(prev => ({
        ...prev,
        wildChildModel: targetId
      }));
      
      const model = selectedGameCharacters.find(c => (c.instanceId || c.id) === targetId);
      
      if (model) {
        toast.success(`${model.name} est maintenant le modèle de l'Enfant Sauvage!`);
        
        addNotification({
          message: `${model.name} est le modèle de l'Enfant Sauvage. Si le modèle meurt, l'Enfant Sauvage deviendra un Loup-Garou.`,
          type: 'info',
          icon: <Leaf className="h-5 w-5 text-green-500" />,
          duration: 15000
        });
      }
    }
  };
  
  const handlePlayerNameChange = (characterId: string, name: string) => {
    setSelectedGameCharacters(prev => 
      prev.map(char => 
        (char.instanceId || char.id) === characterId 
          ? { ...char, playerName: name } 
          : char
      )
    );
    
    toast.success(`Prénom "${name}" associé au personnage`);
  };
  
  const togglePlayerNames = () => {
    setShowPlayerNames(prev => !prev);
  };
  
  const handleEndGame = () => {
    localStorage.removeItem(GAME_STATE_STORAGE_KEY);
    toast.success("Partie terminée et sauvegarde effacée");
    navigate("/", { replace: true });
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
                onPlayerNameChange={handlePlayerNameChange}
                showPlayerNames={showPlayerNames}
                onTogglePlayerNames={togglePlayerNames}
                gamePhase={gamePhase}
              />
              
              <GameNotifications 
                notifications={gameNotifications} 
                onDismiss={dismissNotification} 
              />
              
              <div className="mt-10 flex justify-center">
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleEndGame}
                  className="w-full"
                >
                  <Skull className="mr-2 h-5 w-5" />
                  Terminer la partie
                </Button>
              </div>
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
