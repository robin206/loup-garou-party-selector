import React from "react";
import { MonitorPlay, Users, Skull } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useProjectorSettings,
  setProjectorEnabled,
  setProjectorPlayersEnabled,
  setProjectorDeathAnimationEnabled,
} from "@/lib/projectorSettings";
import { toast } from "sonner";

const ProjectorConfigSection: React.FC = () => {
  const { enabled, playersEnabled, deathAnimationEnabled } = useProjectorSettings();

  return (
    <div className="glass-card p-8 rounded-xl space-y-6 animate-scale-in mt-8">
      <div className="flex items-center gap-3">
        <MonitorPlay className="text-purple-400 h-7 w-7" />
        <h2 className="text-2xl font-semibold">Configuration projecteur</h2>
      </div>

      <div className="flex items-start justify-between gap-4 pt-2">
        <div className="space-y-1">
          <Label htmlFor="projector-enabled" className="text-base">
            Activer la fonctionnalité projecteur
          </Label>
          <p className="text-sm text-gray-200">
            Affiche le bouton « Projecteur » et permet la synchronisation avec la
            page /projector.html.
          </p>
        </div>
        <Switch
          id="projector-enabled"
          checked={enabled}
          onCheckedChange={(v) => {
            setProjectorEnabled(v);
            toast.success(v ? "Projecteur activé" : "Projecteur désactivé");
          }}
        />
      </div>

      <div className="flex items-start justify-between gap-4 pt-4 border-t border-gray-100">
        <div className="space-y-1">
          <Label
            htmlFor="projector-players"
            className="text-base flex items-center gap-2"
          >
            <Users className="h-4 w-4" /> Afficher les joueurs sur le projecteur
          </Label>
          <p className="text-sm text-gray-200">
            Affiche la liste des personnages en jeu de part et d'autre de la
            vidéo (grisés lorsqu'ils sont éliminés).
          </p>
        </div>
        <Switch
          id="projector-players"
          checked={playersEnabled}
          disabled={!enabled}
          onCheckedChange={(v) => {
            setProjectorPlayersEnabled(v);
            toast.success(
              v ? "Joueurs affichés sur le projecteur" : "Joueurs masqués"
            );
          }}
        />
      </div>
    </div>
  );
};

export default ProjectorConfigSection;
