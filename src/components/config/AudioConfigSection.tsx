
import React from "react";
import { Music2, Volume, Volume2, FileAudio, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface AudioConfigSectionProps {
  dayMusic: string;
  nightMusic: string;
  voteMusic: string;
  setDayMusic: React.Dispatch<React.SetStateAction<string>>;
  setNightMusic: React.Dispatch<React.SetStateAction<string>>;
  setVoteMusic: React.Dispatch<React.SetStateAction<string>>;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  audioOptions: { value: string; label: string }[];
  playDayMusic: () => void;
  playNightMusic: () => void;
  playVoteMusic: () => void;
  stopMusic: () => void;
  audioService: any;
  handleGoToMusicAdmin: () => void;
}

const AudioConfigSection: React.FC<AudioConfigSectionProps> = ({
  dayMusic, nightMusic, voteMusic,
  setDayMusic, setNightMusic, setVoteMusic,
  volume, setVolume,
  audioOptions, playDayMusic, playNightMusic, playVoteMusic, stopMusic,
  audioService, handleGoToMusicAdmin
}) => {
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
    <>
      <section className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-werewolf-accent/10 rounded-full mb-4 animate-fade-in">
          <Settings className="h-8 w-8 text-werewolf-accent animate-pulse-subtle" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl animate-fade-up">
          Configuration Audio et Lumière
        </h1>
      </section>
      <div className="glass-card p-8 rounded-xl space-y-8 animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <Music2 className="text-yellow-400 h-7 w-7" />
        <h2 className="text-2xl font-semibold">Configuration musique</h2>
      </div>
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
            <Button variant="outline" size="sm" onClick={stopMusic}>Arrêter la musique</Button>
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
    </>
  );
};

export default AudioConfigSection;
