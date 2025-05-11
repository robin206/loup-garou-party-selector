
import React, { useState } from "react";
import { Play, Pause, Sun, Vote, Moon, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLightControl } from "@/hooks/LightControlContext";

type AudioType = "day" | "night" | "vote" | "off";
const iconMap = {
  day: Sun,
  vote: Vote,
  night: Moon,
  off: PowerOff
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSendingLight, setIsSendingLight] = useState(false);

  const { lightEnabled, lightMode, sendLightCommand } = useLightControl();
  const IconComp = iconMap[type];

  // Associe le type à la commande lumière (en minuscules)
  const getLightCode = (): "jour" | "nuit" | "vote" | "off" | null => {
    switch(type) {
      case "day": return "jour";
      case "night": return "nuit";
      case "vote": return "vote";
      case "off": return "off";
      default: return null;
    }
  };

  // Click du bouton = musique + lumière (si activés)
  const handleClick = async () => {
    if (isPlaying && stopMusic) {
      stopMusic();
      setIsPlaying(false);
      return;
    }
    if (playMusic) {
      playMusic();
      setIsPlaying(true);
    }

    // On déclenche la lumière si elle est activée
    if (lightEnabled && getLightCode()) {
      setIsSendingLight(true);
      console.log(`AudioLightButton: envoi de la commande ${getLightCode()}`);
      try {
        const result = await sendLightCommand(getLightCode()!);
        console.log(`AudioLightButton: résultat de l'envoi: ${result}`);
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
