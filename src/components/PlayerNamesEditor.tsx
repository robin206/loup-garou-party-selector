
import React, { useState, useEffect } from 'react';
import { CharacterType } from '@/types';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users } from 'lucide-react';
import { toast } from 'sonner';

interface PlayerNamesEditorProps {
  characters: CharacterType[];
  onPlayerNameChange: (characterId: string, name: string) => void;
}

const PlayerNamesEditor: React.FC<PlayerNamesEditorProps> = ({
  characters,
  onPlayerNameChange
}) => {
  const [open, setOpen] = useState(false);
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialNames: Record<string, string> = {};
    characters.forEach(char => {
      initialNames[char.instanceId || char.id] = char.playerName || '';
    });
    setPlayerNames(initialNames);
  }, [characters, open]);

  const handleNameChange = (characterId: string, name: string) => {
    setPlayerNames(prev => ({
      ...prev,
      [characterId]: name
    }));
  };

  const handleSaveAll = () => {
    Object.entries(playerNames).forEach(([characterId, name]) => {
      onPlayerNameChange(characterId, name);
    });
    setOpen(false);
    toast.success("Noms des joueurs enregistrés");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 bg-amber-600 hover:bg-amber-700">
          <Users className="h-4 w-4" /> 
          Assigner les noms des joueurs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Noms des joueurs</DialogTitle>
          <DialogDescription>
            Associez le prénom de chaque joueur à son personnage
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {characters.map(character => (
            <div key={character.instanceId || character.id} className="flex items-center gap-3">
              <div className="w-8 h-8 flex-shrink-0">
                <img 
                  src={character.icon} 
                  alt={character.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-grow">
                <Label htmlFor={`player-${character.instanceId || character.id}`} className="text-sm font-medium">
                  {character.name}
                </Label>
                <Input 
                  id={`player-${character.instanceId || character.id}`}
                  value={playerNames[character.instanceId || character.id] || ''}
                  onChange={(e) => handleNameChange(character.instanceId || character.id, e.target.value)}
                  placeholder="Prénom du joueur"
                  className="mt-1"
                />
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button onClick={handleSaveAll} className="w-full">
            Enregistrer tous les noms
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerNamesEditor;
