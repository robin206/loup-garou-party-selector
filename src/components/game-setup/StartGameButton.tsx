
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlayIcon, ArrowRight, ArrowRightFromLine } from "lucide-react";

interface StartGameButtonProps {
  onStartGame: () => void;
  hasActiveGame?: boolean;
  onContinueGame?: () => void;
  disabled?: boolean;
  playersCount: number;
}

const StartGameButton = ({ 
  onStartGame, 
  hasActiveGame, 
  onContinueGame, 
  disabled, 
  playersCount 
}: StartGameButtonProps) => {
  return (
    <div className="mt-6 space-y-3">
      {hasActiveGame && onContinueGame && (
        <Button
          className="w-full flex items-center justify-center shadow-lg"
          onClick={onContinueGame}
          size="lg"
          variant="outline"
        >
          <ArrowRightFromLine className="mr-2 h-5 w-5" />
          Reprendre la partie en cours
        </Button>
      )}
      
      <Button
        className="w-full flex items-center justify-center bg-gradient-to-r from-werewolf-blood to-werewolf-dark shadow-lg"
        onClick={onStartGame}
        size="lg"
        disabled={disabled}
      >
        <PlayIcon className="mr-2 h-5 w-5" />
        Commencer une nouvelle partie
        <span className="opacity-70 ml-1">({playersCount} joueurs)</span>
      </Button>
    </div>
  );
};

export default StartGameButton;
