
import React, { useState } from "react";
import { Play, Pause, Sun, Vote, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLightControl } from "@/hooks/LightControlContext";

type AudioType = "day" | "night" | "vote" | "wolf";
const iconMap = {
  day: Sun,
  vote: Vote,
  night: Moon,
  wolf: Moon, // Changed from Wolf to Moon since Wolf isn't available
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

  const { lightEnabled, bleStatus, sendLightCommand } = useLightControl();
  const IconComp = iconMap[type];

  // Associe le type à la commande lumière
  const getLightCode = (): "JOUR" | "NUIT" | "VOTE" | "LOUP" | null => {
    switch(type) {
      case "day": return "JOUR";
      case "night": return "NUIT";
      case "vote": return "VOTE";
      case "wolf": return "LOUP";
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

    // On déclenche la lumière, sauf si type=wolf où il n'y a que la lumière
    if (lightEnabled && getLightCode() && bleStatus === "connected") {
      setIsSendingLight(true);
      try {
        await sendLightCommand(getLightCode()!);
      } finally {
        setIsSendingLight(false);
      }
    }
  };

  // Si bouton wolf, il ne contrôle QUE la lumière !
  const showPlayPause = type !== "wolf";
  const disabled = (type === "wolf" && (!lightEnabled || bleStatus !== "connected"));

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
      disabled={disabled || isSendingLight}
    >
      {IconComp && <IconComp className="h-4 w-4" />}
      {showPlayPause ? (
        isPlaying ? (
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
        )
      ) : <span>{label}</span>}
      {isSendingLight && <Badge className="ml-1 animate-pulse" variant="outline">Lumière...</Badge>}
    </Button>
  );
};

export default AudioLightButton;
