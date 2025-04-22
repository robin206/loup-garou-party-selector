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

  return <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto pt-24 pb-12 px-4">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleBackToGame}>
            <ArrowLeft className="h-4 w-4" />
            Retour au jeu
          </Button>
        </div>
        
        <section className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-werewolf-accent/10 rounded-full mb-4 animate-fade-in">
            <Music2 className="h-8 w-8 text-werewolf-accent animate-pulse-subtle" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl animate-fade-up">
            Configuration Audio
          </h1>
          
          <p className="mx-auto max-w-2xl text-gray-500 text-lg animate-fade-up" style={{
          animationDelay: '0.1s'
        }}>
            Personnalisez les ambiances sonores pour votre partie de Loup Garou
          </p>
        </section>

        <div className="glass-card p-8 rounded-xl space-y-8 animate-scale-in">
          <div className="space-y-4">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="day-music">Musique du Jour</Label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Select value={dayMusic} onValueChange={value => handleMusicChange(value, setDayMusic)}>
                      <SelectTrigger id="day-music" className="w-full">
                        <SelectValue placeholder="Sélectionner une musique" />
                      </SelectTrigger>
                      <SelectContent>
                        {audioOptions.map(option => <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => testAudio(playDayMusic)} title="Tester la musique">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-200">Cette musique sera jouée pendant les phases de jour</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="night-music">Musique de la Nuit</Label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Select value={nightMusic} onValueChange={value => handleMusicChange(value, setNightMusic)}>
                      <SelectTrigger id="night-music" className="w-full">
                        <SelectValue placeholder="Sélectionner une musique" />
                      </SelectTrigger>
                      <SelectContent>
                        {audioOptions.map(option => <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => testAudio(playNightMusic)} title="Tester la musique">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-200">Cette musique sera jouée pendant les phases de nuit</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vote-music">Musique du Vote</Label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Select value={voteMusic} onValueChange={value => handleMusicChange(value, setVoteMusic)}>
                      <SelectTrigger id="vote-music" className="w-full">
                        <SelectValue placeholder="Sélectionner une musique" />
                      </SelectTrigger>
                      <SelectContent>
                        {audioOptions.map(option => <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => testAudio(playVoteMusic)} title="Tester la musique">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-200">Cette musique sera jouée pendant les phases de vote</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <Label htmlFor="volume-slider">Volume global</Label>
                  <span className="text-sm font-medium">{volume}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <Volume className="h-4 w-4 text-gray-500" />
                  <Slider id="volume-slider" defaultValue={[volume]} max={100} step={5} onValueChange={handleVolumeChange} className="flex-1" />
                  <Volume2 className="h-5 w-5 text-gray-700" />
                </div>
                <p className="text-sm text-gray-200">Ajustez le volume pour toutes les musiques</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-200">Mode hors ligne activé : les sons et images sont mis en cache</span>
              <Button variant="outline" size="sm" onClick={() => stopMusic()}>
                Arrêter la musique
              </Button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <Button variant="default" size="lg" className="w-full flex items-center justify-center gap-2" onClick={handleGoToMusicAdmin}>
              <FileAudio className="h-5 w-5" />
              Gérer mes musiques
            </Button>
            <p className="text-sm text-gray-200 text-center mt-2">
              Ajoutez vos propres musiques d'ambiance au format MP3 ou WEBM
            </p>
          </div>
        </div>

        {/* Bloc Configuration Lumières */}
        <section className="glass-card p-8 rounded-xl space-y-8 animate-scale-in mt-10">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-yellow-400 h-7 w-7" />
            <h2 className="text-2xl font-semibold">Configuration Lumières</h2>
          </div>
          <div className="flex items-center gap-4">
            <Switch
              checked={lightEnabled}
              onCheckedChange={handleToggleLight}
              id="light-enabled"
            />
            <Label htmlFor="light-enabled">
              Activer la gestion des lumières pendant le jeu
            </Label>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant={bleStatus === "connected" ? "secondary" : "outline"}
              size="sm"
              className="inline-flex items-center gap-2 w-fit"
              disabled={!lightEnabled || bleStatus === "connecting"}
              onClick={bleStatus === "connected" ? bleDisconnect : bleConnect}
            >
              {bleStatus === "connected" ? (
                <Zap className="text-green-500" />
              ) : (
                <ZapOff className="text-gray-500" />
              )}
              {bleStatus === "connected"
                ? "Déconnecter la lumière"
                : bleStatus === "connecting"
                  ? "Connexion en cours…"
                  : "Tester la connexion BLE (ESP32)"}
            </Button>
            <div className="text-sm text-gray-400">
              <span>
                État BLE :{" "}
                <span
                  className={
                    bleStatus === "connected"
                      ? "text-green-400"
                      : bleStatus === "error"
                      ? "text-red-400"
                      : "text-gray-400"
                  }
                >
                  {bleStatus === "idle"
                    ? "Non connecté"
                    : bleStatus === "connected"
                    ? "Connecté"
                    : bleStatus === "connecting"
                    ? "Connexion…"
                    : bleStatus === "error"
                    ? "Erreur"
                    : "Déconnecté"}
                </span>
              </span>
              {bleError && (
                <span className="ml-3 text-red-400">Erreur : {bleError}</span>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              disabled={!lightEnabled || bleStatus !== "connected"}
              onClick={() => sendLightCommand("JOUR")}
            >
              Lumière Jour
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!lightEnabled || bleStatus !== "connected"}
              onClick={() => sendLightCommand("NUIT")}
            >
              Lumière Nuit
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!lightEnabled || bleStatus !== "connected"}
              onClick={() => sendLightCommand("VOTE")}
            >
              Lumière Vote
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!lightEnabled || bleStatus !== "connected"}
              onClick={() => sendLightCommand("LOUP")}
            >
              Lumière Loup
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Testez la connexion Bluetooth BLE à l’ESP32 “LoupGarouLight” et déclenchez chaque ambiance lumineuse.<br />
            N.B. : La gestion des lumières nécessite Chrome sur Android ou un navigateur compatible BLE.
          </p>
        </section>
      </main>
      
      <footer className="w-full border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        <p>Loup Garou de Thiercelieux © {new Date().getFullYear()}</p>
      </footer>
    </div>;
};

export default Config;
