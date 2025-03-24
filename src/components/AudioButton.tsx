
import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AudioButtonProps {
  label: string;
  playMusic: () => void;
  stopMusic: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const AudioButton: React.FC<AudioButtonProps> = ({ 
  label, 
  playMusic, 
  stopMusic, 
  className = '',
  variant = "outline"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleTogglePlay = () => {
    if (isPlaying) {
      stopMusic();
      setIsPlaying(false);
    } else {
      playMusic();
      setIsPlaying(true);
    }
  };
  
  return (
    <Button 
      variant={variant} 
      onClick={handleTogglePlay}
      className={`flex items-center gap-2 ${className}`}
    >
      {isPlaying ? (
        <>
          <Pause className="h-4 w-4" />
          <span>{label}</span>
          <Badge 
            variant="secondary" 
            className="ml-1 animate-pulse bg-green-100 text-green-800"
          >
            En cours
          </Badge>
        </>
      ) : (
        <>
          <Play className="h-4 w-4" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
};

export default AudioButton;
