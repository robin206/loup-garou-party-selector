
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PlayerNameInputProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
}

const PlayerNameInput: React.FC<PlayerNameInputProps> = ({ 
  playerName, 
  onPlayerNameChange 
}) => {
  const [inputPlayerName, setInputPlayerName] = useState(playerName);
  
  useEffect(() => {
    setInputPlayerName(playerName);
  }, [playerName]);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPlayerName(e.target.value);
  };

  const savePlayerName = () => {
    onPlayerNameChange(inputPlayerName);
  };
  
  return (
    <div>
      <Label htmlFor="playerName" className="text-sm font-medium flex items-center gap-1">
        <User className="h-4 w-4" /> Prénom du joueur:
      </Label>
      <div className="flex items-center gap-2 mt-1">
        <Input 
          id="playerName"
          value={inputPlayerName} 
          onChange={handleNameChange}
          placeholder="Entrez le prénom du joueur"
          className="text-sm"
        />
        <Button size="sm" variant="secondary" onClick={savePlayerName}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default PlayerNameInput;
