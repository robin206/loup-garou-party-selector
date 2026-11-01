import React from 'react';
import { Check, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentStepIndex } from '@/lib/stepProgress';

export interface ActionStep {
  id: string;
  title: string;
  description?: string;
  /** Chemin d'un picto de personnage (ex. /img/perso_loup.svg) */
  iconSrc?: string;
  /** Icône lucide pour les étapes sans personnage */
  Icon?: LucideIcon;
}

interface ActionStepListProps {
  title: string;
  steps: ActionStep[];
  completedSteps: string[];
  onToggleStep: (stepId: string) => void;
}

/**
 * Frise d'étapes à cocher : grise à venir, rouge en cours, verte faite.
 * Toute la ligne est cliquable pour être utilisable dans le noir.
 */
export const ActionStepList: React.FC<ActionStepListProps> = ({
  title,
  steps,
  completedSteps,
  onToggleStep
}) => {
  if (steps.length === 0) return null;

  const currentIndex = getCurrentStepIndex(steps.map(s => s.id), completedSteps);
  const doneCount = steps.filter(s => completedSteps.includes(s.id)).length;
  const progress = Math.round((doneCount / steps.length) * 100);

  return (
    <div className="not-prose mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-100 text-base m-0">{title}</h3>
        <span className="text-sm text-gray-400 tabular-nums">{doneCount} / {steps.length}</span>
      </div>
      <div className="h-1 bg-zinc-800 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div>
        {steps.map((step, index) => {
          const done = completedSteps.includes(step.id);
          const current = index === currentIndex;
          const isLast = index === steps.length - 1;
          const Icon = step.Icon;

          return (
            <button
              key={step.id}
              type="button"
              role="checkbox"
              aria-checked={done}
              onClick={() => onToggleStep(step.id)}
              className="flex w-full gap-3 text-left select-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg"
            >
              {/* Numéro et trait de la frise */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-xl font-bold transition-colors duration-200',
                    done && 'bg-green-600 text-white',
                    !done && current && 'bg-werewolf-accent text-white',
                    !done && !current && 'bg-zinc-800 border-2 border-zinc-600 text-gray-400'
                  )}
                >
                  {done ? <Check className="h-5 w-5" strokeWidth={3} /> : index + 1}
                </div>
                {!isLast && (
                  <div className={cn('w-0.5 flex-1 min-h-[12px] my-1 transition-colors duration-200', done ? 'bg-green-600' : 'bg-zinc-700')} />
                )}
              </div>

              {/* Contenu de l'étape */}
              <div
                className={cn(
                  'flex flex-1 items-start gap-3 rounded-xl border px-3 py-2 mb-3 transition-all duration-200',
                  done && 'bg-green-600/10 border-green-600 opacity-80',
                  !done && current && 'bg-zinc-950 border-werewolf-accent',
                  !done && !current && 'bg-zinc-950 border-zinc-800'
                )}
              >
                <div className="h-10 w-10 shrink-0 flex items-center justify-center">
                  {step.iconSrc ? (
                    <img src={step.iconSrc} alt="" className="h-10 w-10 object-contain" />
                  ) : Icon ? (
                    <Icon className="h-6 w-6 text-gray-300" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn('font-medium', done ? 'text-green-300' : 'text-white')}>{step.title}</div>
                  {step.description && (
                    <div className="text-sm text-gray-300 leading-snug">{step.description}</div>
                  )}
                </div>
                <div
                  className={cn(
                    'mt-1 h-6 w-6 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors duration-200',
                    done ? 'bg-green-600 border-green-600 text-white' : 'border-zinc-600 text-transparent'
                  )}
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ActionStepList;
