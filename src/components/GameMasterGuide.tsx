import React from 'react';
import { GamePhase, CharacterType } from '@/types';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Crown, SkullIcon, ArrowRight, Users, MessagesSquare, Vote, UserX } from 'lucide-react';
import Timer from './Timer';
import { AudioPhaseControls } from './AudioPhaseControls';
import { ActionStepList, ActionStep } from './ActionStepList';
import { PhaseFooter } from './PhaseFooter';
import { countRemainingSteps } from '@/lib/stepProgress';

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
            <p className="mb-4">1. Distribuez les cartes aux joueurs.</p>
            <p className="mb-4">2. Demandez à chaque joueur de consulter son rôle discrètement.</p>
            
            <Button onClick={() => onPhaseChange('firstDay')} className="bg-werewolf-accent hover:bg-werewolf-accent/90 w-full mt-4">
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
            <p className="mb-4 text-slate-100">Demandez à tous les joueurs de fermer les yeux.</p>
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
            <p className="mb-4">La partie est terminée !</p>
            <p className="mb-4">Annoncez les gagnants et dévoilez les rôles de chaque joueur.</p>
            <Button onClick={() => onPhaseChange('setup')} className="bg-werewolf-accent hover:bg-werewolf-accent/90 w-full mt-4">
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

  const getPhaseIcon = () => {
    switch (phase) {
      case 'firstDay':
      case 'day':
        return <Sun className="h-8 w-8 text-amber-500" />;
      case 'firstNight':
      case 'night':
        return <Moon className="h-8 w-8 text-indigo-500" />;
      case 'setup':
        return <Crown className="h-8 w-8 text-werewolf-accent" />;
      case 'gameEnd':
        return <SkullIcon className="h-8 w-8 text-gray-500" />;
      default:
        return null;
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
    return <div className="flex justify-around text-sm mb-4 p-2 rounded-lg bg-gray-50">
        <div className="text-center">
          <span className="font-medium text-blue-600">Village: </span>
          <span className="text-zinc-950">{teamCounts.village}</span>
        </div>
        <div className="text-center">
          <span className="font-medium text-werewolf-blood">Loups: </span>
          <span className="text-zinc-950">{teamCounts.werewolf}</span>
        </div>
        {teamCounts.solo > 0 && <div className="text-center">
            <span className="font-medium text-amber-600">Solo: </span>
            <span className="text-zinc-950">{teamCounts.solo}</span>
          </div>}
      </div>;
  };

  return <div className="glass-card p-6 rounded-xl w-full max-w-md sm:max-w-[600px] animate-scale-in">
      <div className="flex items-center mb-4">
        {getPhaseIcon()}
        <h2 className="text-xl font-bold ml-2">{getPhaseTitle()}</h2>
      </div>
      
      {getCurrentTeamCounts()}
      
      <div className="prose prose-sm">
        {getPhaseInstructions()}
      </div>
    </div>;
};

export default GameMasterGuide;
