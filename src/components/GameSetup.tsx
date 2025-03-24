
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CharacterType, GameState, ExpansionType } from '@/types';
import CharacterList from './CharacterList';
import { toast } from 'sonner';
import { Play, PackageOpen, RefreshCw } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Expansion packs data
const expansionPacks: ExpansionType[] = [
  {
    id: 'all',
    name: 'Toutes les extensions',
    description: 'Tous les personnages disponibles'
  },
  {
    id: 'base',
    name: 'Jeu de base',
    description: 'Le jeu de base avec les personnages essentiels'
  },
  {
    id: 'new-moon',
    name: 'Nouvelle Lune',
    description: 'Extension avec de nouveaux rôles puissants'
  },
  {
    id: 'characters-pack',
    name: 'Pack de Personnages',
    description: 'Personnages additionnels pour enrichir votre jeu'
  },
  {
    id: 'village',
    name: 'Le Village',
    description: 'Extension centrée sur les villageois spéciaux'
  },
  {
    id: 'bonus',
    name: 'Bonus',
    description: 'Personnages bonus et variantes'
  }
];

// Default character data with expansion information
const defaultCharacters: CharacterType[] = [
  {
    id: 'werewolf',
    name: 'Loup-Garou',
    nameEn: 'Werewolf',
    icon: 'moon',
    description: 'Se réveille la nuit et vote pour éliminer un villageois.',
    team: 'werewolf',
    recommended: true,
    expansion: 'base'
  },
  {
    id: 'villager',
    name: 'Villageois',
    nameEn: 'Villager',
    icon: 'user',
    description: 'Citoyen ordinaire qui vote le jour pour éliminer les loups-garous.',
    team: 'village',
    recommended: true,
    expansion: 'base'
  },
  {
    id: 'seer',
    name: 'Voyante',
    nameEn: 'Seer',
    icon: 'eye',
    description: 'Peut voir l\'identité d\'un joueur chaque nuit.',
    team: 'village',
    recommended: true,
    expansion: 'base'
  },
  {
    id: 'witch',
    name: 'Sorcière',
    nameEn: 'Witch',
    icon: 'flask',
    description: 'Possède une potion de vie et une potion de mort à utiliser pendant la partie.',
    team: 'village',
    expansion: 'base'
  },
  {
    id: 'hunter',
    name: 'Chasseur',
    nameEn: 'Hunter',
    icon: 'crosshair',
    description: 'Peut emporter quelqu\'un avec lui lorsqu\'il meurt.',
    team: 'village',
    expansion: 'base'
  },
  {
    id: 'bodyguard',
    name: 'Garde du Corps',
    nameEn: 'Bodyguard',
    icon: 'shield',
    description: 'Peut protéger un joueur chaque nuit.',
    team: 'village',
    expansion: 'characters-pack'
  },
  {
    id: 'little-girl',
    name: 'Petite Fille',
    nameEn: 'Little Girl',
    icon: 'eye',
    description: 'Peut espionner les loups-garous pendant la nuit.',
    team: 'village',
    expansion: 'new-moon'
  },
  {
    id: 'cupid',
    name: 'Cupidon',
    nameEn: 'Cupid',
    icon: 'heart',
    description: 'Désigne deux amoureux au début de la partie.',
    team: 'village',
    expansion: 'characters-pack'
  },
  {
    id: 'thief',
    name: 'Voleur',
    nameEn: 'Thief',
    icon: 'user',
    description: 'Peut choisir son rôle parmi deux cartes supplémentaires.',
    team: 'village',
    expansion: 'new-moon'
  },
  {
    id: 'white-werewolf',
    name: 'Loup-Garou Blanc',
    nameEn: 'White Werewolf',
    icon: 'moon',
    description: 'Loup-garou qui joue contre les autres loups-garous.',
    team: 'solo',
    expansion: 'bonus'
  },
  {
    id: 'elder',
    name: 'Ancien',
    nameEn: 'Elder',
    icon: 'user',
    description: 'Peut survivre à la première attaque des loups-garous.',
    team: 'village',
    expansion: 'village'
  },
  {
    id: 'medium',
    name: 'Médium',
    nameEn: 'Medium',
    icon: 'message',
    description: 'Peut parler avec les morts pendant la nuit.',
    team: 'village',
    expansion: 'village'
  },
  {
    id: 'big-bad-wolf',
    name: 'Grand Méchant Loup',
    nameEn: 'Big Bad Wolf',
    icon: 'moon',
    description: 'Peut dévorer une victime supplémentaire quand il est seul.',
    team: 'werewolf',
    expansion: 'new-moon'
  },
  {
    id: 'wild-child',
    name: 'Enfant Sauvage',
    nameEn: 'Wild Child',
    icon: 'user',
    description: 'Choisit un modèle et devient loup-garou si ce dernier meurt.',
    team: 'village',
    expansion: 'characters-pack'
  },
  {
    id: 'fox',
    name: 'Renard',
    nameEn: 'Fox',
    icon: 'eye',
    description: 'Peut flairer un groupe de joueurs et savoir s\'il y a un loup parmi eux.',
    team: 'village',
    expansion: 'village'
  },
  {
    id: 'stuttering-judge',
    name: 'Juge Bègue',
    nameEn: 'Stuttering Judge',
    icon: 'user',
    description: 'Peut provoquer un second vote durant la journée.',
    team: 'village',
    expansion: 'characters-pack'
  },
  {
    id: 'two-sisters',
    name: 'Deux Sœurs',
    nameEn: 'Two Sisters',
    icon: 'users',
    description: 'Se réveillent pour se reconnaître et peuvent échanger des informations.',
    team: 'village',
    expansion: 'village'
  },
  {
    id: 'three-brothers',
    name: 'Trois Frères',
    nameEn: 'Three Brothers',
    icon: 'users',
    description: 'Se réveillent pour se reconnaître et peuvent échanger des informations.',
    team: 'village',
    expansion: 'village'
  },
  {
    id: 'pied-piper',
    name: 'Joueur de Flûte',
    nameEn: 'Pied Piper',
    icon: 'user',
    description: 'Enchante des joueurs chaque nuit pour gagner seul.',
    team: 'solo',
    expansion: 'bonus'
  },
  {
    id: 'troublemaker',
    name: 'Troublemaker',
    nameEn: 'Troublemaker',
    icon: 'user',
    description: 'Échange les rôles de deux joueurs pendant la nuit.',
    team: 'village',
    expansion: 'bonus'
  }
];

interface GameSetupProps {
  onStartGame?: (gameState: GameState) => void;
}

const STORAGE_KEY = 'werewolf-game-selection';

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const navigate = useNavigate();
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>(['werewolf', 'villager', 'seer']);
  const [characters] = useState<CharacterType[]>(defaultCharacters);
  const [selectedExpansion, setSelectedExpansion] = useState<string>('all');
  const [characterCounts, setCharacterCounts] = useState<Record<string, number>>({});

  // Load saved character selection on component mount
  useEffect(() => {
    const savedSelection = localStorage.getItem(STORAGE_KEY);
    if (savedSelection) {
      try {
        const savedData = JSON.parse(savedSelection);
        setSelectedCharacters(savedData.selectedCharacters || ['werewolf', 'villager', 'seer']);
        setSelectedExpansion(savedData.selectedExpansion || 'all');
        
        // Calculate character counts from saved selection
        const counts: Record<string, number> = {};
        savedData.selectedCharacters.forEach((id: string) => {
          counts[id] = (counts[id] || 0) + 1;
        });
        setCharacterCounts(counts);
        
        toast.info("Sélection précédente chargée");
      } catch (error) {
        console.error("Error loading saved selection:", error);
      }
    }
  }, []);

  const handleCharacterToggle = (id: string) => {
    setSelectedCharacters(prev => {
      // Check if we already have enough of this character
      const currentCount = characterCounts[id] || 0;
      
      if (prev.includes(id)) {
        // Remove just one instance of this character ID
        const index = prev.indexOf(id);
        const newSelection = [...prev.slice(0, index), ...prev.slice(index + 1)];
        
        // Update count
        setCharacterCounts(counts => ({
          ...counts,
          [id]: Math.max(0, (counts[id] || 0) - 1)
        }));
        
        return newSelection;
      } else {
        // Add this character
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
    setSelectedCharacters(['werewolf', 'villager', 'seer']);
    setSelectedExpansion('all');
    setCharacterCounts({ werewolf: 1, villager: 1, seer: 1 });
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Sélection réinitialisée");
  };

  const filteredCharacters = (): CharacterType[] => {
    if (selectedExpansion === 'all') return characters;
    return characters.filter(char => char.expansion === selectedExpansion);
  };

  const countCharactersByTeam = (team: 'village' | 'werewolf' | 'solo'): number => {
    let count = 0;
    
    // Count all instances of each character in the selected team
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

    // Save selection to localStorage
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
    navigate('/game', { state: gameState });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 p-4">
      {/* Fixed header showing number of selected characters */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100 py-2 shadow-sm">
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

      <section className="glass-card p-6 rounded-xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <PackageOpen className="w-5 h-5 mr-2 text-werewolf-accent" />
          Extensions
        </h2>
        <div className="px-4">
          <Select 
            value={selectedExpansion} 
            onValueChange={handleExpansionChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez une extension" />
            </SelectTrigger>
            <SelectContent>
              {expansionPacks.map((pack) => (
                <SelectItem key={pack.id} value={pack.id}>
                  {pack.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-2 text-sm text-gray-500">
            {expansionPacks.find(pack => pack.id === selectedExpansion)?.description}
          </p>
        </div>
      </section>

      <section className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sélection des Personnages</h2>
          <Button 
            onClick={resetSelection} 
            variant="outline" 
            size="sm"
            className="text-werewolf-accent hover:text-werewolf-accent/90"
          >
            <RefreshCw className="w-4 h-4 mr-1" /> Réinitialiser
          </Button>
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
        />
      </section>

      <div className="flex justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <Button 
          onClick={handleStartGame} 
          className="bg-werewolf-accent hover:bg-werewolf-accent/90 text-white px-8 py-6"
          size="lg"
        >
          <Play className="mr-2 h-5 w-5" /> Lancer la Partie
        </Button>
      </div>
    </div>
  );
};

export default GameSetup;
