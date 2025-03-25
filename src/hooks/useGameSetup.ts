
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CharacterType, GameState, ExpansionType } from '@/types';
import { allCharacters, getExpansions } from '@/data/characters';
import { toast } from 'sonner';

const STORAGE_KEY = 'werewolf-game-selection';

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

  useEffect(() => {
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
    setSelectedCharacters(prev => {
      const currentCount = characterCounts[id] || 0;
      if (prev.includes(id)) {
        const index = prev.indexOf(id);
        const newSelection = [...prev.slice(0, index), ...prev.slice(index + 1)];
        setCharacterCounts(counts => ({
          ...counts,
          [id]: Math.max(0, (counts[id] || 0) - 1)
        }));
        return newSelection;
      } else {
        setCharacterCounts(counts => ({
          ...counts,
          [id]: (counts[id] || 0) + 1
        }));
        return [...prev, id];
      }
    });
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
    handleExpansionChange,
    resetSelection,
    toggleViewMode,
    handleStartGame
  };
};
