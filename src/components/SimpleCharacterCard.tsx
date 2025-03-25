
import React from 'react';
import { Moon, User, Users, ShieldCheck, Beaker, Crosshair, Heart, Eye, MessageCircle } from 'lucide-react';
import { CharacterType } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SimpleCharacterCardProps {
  character: CharacterType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  selectedCount: number;
}

const getIconByName = (iconName: string) => {
  switch (iconName) {
    case 'moon': return <Moon className="h-6 w-6 text-werewolf-accent" />;
    case 'user': return <User className="h-6 w-6 text-werewolf-400" />;
    case 'users': return <Users className="h-6 w-6 text-werewolf-400" />;
    case 'shield': return <ShieldCheck className="h-6 w-6 text-werewolf-400" />;
    case 'flask': return <Beaker className="h-6 w-6 text-werewolf-400" />;
    case 'crosshair': return <Crosshair className="h-6 w-6 text-werewolf-400" />;
    case 'heart': return <Heart className="h-6 w-6 text-werewolf-400" />;
    case 'eye': return <Eye className="h-6 w-6 text-werewolf-400" />;
    case 'message': return <MessageCircle className="h-6 w-6 text-werewolf-400" />;
    default: return <User className="h-6 w-6 text-werewolf-400" />;
  }
};

const SimpleCharacterCard: React.FC<SimpleCharacterCardProps> = ({ 
  character, 
  isSelected, 
  onSelect,
  selectedCount 
}) => {
  return (
    <div 
      className={cn(
        "simple-character-card p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer transition-all",
        "hover:shadow-md hover:-translate-y-1 flex flex-col items-center gap-2",
        isSelected && "ring-2 ring-werewolf-accent bg-werewolf-accent/5"
      )}
      onClick={() => onSelect(character.id)}
    >
      <div className="character-icon w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
        {getIconByName(character.icon)}
      </div>
      
      <h3 className="text-sm font-medium text-center">{character.name}</h3>
      
      {isSelected && selectedCount > 0 && (
        <Badge variant="secondary" className="absolute -top-2 -right-2 bg-werewolf-accent text-white">
          {selectedCount}
        </Badge>
      )}
    </div>
  );
};

export default SimpleCharacterCard;
