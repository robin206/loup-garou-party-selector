
import React from 'react';
import { ExpansionType } from '@/types';
import { PackageOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExpansionSelectorProps {
  selectedExpansion: string;
  expansionPacks: ExpansionType[];
  onExpansionChange: (value: string) => void;
}

const ExpansionSelector: React.FC<ExpansionSelectorProps> = ({
  selectedExpansion,
  expansionPacks,
  onExpansionChange
}) => {
  return (
    <section className="glass-card p-6 rounded-xl animate-fade-up" style={{
      animationDelay: '0.1s'
    }}>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <PackageOpen className="w-5 h-5 mr-2 text-werewolf-accent" />
        Extensions
      </h2>
      <div className="px-4">
        <Select value={selectedExpansion} onValueChange={onExpansionChange}>
          <SelectTrigger className="w-full text-black">
            <SelectValue placeholder="Sélectionnez une extension" />
          </SelectTrigger>
          <SelectContent>
            {expansionPacks.map(pack => (
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
  );
};

export default ExpansionSelector;
