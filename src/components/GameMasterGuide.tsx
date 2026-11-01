import React from 'react';
import { GamePhase, CharacterType } from '@/types';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Crown, SkullIcon, ArrowRight, Users, MessagesSquare, Vote, UserX } from 'lucide-react';
import Timer from './Timer';
import { AudioPhaseControls } from './AudioPhaseControls';
import { ActionStepList, ActionStep } from './ActionStepList';
import { PhaseFooter } from './PhaseFooter';
import { countRemainingSteps } from '@/lib/stepProgress';
import { cn } from '@/lib/utils';

interface GameMasterGuideProps {
  characters: CharacterType[];
  phase: GamePhase;
  onPhaseChange: (phase: GamePhase) => void;
  dayCount: number;
  aliveCharacters?: string[];
  onReturnToSetup?: () => void;
  /** Identifiants des étapes cochées dans la phase en cours */
  completedSteps?: string[];
  onToggleStep?: (stepId: string) => void;
}

const GameMasterGuide: React.FC<GameMasterGuideProps> = ({
  characters,
  phase,
  onPhaseChange,
  dayCount,
  aliveCharacters = [],
  onReturnToSetup,
  completedSteps = [],
  onToggleStep = () => {}
}) => {
  const characterToStep = (char: CharacterType): ActionStep => {
    const hasPicto = typeof char.icon === 'string' && char.icon.startsWith('/');
    return {
      id: `char:${char.id}`,
      title: char.name,
      description: char.actionDescription || `Action de ${char.name}`,
      iconSrc: hasPicto ? char.icon : undefined,
      Icon: hasPicto ? undefined : Users
    };
  };

  const remainingOf = (steps: ActionStep[]) => countRemainingSteps(steps.map(step => step.id), completedSteps);

  const getPhaseTitle = () => {
    switch (phase) {
      case 'setup':
        return 'Préparation de la partie';
      case 'firstDay':
        return 'Premier jour - Élection du maire';
      case 'firstNight':
        return 'Première nuit';
      case 'day':
        return `Jour ${dayCount}`;
      case 'night':
        return `Nuit ${dayCount}`;
      case 'gameEnd':
        return 'Fin de la partie';
      default:
        return 'Phase inconnue';
    }
  };

  const getPhaseInstructions = () => {
    switch (phase) {
      case 'setup':
        return <div>
            <ol className="space-y-2 mb-2">
              {['Distribuez les cartes aux joueurs.', 'Demandez à chaque joueur de consulter son rôle discrètement.'].map((text, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <span className="h-7 w-7 shrink-0 rounded-full bg-werewolf-accent/15 text-werewolf-accent font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-gray-200 pt-0.5">{text}</span>
                </li>
              ))}
            </ol>
            <Button onClick={() => onPhaseChange('firstDay')} size="lg" className="btn-primary-blood w-full mt-4">
              Commencer le premier jour <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>;
      case 'firstDay': {
        const steps: ActionStep[] = [
          { id: 'day:wake', title: 'Réveil du village', description: "Demandez à tous les joueurs d'ouvrir les yeux.", Icon: Sun },
          { id: 'day:mayor-election', title: 'Élection du maire', description: "Chaque joueur peut se présenter en 30 secondes, puis procédez au vote. Le maire aura une voix prépondérante en cas d'égalité.", iconSrc: '/img/perso_maire.svg' },
          { id: 'day:mayor-announce', title: 'Annonce du maire', description: 'Annoncez le maire élu.', Icon: Crown }
        ];
        return <div>
            <AudioPhaseControls />
            <div className="mb-4">
              <Timer defaultMinutes={5} />
            </div>
            <ActionStepList title="Déroulé du premier jour" steps={steps} completedSteps={completedSteps} onToggleStep={onToggleStep} />
            <PhaseFooter
              nextLabel="Première nuit"
              NextIcon={Moon}
              onNext={() => onPhaseChange('firstNight')}
              remainingSteps={remainingOf(steps)}
              onBack={onReturnToSetup}
              backLabel="Préparation"
            />
          </div>;
      }
      case 'firstNight':
      case 'night': {
        const isFirstNight = phase === 'firstNight';
        const steps = getOrderedCharacterActions(characters, 'night', isFirstNight, aliveCharacters).map(characterToStep);
        return <div>
            <AudioPhaseControls />
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-indigo-400/25 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-100">
              <Moon className="h-4 w-4 shrink-0 text-indigo-300" />
              Demandez à tous les joueurs de fermer les yeux.
            </div>
            <ActionStepList title="Actions à effectuer dans l'ordre" steps={steps} completedSteps={completedSteps} onToggleStep={onToggleStep} />
            <PhaseFooter
              nextLabel={isFirstNight ? 'Jour suivant' : 'Passer au jour suivant'}
              NextIcon={Sun}
              onNext={() => onPhaseChange('day')}
              remainingSteps={remainingOf(steps)}
              onBack={onReturnToSetup}
            />
          </div>;
      }
      case 'day': {
        const dayActions = getOrderedCharacterActions(characters, 'day', false, aliveCharacters);
        const servantAlive = dayActions.some(char => char.id === 'devoted-servant');
        const steps: ActionStep[] = [
          { id: 'day:victims', title: 'Victimes de la nuit', description: "Annoncez les victimes de la nuit, s'il y en a.", Icon: SkullIcon },
          { id: 'day:debate', title: 'Débat', description: 'Laissez les joueurs débattre pour trouver les Loups-Garous.', Icon: MessagesSquare },
          ...dayActions.filter(char => char.id !== 'devoted-servant').map(characterToStep),
          { id: 'day:vote', title: 'Vote', description: 'Procédez au vote pour éliminer un joueur.', Icon: Vote },
          { id: 'day:eliminated', title: 'Annonce du joueur éliminé', description: 'Annoncez le joueur éliminé, sans révéler son rôle.', Icon: UserX }
        ];
        if (servantAlive) {
          steps.push({
            id: 'char:devoted-servant',
            title: 'Servante dévouée',
            description: 'Demandez-lui discrètement si elle souhaite échanger son rôle avec le joueur éliminé.',
            iconSrc: '/img/perso_servante.svg'
          });
        }
        return <div>
            <AudioPhaseControls />
            <div className="mb-4">
              <Timer defaultMinutes={5} />
            </div>
            <ActionStepList title="Déroulé du jour" steps={steps} completedSteps={completedSteps} onToggleStep={onToggleStep} />
            <PhaseFooter
              nextLabel="Nuit"
              NextIcon={Moon}
              onNext={() => onPhaseChange('night')}
              remainingSteps={remainingOf(steps)}
              onBack={onReturnToSetup}
            />
          </div>;
      }
      case 'gameEnd':
        return <div>
            <p className="mb-2 text-gray-200">La partie est terminée !</p>
            <p className="mb-4 text-gray-400">Annoncez les gagnants et dévoilez les rôles de chaque joueur.</p>
            <Button onClick={() => onPhaseChange('setup')} size="lg" className="btn-primary-blood w-full mt-4">
              Commencer une nouvelle partie <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>;
      default:
        return <p>Instructions non disponibles</p>;
    }
  };

  const getOrderedCharacterActions = (chars: CharacterType[], phase: 'night' | 'day', isFirstNight: boolean = false, aliveChars: string[] = []) => {
    const uniqueCharIds = new Set<string>();
    const uniqueChars: CharacterType[] = [];
    chars.forEach(char => {
      if (uniqueCharIds.has(char.id)) return;
      const isAlive = aliveChars.includes(char.instanceId || char.id);
      if (!isAlive) return;
      if (char.actionPhase !== phase) return;
      const isFirstNightOnly = char.id === 'cupid' || char.id === 'wild-child' || char.id === 'thief';
      if (!isFirstNight && isFirstNightOnly) return;
      uniqueCharIds.add(char.id);
      uniqueChars.push(char);
    });
    return uniqueChars.sort((a, b) => (a.actionOrder || 999) - (b.actionOrder || 999));
  };

  /** Habillage de la phase : icône, couleur de la pastille et lueur en haut de la carte */
  const getPhaseTheme = () => {
    switch (phase) {
      case 'firstDay':
      case 'day':
        return { Icon: Sun, bubble: 'bg-amber-500/15 text-amber-400', glow: 'from-amber-500/15', label: 'Le village se réveille' };
      case 'firstNight':
      case 'night':
        return { Icon: Moon, bubble: 'bg-indigo-500/20 text-indigo-300', glow: 'from-indigo-500/20', label: "Le village s'endort" };
      case 'gameEnd':
        return { Icon: SkullIcon, bubble: 'bg-white/10 text-gray-300', glow: 'from-white/5', label: 'Partie terminée' };
      case 'setup':
      default:
        return { Icon: Crown, bubble: 'bg-werewolf-accent/15 text-werewolf-accent', glow: 'from-werewolf-accent/15', label: 'Avant la partie' };
    }
  };

  const getCurrentTeamCounts = () => {
    const teamCounts: Record<string, number> = {
      village: 0,
      werewolf: 0,
      solo: 0
    };
    characters.forEach(char => {
      const isAlive = aliveCharacters.includes(char.instanceId || char.id);
      if (isAlive) {
        teamCounts[char.team]++;
      }
    });
    const chip = 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium';
    return <div className="flex flex-wrap gap-2 mb-5">
        <span className={cn(chip, 'border-sky-500/30 bg-sky-500/10 text-sky-300')}>
          Village <span className="font-bold text-white tabular-nums">{teamCounts.village}</span>
        </span>
        <span className={cn(chip, 'border-werewolf-accent/30 bg-werewolf-accent/10 text-werewolf-accent')}>
          Loups <span className="font-bold text-white tabular-nums">{teamCounts.werewolf}</span>
        </span>
        {teamCounts.solo > 0 && <span className={cn(chip, 'border-amber-500/30 bg-amber-500/10 text-amber-400')}>
            Solo <span className="font-bold text-white tabular-nums">{teamCounts.solo}</span>
          </span>}
      </div>;
  };

  const theme = getPhaseTheme();
  const PhaseIcon = theme.Icon;

  return <div className="glass-card relative overflow-hidden p-6 rounded-2xl w-full max-w-md sm:max-w-[600px] animate-scale-in">
      {/* Lueur colorée selon la phase, rappel de l'ambiance lumineuse */}
      <div className={cn('pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b to-transparent', theme.glow)} aria-hidden="true" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn('h-12 w-12 shrink-0 rounded-full flex items-center justify-center', theme.bubble)}>
            <PhaseIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-widest text-gray-400">{theme.label}</div>
            <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">{getPhaseTitle()}</h2>
          </div>
        </div>

        {getCurrentTeamCounts()}

        <div>
          {getPhaseInstructions()}
        </div>
      </div>
    </div>;
};

export default GameMasterGuide;
