import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CharacterType, GameState, ExpansionType } from '@/types';
import CharacterList from './CharacterList';
import { toast } from 'sonner';
import { Play, PackageOpen, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allCharacters, getExpansions } from '@/data/characters';

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

interface GameSetupProps {
  onStartGame?: (gameState: GameState) => void;
}
const STORAGE_KEY = 'werewolf-game-selection';
const GameSetup: React.FC<GameSetupProps> = ({
  onStartGame
}) => {
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
    setCharacterCounts({
      werewolf: 0,
      villager: 0,
      seer: 0
    });
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

  return <div className="w-full max-w-4xl mx-auto space-y-10 p-4">
      <div className="fixed top-16 left-0 right-0 z-40 backdrop-blur-sm border-b border-gray-100 py-2 shadow-sm bg-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="font-medium">
              <span className="text-werewolf-accent">{selectedCharacters.length}</span> personnages sélectionnés
            </div>
            <div className="text-sm">
              <span className="text-werewolf-accent">{countCharactersByTeam('werewolf')}</span> loups-garous | 
              <span className="text-werewolf-accent ml-1">{countCharactersByTeam('village')}</span> villageois | 
              <span className="text-werewolf-accent ml-1">{countCharactersByTeam('solo')}</span> solitaires
            </div>
          </div>
        </div>
      </div>

      <section className="glass-card p-6 rounded-xl animate-fade-up" style={{
      animationDelay: '0.1s'
    }}>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <PackageOpen className="w-5 h-5 mr-2 text-werewolf-accent" />
          Extensions
        </h2>
        <div className="px-4">
          <Select value={selectedExpansion} onValueChange={handleExpansionChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez une extension" />
            </SelectTrigger>
            <SelectContent>
              {expansionPacks.map(pack => <SelectItem key={pack.id} value={pack.id}>
                  {pack.name}
                </SelectItem>)}
            </SelectContent>
          </Select>
          <p className="mt-2 text-sm text-gray-500">
            {expansionPacks.find(pack => pack.id === selectedExpansion)?.description}
          </p>
        </div>
      </section>

      <section className="animate-fade-up" style={{
      animationDelay: '0.2s'
    }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sélection des Personnages</h2>
          <div className="flex space-x-2">
            <Button 
              onClick={toggleViewMode} 
              variant="outline" 
              size="sm" 
              className="text-werewolf-accent hover:text-werewolf-accent/90"
            >
              {viewMode === 'detailed' ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" /> Vue Simple
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" /> Vue Détaillée
                </>
              )}
            </Button>
            <Button onClick={resetSelection} variant="outline" size="sm" className="text-werewolf-accent hover:text-werewolf-accent/90">
              <RefreshCw className="w-4 h-4 mr-1" /> Réinitialiser
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Sélectionnez au moins 3 personnages pour jouer.
          <br />
          <strong>Vous pouvez sélectionner plusieurs villageois et plusieurs loups-garous.</strong>
        </p>
        
        <CharacterList 
          characters={filteredCharacters()} 
          selectedCharacters={selectedCharacters} 
          onCharacterToggle={handleCharacterToggle} 
          getSelectedCount={getSelectedCharacterCount}
          viewMode={viewMode}
        />
      </section>

      <div className="flex justify-center animate-fade-up" style={{
      animationDelay: '0.3s'
    }}>
        <Button onClick={handleStartGame} className="bg-werewolf-accent hover:bg-werewolf-accent/90 text-white px-8 py-6" size="lg">
          <Play className="mr-2 h-5 w-5" /> Lancer la Partie
        </Button>
      </div>
    </div>;
};
export default GameSetup;
