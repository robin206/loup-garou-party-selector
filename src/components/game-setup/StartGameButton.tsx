
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface StartGameButtonProps {
  onClick: () => void;
}

const StartGameButton: React.FC<StartGameButtonProps> = ({ onClick }) => {
  return (
    <div className="flex justify-center animate-fade-up" style={{
      animationDelay: '0.3s'
    }}>
      <Button 
        onClick={onClick} 
        className="bg-werewolf-accent hover:bg-werewolf-accent/90 text-white px-8 py-6" 
        size="lg"
      >
        <Play className="mr-2 h-5 w-5" /> Lancer la Partie
      </Button>
    </div>
  );
};

export default StartGameButton;
