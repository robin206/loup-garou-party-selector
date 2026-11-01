import React, { useEffect, useMemo, useState } from 'react';
import { CharacterType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Check, Shuffle, UserPlus, X } from 'lucide-react';
import { addPlayers, loadRoster, removePlayer, renamePlayer, saveRoster } from '@/lib/playerRoster';
import { describeGap } from '@/lib/randomAssignment';
import { cn } from '@/lib/utils';

interface RandomAssignmentPanelProps {
  /** Rôles de la partie (une entrée par instance, avec playerName éventuel) */
  characters: CharacterType[];
  /** Appelé avec la liste des prénoms quand le maître du jeu lance le tirage */
  onAssign: (players: string[]) => void;
  /** Masque le bloc (bouton en haut à droite), facultatif */
  onClose?: () => void;
}

/** Champ sombre : le champ par défaut a un fond clair et hérite du texte blanc de la page */
const darkInput = 'bg-gray-900/80 border-white/15 text-gray-100 placeholder:text-gray-500';

/**
 * Bloc « Partie aléatoire » de l'écran de préparation : liste des joueurs de la soirée,
 * contrôle joueurs / rôles et tirage au sort des rôles.
 */
export const RandomAssignmentPanel: React.FC<RandomAssignmentPanelProps> = ({ characters, onAssign, onClose }) => {
  const [roster, setRoster] = useState<string[]>(() => loadRoster());
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState<{ name: string; value: string } | null>(null);

  useEffect(() => { saveRoster(roster); }, [roster]);

  const gapMessage = describeGap(roster.length, characters.length);
  const alreadyAssigned = characters.some(c => (c.playerName || '').trim().length > 0);

  const assignments = useMemo(
    () => characters
      .filter(c => (c.playerName || '').trim().length > 0)
      .sort((a, b) => a.playerName!.localeCompare(b.playerName!, 'fr')),
    [characters]
  );

  const handleAdd = () => {
    setRoster(prev => addPlayers(prev, draft));
    setDraft('');
  };

  const commitEdit = () => {
    if (editing) setRoster(prev => renamePlayer(prev, editing.name, editing.value));
    setEditing(null);
  };

  const handleDraw = () => {
    if (gapMessage || roster.length === 0) return;
    onAssign(roster);
  };

  return (
    <section id="partie-aleatoire" className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
          <Shuffle className="h-5 w-5 text-werewolf-accent" />
          Partie aléatoire
        </h3>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-sm font-medium',
            gapMessage ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'
          )}
        >
          {roster.length} joueur{roster.length > 1 ? 's' : ''} / {characters.length} rôle{characters.length > 1 ? 's' : ''}
        </span>
        {onClose && (
          <button
            type="button"
            data-keep-color
            onClick={onClose}
            className="ml-auto -mr-1 rounded-full p-1 text-gray-400 hover:text-gray-100"
            aria-label="Masquer la partie aléatoire"
            title="Masquer"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          placeholder="Prénom (ou Léa, Tom, Zoé...)"
          aria-label="Ajouter des joueurs"
          className={darkInput}
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!draft.trim()}
          className="shrink-0 bg-white/10 border border-white/10 text-gray-100 hover:bg-white/15"
          aria-label="Ajouter"
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      </div>

      {roster.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {roster.map(name => (
            <li key={name}>
              {editing?.name === name ? (
                <Input
                  autoFocus
                  value={editing.value}
                  onChange={e => setEditing({ name, value: e.target.value })}
                  onBlur={commitEdit}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
                    if (e.key === 'Escape') setEditing(null);
                  }}
                  className={cn('h-8 w-32', darkInput)}
                  aria-label={`Modifier ${name}`}
                />
              ) : (
                <span className="inline-flex items-center rounded-full border border-white/10 bg-gray-800/80 text-gray-100 text-sm">
                  <button
                    type="button"
                    data-keep-color
                    className="pl-3 pr-1 py-1"
                    onClick={() => setEditing({ name, value: name })}
                    title="Modifier le prénom"
                  >
                    {name}
                  </button>
                  <button
                    type="button"
                    data-keep-color
                    className="pr-2 pl-1 py-1 text-gray-400 hover:text-werewolf-accent"
                    onClick={() => setRoster(prev => removePlayer(prev, name))}
                    aria-label={`Retirer ${name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">
          Ajoute les prénoms des joueurs de la soirée. La liste est gardée pour les parties suivantes.
        </p>
      )}

      {roster.length > 0 && gapMessage && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{gapMessage}</span>
        </div>
      )}

      <Button
        type="button"
        data-keep-color
        onClick={handleDraw}
        disabled={roster.length === 0 || !!gapMessage}
        className="w-full btn-primary-blood"
      >
        <Shuffle className="mr-2 h-4 w-4" />
        {alreadyAssigned ? 'Relancer le tirage' : 'Répartir au hasard'}
      </Button>

      {assignments.length > 0 && (
        <ul className="divide-y divide-white/5 rounded-xl border border-white/10 bg-black/20">
          {assignments.map(c => (
            <li key={c.instanceId || c.id} className="flex items-center gap-3 px-3 py-2">
              <span className="flex-1 font-medium text-gray-100">{c.playerName}</span>
              <span className="flex items-center gap-2 text-sm text-gray-300">
                {c.name}
                {typeof c.icon === 'string' && c.icon.startsWith('/')
                  ? <img src={c.icon} alt="" className="h-7 w-7 object-contain" />
                  : <Check className="h-4 w-4 text-gray-500" />}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default RandomAssignmentPanel;
