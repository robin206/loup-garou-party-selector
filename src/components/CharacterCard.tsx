
import React from 'react';
import { Moon, User, Users, ShieldCheck, Flask, Crosshair, Heart, Eye, MessageCircle } from 'lucide-react';
import { CharacterType } from '@/types';
import { cn } from '@/lib/utils';

interface CharacterCardProps {
  character: CharacterType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const getIconByName = (iconName: string) => {
  switch (iconName) {
    case 'moon': return <Moon className="h-8 w-8 text-werewolf-accent" />;
    case 'user': return <User className="h-8 w-8 text-werewolf-400" />;
    case 'users': return <Users className="h-8 w-8 text-werewolf-400" />;
    case 'shield': return <ShieldCheck className="h-8 w-8 text-werewolf-400" />;
    case 'flask': return <Flask className="h-8 w-8 text-werewolf-400" />;
    case 'crosshair': return <Crosshair className="h-8 w-8 text-werewolf-400" />;
    case 'heart': return <Heart className="h-8 w-8 text-werewolf-400" />;
    case 'eye': return <Eye className="h-8 w-8 text-werewolf-400" />;
    case 'message': return <MessageCircle className="h-8 w-8 text-werewolf-400" />;
    default: return <User className="h-8 w-8 text-werewolf-400" />;
  }
};

const CharacterCard: React.FC<CharacterCardProps> = ({ character, isSelected, onSelect }) => {
  const getTeamColor = (team: string): string => {
    switch (team) {
      case 'werewolf': return 'from-werewolf-blood/10 to-werewolf-blood/20';
      case 'village': return 'from-blue-500/10 to-blue-500/20';
      case 'solo': return 'from-amber-500/10 to-amber-500/20';
      default: return 'from-gray-500/10 to-gray-500/20';
    }
  };

  return (
    <div 
      className={cn(
        "character-card glass-card animate-scale-in",
        isSelected && "selected ring-2 ring-werewolf-accent"
      )}
      onClick={() => onSelect(character.id)}
    >
      <div className={cn("character-card-image", getTeamColor(character.team))}>
        {getIconByName(character.icon)}
      </div>
      <h3 className="text-sm font-semibold mb-1">{character.name}</h3>
      <p className="text-xs text-gray-500 text-center leading-tight">
        {character.description.length > 70 
          ? `${character.description.substring(0, 70)}...` 
          : character.description
        }
      </p>
      {character.recommended && (
        <span className="mt-2 px-2 py-0.5 bg-werewolf-accent/10 text-werewolf-accent rounded-full text-xs font-medium">
          Recommandé
        </span>
      )}
    </div>
  );
};

export default CharacterCard;
