
import React, { useState } from "react";
import { Sun, Vote, Moon, Pause, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLightControl } from "@/hooks/LightControlContext";
import { useAmbiance, AmbiancePhase } from "@/hooks/AmbianceContext";

type AudioType = AmbiancePhase;

/** Icône et couleurs de chaque phase (bouton actif). */
const PHASE_STYLE: Record<AudioType, { icon: typeof Sun; active: string }> = {
  day: {
    icon: Sun,
    active: "bg-amber-500 border-amber-300 text-amber-950 hover:bg-amber-400",
  },
  vote: {
    icon: Vote,
    active: "bg-red-600 border-red-400 text-white hover:bg-red-500",
  },
  night: {
    icon: Moon,
    active: "bg-indigo-700 border-indigo-400 text-white hover:bg-indigo-600",
  },
};

interface AudioLightButtonProps {
  label: string;
  type: AudioType;
  playMusic?: () => void;
  stopMusic?: () => void;
  className?: string;
}

/**
 * Grand bouton de phase (Jour / Vote / Nuit) : joue la musique et déclenche
 * la lumière associée si elle est activée. Le bouton de la phase en cours
 * prend la couleur de la phase ; un nouveau clic dessus coupe musique et lumière.
 */
const AudioLightButton: React.FC<AudioLightButtonProps> = ({
  label,
  type,
  playMusic,
  stopMusic,
  className = "",
}) => {
  const [isSendingLight, setIsSendingLight] = useState(false);

  const { lightEnabled, sendLightPhase } = useLightControl();
  const { activeAmbiance, setActiveAmbiance } = useAmbiance();
  // Un bouton est actif uniquement s'il correspond à l'ambiance en cours (une seule à la fois)
  const isPlaying = activeAmbiance === type;
  const { icon: IconComp, active } = PHASE_STYLE[type];

  const handleClick = async () => {
    // Clic sur l'ambiance déjà en cours : on coupe tout (musique + lumière)
    if (isPlaying) {
      stopMusic?.();
      setActiveAmbiance(null);
      if (lightEnabled) {
        setIsSendingLight(true);
        try {
          await sendLightPhase("off");
        } catch (err) {
          console.error("Erreur lors de l'extinction de la lumière:", err);
        } finally {
          setIsSendingLight(false);
        }
      }
      return;
    }

    // Nouvelle ambiance : les autres boutons repassent automatiquement à l'état inactif
    setActiveAmbiance(type);
    playMusic?.();

    if (lightEnabled) {
      setIsSendingLight(true);
      try {
        await sendLightPhase(type);
      } catch (err) {
        console.error("Erreur lors de l'envoi de la commande lumière:", err);
      } finally {
        setIsSendingLight(false);
      }
    }
  };

  return (
    <button
      type="button"
      data-phase={type}
      aria-pressed={isPlaying}
      onClick={handleClick}
      disabled={isSendingLight}
      title={isPlaying ? `Arrêter l'ambiance ${label}` : `Lancer l'ambiance ${label}`}
      className={cn(
        "relative flex h-16 flex-1 flex-col items-center justify-center gap-1 rounded-xl border-2 text-sm font-semibold transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-600",
        "disabled:cursor-wait",
        isPlaying
          ? cn(active, "scale-[1.04] shadow-[0_0_0_3px_rgba(255,255,255,0.35)]")
          : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-white",
        className
      )}
    >
      <IconComp className="h-6 w-6" />
      <span className="flex items-center gap-1">
        {label}
        {isPlaying && !isSendingLight && <Pause className="h-3 w-3 opacity-80" />}
        {isSendingLight && <Loader2 className="h-3 w-3 animate-spin" />}
      </span>
    </button>
  );
};

export default AudioLightButton;
