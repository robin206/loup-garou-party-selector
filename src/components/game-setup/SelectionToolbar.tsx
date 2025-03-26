
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

interface SelectionToolbarProps {
  viewMode: 'detailed' | 'simple';
  onToggleViewMode: () => void;
  onResetSelection: () => void;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  viewMode,
  onToggleViewMode,
  onResetSelection
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Sélection des Personnages</h2>
      <div className="flex space-x-2">
        <Button 
          onClick={onToggleViewMode} 
          variant="outline" 
          size="sm" 
          className="text-werewolf-accent hover:text-werewolf-accent/90"
        >
          {viewMode === 'detailed' ? (
            <>
              <EyeOff className="w-4 h-4 mr-1" /> Vue Simple
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-1" /> Vue Détaillée
            </>
          )}
        </Button>
        <Button 
          onClick={onResetSelection} 
          variant="outline" 
          size="sm" 
          className="text-werewolf-accent hover:text-werewolf-accent/90"
        >
          <RefreshCw className="w-4 h-4 mr-1" /> Réinitialiser
        </Button>
      </div>
    </div>
  );
};

export default SelectionToolbar;
