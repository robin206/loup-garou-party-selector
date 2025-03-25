import React from 'react';
import { GamePhase, CharacterType } from '@/types';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Crown, SkullIcon, ArrowRight, Users } from 'lucide-react';
import AudioButton from './AudioButton';
import { useAudio } from '@/hooks/useAudio';
interface GameMasterGuideProps {
  characters: CharacterType[];
  phase: GamePhase;
  onPhaseChange: (phase: GamePhase) => void;
  dayCount: number;
}
const GameMasterGuide: React.FC<GameMasterGuideProps> = ({
  characters,
  phase,
  onPhaseChange,
  dayCount
}) => {
  const {
    playDayMusic,
    playNightMusic,
    playVoteMusic,
    stopMusic
  } = useAudio();
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
            <p className="mb-4">3. Demandez à tous les joueurs de fermer les yeux.</p>
            <Button onClick={() => onPhaseChange('firstDay')} className="bg-werewolf-accent hover:bg-werewolf-accent/90 w-full mt-4">
              Commencer le premier jour <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>;
      case 'firstDay':
        return <div>
            <div className="mb-4 flex gap-2">
              <AudioButton label="Ambiance Jour" playMusic={playDayMusic} stopMusic={stopMusic} />
              <AudioButton label="Ambiance Vote" playMusic={playVoteMusic} stopMusic={stopMusic} />
            </div>
            <p className="mb-4">1. Demandez à tous les joueurs d'ouvrir les yeux.</p>
            <p className="mb-4">2. Annoncez l'élection du maire :</p>
            <ul className="list-disc list-inside mb-4 pl-4">
              <li>Chaque joueur peut se présenter en 30 secondes</li>
              <li>Procédez au vote (le maire aura une voix prépondérante en cas d'égalité)</li>
            </ul>
            <p className="mb-4">3. Annoncez le maire élu.</p>
            <Button onClick={() => onPhaseChange('firstNight')} className="bg-werewolf-accent hover:bg-werewolf-accent/90 w-full mt-4">
              Passer à la première nuit <Moon className="ml-2 h-4 w-4" />
            </Button>
          </div>;
      case 'firstNight':
        const nightActions = getOrderedCharacterActions(characters, 'night');
        return <div>
            <div className="mb-4">
              <AudioButton label="Ambiance Nuit" playMusic={playNightMusic} stopMusic={stopMusic} />
            </div>
            <p className="mb-4">Demandez à tous les joueurs de fermer les yeux.</p>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Actions à effectuer dans l'ordre :</h3>
              <ol className="list-decimal list-inside pl-4 space-y-2 px-0">
                {nightActions.map((char, index) => <li key={index} className="p-2 rounded bg-zinc-950 px-0 py-[8px] mx-0">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        {getCharacterIcon(char.icon)}
                      </div>
                      <div>
                        <span className="font-medium">{char.name}:</span> {char.actionDescription || `Action de ${char.name}`}
                      </div>
                    </div>
                  </li>)}
              </ol>
            </div>
            <Button onClick={() => onPhaseChange('day')} className="bg-werewolf-accent hover:bg-werewolf-accent/90 w-full mt-4">
              Passer au jour suivant <Sun className="ml-2 h-4 w-4" />
            </Button>
          </div>;
      case 'day':
        const dayActions = getOrderedCharacterActions(characters, 'day');
        return <div>
            <div className="mb-4 flex gap-2">
              <AudioButton label="Ambiance Jour" playMusic={playDayMusic} stopMusic={stopMusic} />
              <AudioButton label="Ambiance Vote" playMusic={playVoteMusic} stopMusic={stopMusic} />
            </div>
            <p className="mb-4">1. Annoncez les victimes de la nuit, s'il y en a.</p>
            <p className="mb-4">2. Laissez les joueurs débattre pour trouver les Loups-Garous.</p>
            
            {dayActions.length > 0 && <div className="mb-4">
                <h3 className="font-semibold mb-2">Actions spéciales du jour :</h3>
                <ol className="list-decimal list-inside pl-4 space-y-2">
                  {dayActions.map((char, index) => <li key={index} className="p-2 rounded bg-gray-950">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-1">
                          {getCharacterIcon(char.icon)}
                        </div>
                        <div>
                          <span className="font-medium">{char.name}:</span> {char.actionDescription || `Action de ${char.name}`}
                        </div>
                      </div>
                    </li>)}
                </ol>
              </div>}
            
            <p className="mb-4">3. Procédez au vote pour éliminer un joueur.</p>
            <p className="mb-4">4. Annoncez le joueur éliminé (sans révéler son rôle).</p>
            <Button onClick={() => onPhaseChange('night')} className="bg-werewolf-accent hover:bg-werewolf-accent/90 w-full mt-4">
              Passer à la nuit <Moon className="ml-2 h-4 w-4" />
            </Button>
          </div>;
      case 'night':
        const regularNightActions = getOrderedCharacterActions(characters, 'night');
        return <div>
            <div className="mb-4">
              <AudioButton label="Ambiance Nuit" playMusic={playNightMusic} stopMusic={stopMusic} />
            </div>
            <p className="mb-4">Demandez à tous les joueurs de fermer les yeux.</p>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Actions à effectuer dans l'ordre :</h3>
              <ol className="list-decimal list-inside pl-4 space-y-2">
                {regularNightActions.map((char, index) => <li key={index} className="p-2 rounded bg-gray-50">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        {getCharacterIcon(char.icon)}
                      </div>
                      <div>
                        <span className="font-medium">{char.name}:</span> {char.actionDescription || `Action de ${char.name}`}
                      </div>
                    </div>
                  </li>)}
              </ol>
            </div>
            <Button onClick={() => onPhaseChange('day')} className="bg-werewolf-accent hover:bg-werewolf-accent/90 w-full mt-4">
              Passer au jour suivant <Sun className="ml-2 h-4 w-4" />
            </Button>
          </div>;
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
  const getCharacterIcon = (iconName: string) => {
    switch (iconName) {
      case 'moon':
        return <Moon className="h-4 w-4 text-werewolf-accent" />;
      case 'eye':
        return <span>👁️</span>;
      case 'user':
      case 'users':
        return <Users className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };
  const getOrderedCharacterActions = (chars: CharacterType[], phase: 'night' | 'day') => {
    return chars.filter(char => char.actionPhase === phase).sort((a, b) => (a.actionOrder || 999) - (b.actionOrder || 999));
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
    const villageCount = characters.filter(char => char.team === 'village').length;
    const werewolfCount = characters.filter(char => char.team === 'werewolf').length;
    const soloCount = characters.filter(char => char.team === 'solo').length;
    return <div className="flex justify-around text-sm mb-4 p-2 rounded-lg bg-gray-50">
        <div className="text-center">
          <span className="font-medium text-blue-600">Village: </span>
          <span className="text-zinc-950">{villageCount}</span>
        </div>
        <div className="text-center">
          <span className="font-medium text-werewolf-blood">Loups: </span>
          <span className="text-zinc-950">{werewolfCount}</span>
        </div>
        {soloCount > 0 && <div className="text-center">
            <span className="font-medium text-amber-600">Solo: </span>
            <span className="text-zinc-950">{soloCount}</span>
          </div>}
      </div>;
  };
  return <div className="glass-card p-6 rounded-xl w-full max-w-md animate-scale-in">
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