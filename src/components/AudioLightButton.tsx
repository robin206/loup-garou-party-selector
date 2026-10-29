
import React, { useState } from "react";
import { Play, Pause, Sun, Vote, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLightControl } from "@/hooks/LightControlContext";
import { useAmbiance, AmbiancePhase } from "@/hooks/AmbianceContext";

type AudioType = AmbiancePhase;
const iconMap = {
  day: Sun,
  vote: Vote,
  night: Moon
};

interface AudioLightButtonProps {
  label: string;
  type: AudioType;
  playMusic?: () => void;
  stopMusic?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

/**
 * Bouton qui joue de la musique et déclenche la lumière BLE associée si activée.
 */
const AudioLightButton: React.FC<AudioLightButtonProps> = ({
  label,
  type,
  playMusic,
  stopMusic,
  className = '',
  variant = "outline",
}) => {
  const [isSendingLight, setIsSendingLight] = useState(false);

  const { lightEnabled, sendLightPhase } = useLightControl();
  const { activeAmbiance, setActiveAmbiance } = useAmbiance();
  // Un bouton est en "play" uniquement s'il correspond à l'ambiance active (une seule à la fois)
  const isPlaying = activeAmbiance === type;
  const IconComp = iconMap[type];

  // Click du bouton = musique + lumière (si activés)
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

    // Nouvelle ambiance : les autres boutons repassent automatiquement en "play"
    setActiveAmbiance(type);
    playMusic?.();

    // On déclenche la lumière (BLE et/ou WiFi selon les options actives)
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

  // Déterminer la variante du bouton selon l'état de lecture
  const buttonVariant = isPlaying ? "default" : variant;
  // Ajouter une classe personnalisée si la lecture est active
  const buttonClassName = `flex items-center gap-2 ${isPlaying ? 'bg-green-500 hover:bg-green-600 text-white' : ''} ${className}`;

  return (
    <Button
      variant={buttonVariant}
      onClick={handleClick}
      className={buttonClassName}
      disabled={isSendingLight}
    >
      {IconComp && <IconComp className="h-4 w-4" />}
      {isPlaying ? (
        <>
          <Pause className="h-4 w-4" />
        </>
      ) : (
        <>
          <Play className="h-4 w-4" />
        </>
      )}
      {isSendingLight && <Badge className="ml-1 animate-pulse" variant="outline">Lumière...</Badge>}
    </Button>
  );
};

export default AudioLightButton;
