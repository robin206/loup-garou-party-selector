
import React, { useState } from "react";
import { Play, Pause, Sun, Vote, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLightControl } from "@/hooks/LightControlContext";

type AudioType = "day" | "night" | "vote";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSendingLight, setIsSendingLight] = useState(false);

  const { lightEnabled, lightMode, sendLightCommand } = useLightControl();
  const IconComp = iconMap[type];

  // Associe le type à la commande lumière
  const getLightCode = (): "jour" | "nuit" | "vote" | null => {
    switch(type) {
      case "day": return "jour";
      case "night": return "nuit";
      case "vote": return "vote";
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

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
      disabled={isSendingLight}
    >
      {IconComp && <IconComp className="h-4 w-4" />}
      {isPlaying ? (
        <>
          <Pause className="h-4 w-4" />
          <span>{label}</span>
          <Badge
            variant="secondary"
            className="ml-1 animate-pulse bg-green-100 text-green-800"
          >
            En cours
          </Badge>
        </>
      ) : (
        <>
          <Play className="h-4 w-4" />
          <span>{label}</span>
        </>
      )}
      {isSendingLight && <Badge className="ml-1 animate-pulse" variant="outline">Lumière...</Badge>}
    </Button>
  );
};

export default AudioLightButton;
