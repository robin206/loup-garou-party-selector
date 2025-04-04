
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CharacterRule } from "@/data/characterRules";

interface CharacterRuleCardProps {
  character: CharacterRule;
}

const CharacterRuleCard: React.FC<CharacterRuleCardProps> = ({ character }) => {
  return (
    <div id={character.id} className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex gap-4 items-start">
        <Avatar className="h-16 w-16 shrink-0">
          <AvatarImage src={character.image} alt={character.name} />
          <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg mb-2">{character.name}</h3>
          <div 
            className="text-sm text-gray-700 prose-sm prose"
            dangerouslySetInnerHTML={{ __html: character.description }}
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterRuleCard;
