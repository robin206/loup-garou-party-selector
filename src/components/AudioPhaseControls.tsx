
import React, { useEffect } from 'react';
import AudioLightButton from './AudioLightButton';
import { useAudio } from '@/hooks/useAudio';
import { useLightControl } from '@/hooks/LightControlContext';
import { useAmbiance } from '@/hooks/AmbianceContext';
import { Button } from '@/components/ui/button';
import { Bluetooth, BluetoothConnected, BluetoothOff, PowerOff } from 'lucide-react';
import { projector } from '@/lib/projector';
import VolumeControl from './VolumeControl';

export const AudioPhaseControls = () => {
  const { playDayMusic, playNightMusic, playVoteMusic, stopMusic } = useAudio();
  const { lightEnabled, bleEnabled, bleStatus, bleConnect, bleDisconnect, sendLightPhase } = useLightControl();
  const { setActiveAmbiance } = useAmbiance();

  // useAudio coupe la musique au démontage : on remet aussi l'état des boutons à zéro
  useEffect(() => () => setActiveAmbiance(null), [setActiveAmbiance]);

  const handlePlayDay = () => {
    playDayMusic();
    projector.day();
  };

  const handlePlayNight = () => {
    playNightMusic();
    projector.night();
  };

  const handlePlayVote = () => {
    playVoteMusic();
    // Le vote ne modifie pas l'état du projecteur (reste sur JOUR ou NUIT en cours)
  };

  // Bouton d'extinction : coupe la musique, éteint les lumières et désélectionne l'ambiance
  const handleLightOff = () => {
    stopMusic();
    setActiveAmbiance(null);
    if (lightEnabled) {
      sendLightPhase("off");
    }
  };

  // Function to handle BLE connection/disconnection
  const handleBLEConnection = () => {
    if (bleStatus === "connected") {
      bleDisconnect();
    } else {
      bleConnect();
    }
  };

  // Determine which Bluetooth icon to show
  const renderBLEIcon = () => {
    if (bleStatus === "connected") {
      return <BluetoothConnected className="text-green-500" />;
    } else if (bleStatus === "connecting") {
      return <Bluetooth className="animate-pulse" />;
    } else {
      return <BluetoothOff />;
    }
  };

  return (
    <div className="mb-4 flex gap-2 items-center">
      <AudioLightButton 
        label="Jour" 
        type="day" 
        playMusic={handlePlayDay} 
        stopMusic={stopMusic} 
      />
      <AudioLightButton 
        label="Vote" 
        type="vote" 
        playMusic={handlePlayVote} 
        stopMusic={stopMusic} 
      />
      <AudioLightButton 
        label="Nuit" 
        type="night" 
        playMusic={handlePlayNight} 
        stopMusic={stopMusic} 
      />

      <VolumeControl />

      
      {/* Light Off Button - only show if light mode is enabled */}
      {lightEnabled && (
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={handleLightOff}
          title="Éteindre les lumières"
        >
          <PowerOff className="h-4 w-4" />
        </Button>
      )}
      
      {/* BLE Connection Button - only show if light mode is set to BLE */}
      {bleEnabled && (
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 ml-2"
          disabled={bleStatus === "connecting"}
          onClick={handleBLEConnection}
          title={bleStatus === "connected" ? "Déconnecter BLE" : "Connecter BLE"}
        >
          {renderBLEIcon()}
        </Button>
      )}
    </div>
  );
};
