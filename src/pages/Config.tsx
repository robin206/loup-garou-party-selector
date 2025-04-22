import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Music2, Volume, Volume2, FileAudio } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { GameState } from '@/types';
import { toast } from 'sonner';
import { useAudio } from '@/hooks/useAudio';
import audioService from '@/services/audioService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from "@/components/ui/switch";
import { Zap, ZapOff } from "lucide-react";
import { useLightBLE } from "@/hooks/useLightBLE";
import AudioConfigSection from "@/components/config/AudioConfigSection";
import LightsConfigSection from "@/components/config/LightsConfigSection";
import ConfigFooter from "@/components/config/ConfigFooter";

const Config = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameState = location.state as GameState;
  const [dayMusic, setDayMusic] = useState<string>(audioService.getDefaultDayMusic());
  const [nightMusic, setNightMusic] = useState<string>(audioService.getDefaultNightMusic());
  const [voteMusic, setVoteMusic] = useState<string>(audioService.getDefaultVoteMusic());
  const [volume, setVolume] = useState<number>(70);
  const [lightEnabled, setLightEnabled] = useState<boolean>(
    localStorage.getItem("werewolf-light-enabled") === "true"
  );

  const {
    getAmbianceAudios,
    playDayMusic,
    playNightMusic,
    playVoteMusic,
    stopMusic
  } = useAudio();

  const ambianceAudios = getAmbianceAudios();
  const audioOptions = ambianceAudios.map(file => {
    const name = file.replace(/^ambiance_/, '').replace(/^Ambiance_/, '').replace(/\.(webm|mp3)$/, '');
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    return {
      value: file,
      label: `${formattedName}`
    };
  });

  const handleBackToGame = () => {
    const savedGameState = localStorage.getItem('werewolf-game-current-state');
    if (savedGameState) {
      try {
        const parsedGameState = JSON.parse(savedGameState);
        toast.success("Retour à la partie en cours...");
        navigate('/game', {
          state: parsedGameState
        });
      } catch (e) {
        console.error("Error parsing saved game state:", e);
        navigate('/');
      }
    } else if (gameState) {
      navigate('/game', {
        state: gameState
      });
    } else {
      navigate('/');
    }
  };

  const handleGoToMusicAdmin = () => {
    navigate('/music-admin');
  };

  const handleToggleLight = (checked: boolean) => {
    setLightEnabled(checked);
    localStorage.setItem("werewolf-light-enabled", checked.toString());
    toast.success(
      checked ? "Gestion des lumières activée" : "Gestion des lumières désactivée"
    );
    if (!checked) bleDisconnect();
  };

  const {
    status: bleStatus,
    error: bleError,
    connect: bleConnect,
    sendLightCommand,
    disconnect: bleDisconnect,
  } = useLightBLE();

  useEffect(() => {
    const savedDayMusic = localStorage.getItem('werewolf-day-music');
    const savedNightMusic = localStorage.getItem('werewolf-night-music');
    const savedVoteMusic = localStorage.getItem('werewolf-vote-music');
    const savedVolume = localStorage.getItem('werewolf-volume');
    if (savedDayMusic) setDayMusic(savedDayMusic);
    if (savedNightMusic) setNightMusic(savedNightMusic);
    if (savedVoteMusic) setVoteMusic(savedVoteMusic);
    if (savedVolume) {
      const parsedVolume = parseInt(savedVolume);
      setVolume(parsedVolume);
      audioService.setVolume(parsedVolume / 100);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('werewolf-day-music', dayMusic);
    localStorage.setItem('werewolf-night-music', nightMusic);
    localStorage.setItem('werewolf-vote-music', voteMusic);
  }, [dayMusic, nightMusic, voteMusic]);

  const handleMusicChange = (value: string, setMusic: React.Dispatch<React.SetStateAction<string>>) => {
    setMusic(value);
    toast.success('Configuration sauvegardée');
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    audioService.setVolume(newVolume / 100);
    localStorage.setItem('werewolf-volume', newVolume.toString());
    toast.success('Volume sauvegardé');
  };

  const testAudio = (playFunction: () => void) => {
    stopMusic();
    playFunction();
    toast.info('Test audio en cours...');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto pt-24 pb-12 px-4">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleBackToGame}>
            <ArrowLeft className="h-4 w-4" />
            Retour au jeu
          </Button>
        </div>
        <AudioConfigSection
          dayMusic={dayMusic}
          nightMusic={nightMusic}
          voteMusic={voteMusic}
          setDayMusic={setDayMusic}
          setNightMusic={setNightMusic}
          setVoteMusic={setVoteMusic}
          volume={volume}
          setVolume={setVolume}
          audioOptions={audioOptions}
          playDayMusic={playDayMusic}
          playNightMusic={playNightMusic}
          playVoteMusic={playVoteMusic}
          stopMusic={stopMusic}
          audioService={audioService}
          handleGoToMusicAdmin={handleGoToMusicAdmin}
        />
        <LightsConfigSection
          lightEnabled={lightEnabled}
          handleToggleLight={handleToggleLight}
          bleStatus={bleStatus}
          bleError={bleError}
          bleConnect={bleConnect}
          bleDisconnect={bleDisconnect}
          sendLightCommand={sendLightCommand}
        />
      </main>
      <ConfigFooter />
    </div>
  );
};

export default Config;
