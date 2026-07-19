import React from "react";
import { MonitorPlay } from "lucide-react";
import { useProjectorSettings } from "@/lib/projectorSettings";

/**
 * Petit bouton flottant pour ouvrir la page /projector.html
 * dans une nouvelle fenêtre destinée au vidéoprojecteur.
 */
const ProjectorButton: React.FC = () => {
  const { enabled } = useProjectorSettings();
  if (!enabled) return null;

  const openProjector = () => {
    window.open("/projector.html", "loupgarou-projector");
  };

  return (
    <button
      type="button"
      onClick={openProjector}
      title="Ouvrir la page projecteur"
      className="fixed bottom-24 right-4 z-[100] flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-xs text-white shadow-lg backdrop-blur-sm hover:bg-black/90 border border-white/20"
    >
      <MonitorPlay className="h-4 w-4" />
      Projecteur
    </button>
  );
};

export default ProjectorButton;
