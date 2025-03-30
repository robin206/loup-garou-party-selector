
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CharacterType, GameState, ExpansionType } from '@/types';
import { allCharacters, getExpansions } from '@/data/characters';
import { toast } from 'sonner';

const STORAGE_KEY = 'werewolf-game-selection';
const GAME_STATE_STORAGE_KEY = 'werewolf-game-current-state';

// Expansion packs data
const expansionPacks: ExpansionType[] = [{
  id: 'all',
  name: 'Toutes les extensions',
  description: 'Tous les personnages disponibles'
}, ...getExpansions().map(exp => ({
  id: exp.id,
  name: exp.name,
  description: `Extension ${exp.name}`
}))];

export const useGameSetup = (onStartGame?: (gameState: GameState) => void) => {
  const navigate = useNavigate();
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [characters] = useState<CharacterType[]>(allCharacters);
  const [selectedExpansion, setSelectedExpansion] = useState<string>('all');
  const [characterCounts, setCharacterCounts] = useState<Record<string, number>>({});
  const [viewMode, setViewMode] = useState<'detailed' | 'simple'>('detailed');
  const [hasActiveGame, setHasActiveGame] = useState<boolean>(false);

  useEffect(() => {
    // Check if there's an active game
    const activeGame = localStorage.getItem(GAME_STATE_STORAGE_KEY);
    setHasActiveGame(!!activeGame);

    // Load saved selection
    const savedSelection = localStorage.getItem(STORAGE_KEY);
    if (savedSelection) {
      try {
        const savedData = JSON.parse(savedSelection);
        setSelectedCharacters(savedData.selectedCharacters || []);
        setSelectedExpansion(savedData.selectedExpansion || 'all');

        const counts: Record<string, number> = {};
        savedData.selectedCharacters.forEach((id: string) => {
          counts[id] = (counts[id] || 0) + 1;
        });
        setCharacterCounts(counts);
        toast.info("Sélection précédente chargée");
      } catch (error) {
        console.error("Error loading saved selection:", error);
      }
    } else {
      // Si pas de sélection précédente, recommandation de base
      const initialRecs = characters.filter(c => c.recommended).slice(0, 3);
      setSelectedCharacters(initialRecs.map(c => c.id));
      initialRecs.forEach(c => {
        setCharacterCounts(prev => ({
          ...prev,
          [c.id]: 1
        }));
      });
    }
  }, [characters]);

  const handleCharacterToggle = (id: string) => {
    // If already selected, toggle it off completely
    if (characterCounts[id] > 0) {
      setSelectedCharacters(prev => prev.filter(charId => charId !== id));
      setCharacterCounts(prev => ({ ...prev, [id]: 0 }));
    } else {
      // If not selected, add one
      setSelectedCharacters(prev => [...prev, id]);
      setCharacterCounts(prev => ({ ...prev, [id]: 1 }));
    }
  };

  const handleIncreaseCharacter = (id: string) => {
    setSelectedCharacters(prev => [...prev, id]);
    setCharacterCounts(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleDecreaseCharacter = (id: string) => {
    const currentCount = characterCounts[id] || 0;
    if (currentCount <= 1) {
      // If this is the last one, remove it completely
      setSelectedCharacters(prev => prev.filter(charId => charId !== id));
      setCharacterCounts(prev => ({ ...prev, [id]: 0 }));
    } else {
      // Remove just one instance
      setSelectedCharacters(prev => {
        const index = prev.lastIndexOf(id);
        if (index !== -1) {
          return [...prev.slice(0, index), ...prev.slice(index + 1)];
        }
        return prev;
      });
      setCharacterCounts(prev => ({
        ...prev,
        [id]: Math.max(0, (prev[id] || 0) - 1)
      }));
    }
  };

  const handleExpansionChange = (value: string) => {
    setSelectedExpansion(value);
  };

  const resetSelection = () => {
    setSelectedCharacters([]);
    setSelectedExpansion('all');
    setCharacterCounts({});
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Sélection réinitialisée");
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'detailed' ? 'simple' : 'detailed');
    toast.info(`Vue ${viewMode === 'detailed' ? 'simplifiée' : 'détaillée'} activée`);
  };

  const filteredCharacters = (): CharacterType[] => {
    if (selectedExpansion === 'all') return characters;
    return characters.filter(char => char.expansion === selectedExpansion);
  };

  const countCharactersByTeam = (team: 'village' | 'werewolf' | 'solo'): number => {
    let count = 0;
    selectedCharacters.forEach(charId => {
      const character = characters.find(c => c.id === charId);
      if (character?.team === team) {
        count++;
      }
    });
    return count;
  };

  const getSelectedCharacterCount = (id: string): number => {
    return characterCounts[id] || 0;
  };

  const handleStartGame = () => {
    if (selectedCharacters.length < 3) {
      toast.error("Veuillez sélectionner au moins 3 rôles pour jouer.");
      return;
    }
    const werewolfCount = countCharactersByTeam('werewolf');
    if (werewolfCount === 0) {
      toast.error("Vous devez inclure au moins un Loup-Garou pour jouer.");
      return;
    }
    const villageCount = countCharactersByTeam('village');
    if (villageCount === 0) {
      toast.error("Vous devez inclure au moins un Villageois pour jouer.");
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      selectedCharacters,
      selectedExpansion
    }));
    const gameState: GameState = {
      players: selectedCharacters.length,
      characters: characters,
      selectedCharacters: selectedCharacters
    };
    if (onStartGame) {
      onStartGame(gameState);
    }
    toast.success("Partie initialisée! Mode maître du jeu activé.");
    navigate('/game', {
      state: gameState
    });
  };

  const handleContinueGame = () => {
    try {
      const gameState = JSON.parse(localStorage.getItem(GAME_STATE_STORAGE_KEY) || '{}');
      if (gameState && gameState.players) {
        toast.success("Reprise de la partie en cours...");
        navigate('/game', { state: gameState });
      } else {
        toast.error("Impossible de reprendre la partie");
        localStorage.removeItem(GAME_STATE_STORAGE_KEY);
        setHasActiveGame(false);
      }
    } catch (e) {
      toast.error("Erreur lors de la reprise de la partie");
      localStorage.removeItem(GAME_STATE_STORAGE_KEY);
      setHasActiveGame(false);
    }
  };

  const teamCounts = {
    werewolf: countCharactersByTeam('werewolf'),
    village: countCharactersByTeam('village'),
    solo: countCharactersByTeam('solo')
  };

  return {
    selectedCharacters,
    selectedExpansion,
    viewMode,
    expansionPacks,
    filteredCharacters: filteredCharacters(),
    teamCounts,
    selectedCharactersCount: selectedCharacters.length,
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
  };
};
