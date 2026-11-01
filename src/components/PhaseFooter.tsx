import React, { useEffect, useState } from 'react';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PhaseFooterProps {
  nextLabel: string;
  NextIcon: LucideIcon;
  onNext: () => void;
  /** Nombre d'étapes non cochées dans la phase */
  remainingSteps: number;
  onBack?: () => void;
  backLabel?: string;
}

/**
 * Boutons de bas de phase. Le bouton suivant est gris tant qu'il reste des étapes,
 * vert quand tout est coché. S'il reste des étapes, un premier clic avertit
 * et un second clic passe quand même.
 */
export const PhaseFooter: React.FC<PhaseFooterProps> = ({
  nextLabel,
  NextIcon,
  onNext,
  remainingSteps,
  onBack,
  backLabel = 'Retour préparation'
}) => {
  const [armed, setArmed] = useState(false);
  const allDone = remainingSteps === 0;

  // Toute coche ou décoche annule l'avertissement en cours
  useEffect(() => {
    setArmed(false);
  }, [remainingSteps]);

  const handleNext = () => {
    if (allDone || armed) {
      setArmed(false);
      onNext();
      return;
    }
    setArmed(true);
  };

  return (
    <div className="not-prose">
      <div className="grid grid-cols-2 gap-2">
        {onBack && (
          <Button onClick={onBack} variant="outline" className="w-full mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> {backLabel}
          </Button>
        )}
        <Button
          data-keep-color
          onClick={handleNext}
          className={cn(
            'w-full mt-4 text-white transition-colors duration-200 h-auto min-h-10 whitespace-normal',
            !onBack && 'col-span-2',
            allDone ? 'bg-green-600 hover:bg-green-500' : armed ? 'bg-amber-600 hover:bg-amber-500' : 'bg-zinc-700 hover:bg-zinc-600'
          )}
        >
          {armed ? 'Passer quand même' : nextLabel}
          {!allDone && !armed && ` (${remainingSteps})`}
          <NextIcon className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </div>
      {armed && (
        <p className="text-sm text-amber-400 text-center mt-2 mb-0">
          Il reste {remainingSteps} étape{remainingSteps > 1 ? 's' : ''} non cochée{remainingSteps > 1 ? 's' : ''}. Clique à nouveau pour passer quand même.
        </p>
      )}
    </div>
  );
};

export default PhaseFooter;
