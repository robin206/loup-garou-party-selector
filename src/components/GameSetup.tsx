
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { CharacterType, GameState } from '@/types';
import CharacterList from './CharacterList';
import { toast } from 'sonner';
import { Users, Play } from 'lucide-react';

// Default character data
const defaultCharacters: CharacterType[] = [
  {
    id: 'werewolf',
    name: 'Loup-Garou',
    nameEn: 'Werewolf',
    icon: 'moon',
    description: 'Se réveille la nuit et vote pour éliminer un villageois.',
    team: 'werewolf',
    recommended: true
  },
  {
    id: 'villager',
    name: 'Villageois',
    nameEn: 'Villager',
    icon: 'user',
    description: 'Citoyen ordinaire qui vote le jour pour éliminer les loups-garous.',
    team: 'village',
    recommended: true
  },
  {
    id: 'seer',
    name: 'Voyante',
    nameEn: 'Seer',
    icon: 'eye',
    description: 'Peut voir l\'identité d\'un joueur chaque nuit.',
    team: 'village',
    recommended: true
  },
  {
    id: 'witch',
    name: 'Sorcière',
    nameEn: 'Witch',
    icon: 'flask',
    description: 'Possède une potion de vie et une potion de mort à utiliser pendant la partie.',
    team: 'village'
  },
  {
    id: 'hunter',
    name: 'Chasseur',
    nameEn: 'Hunter',
    icon: 'crosshair',
    description: 'Peut emporter quelqu\'un avec lui lorsqu\'il meurt.',
    team: 'village'
  },
  {
    id: 'bodyguard',
    name: 'Garde du Corps',
    nameEn: 'Bodyguard',
    icon: 'shield',
    description: 'Peut protéger un joueur chaque nuit.',
    team: 'village'
  },
  {
    id: 'little-girl',
    name: 'Petite Fille',
    nameEn: 'Little Girl',
    icon: 'eye',
    description: 'Peut espionner les loups-garous pendant la nuit.',
    team: 'village'
  },
  {
    id: 'cupid',
    name: 'Cupidon',
    nameEn: 'Cupid',
    icon: 'heart',
    description: 'Désigne deux amoureux au début de la partie.',
    team: 'village'
  },
  {
    id: 'thief',
    name: 'Voleur',
    nameEn: 'Thief',
    icon: 'user',
    description: 'Peut choisir son rôle parmi deux cartes supplémentaires.',
    team: 'village'
  },
  {
    id: 'white-werewolf',
    name: 'Loup-Garou Blanc',
    nameEn: 'White Werewolf',
    icon: 'moon',
    description: 'Loup-garou qui joue contre les autres loups-garous.',
    team: 'solo'
  },
  {
    id: 'elder',
    name: 'Ancien',
    nameEn: 'Elder',
    icon: 'user',
    description: 'Peut survivre à la première attaque des loups-garous.',
    team: 'village'
  },
  {
    id: 'medium',
    name: 'Médium',
    nameEn: 'Medium',
    icon: 'message',
    description: 'Peut parler avec les morts pendant la nuit.',
    team: 'village'
  }
];

interface GameSetupProps {
  onStartGame?: (gameState: GameState) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const navigate = useNavigate();
  const [playerCount, setPlayerCount] = useState<number>(8);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>(['werewolf', 'villager', 'seer']);
  const [characters] = useState<CharacterType[]>(defaultCharacters);

  const handleCharacterToggle = (id: string) => {
    setSelectedCharacters(prev => {
      if (prev.includes(id)) {
        return prev.filter(charId => charId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handlePlayerCountChange = (value: number[]) => {
    setPlayerCount(value[0]);
  };

  const handleStartGame = () => {
    if (selectedCharacters.length < 3) {
      toast.error("Veuillez sélectionner au moins 3 rôles pour jouer.");
      return;
    }

    if (selectedCharacters.length > playerCount) {
      toast.error(`Vous avez sélectionné plus de rôles (${selectedCharacters.length}) que de joueurs (${playerCount}).`);
      return;
    }

    if (!selectedCharacters.includes('werewolf')) {
      toast.error("Vous devez inclure au moins un Loup-Garou pour jouer.");
      return;
    }

    const gameState: GameState = {
      players: playerCount,
      characters: characters,
      selectedCharacters: selectedCharacters
    };

    if (onStartGame) {
      onStartGame(gameState);
    }

    toast.success("Partie initialisée! Prêt à distribuer les rôles.");
    // In a real application, you might want to navigate to a game page or distribute roles
    navigate('/game', { state: gameState });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 p-4">
      <section className="glass-card p-6 rounded-xl animate-fade-up">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-werewolf-accent" />
          Nombre de Joueurs
        </h2>
        <div className="px-4">
          <Slider 
            defaultValue={[8]} 
            max={24} 
            min={4} 
            step={1} 
            value={[playerCount]}
            onValueChange={handlePlayerCountChange}
            className="mb-6"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">4</span>
            <span className="font-medium text-lg">{playerCount} joueurs</span>
            <span className="text-sm text-gray-500">24</span>
          </div>
        </div>
      </section>

      <section className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xl font-semibold mb-4">Sélection des Personnages</h2>
        <p className="text-sm text-gray-500 mb-6">
          Sélectionnez au moins {Math.min(playerCount, 3)} personnages pour une partie à {playerCount} joueurs. 
          Personnages sélectionnés: {selectedCharacters.length}/{playerCount}
        </p>
        
        <CharacterList 
          characters={characters}
          selectedCharacters={selectedCharacters}
          onCharacterToggle={handleCharacterToggle}
        />
      </section>

      <div className="flex justify-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
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
