
import React, { useState, useEffect } from 'react';
import { Moon } from 'lucide-react';
import Header from '@/components/Header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const audioOptions = [
  { value: 'jour.mp3', label: 'Jour - Ambiance village' },
  { value: 'nuit.mp3', label: 'Nuit - Ambiance mystérieuse' },
  { value: 'vote.mp3', label: 'Vote - Tension dramatique' },
  { value: 'suspense.mp3', label: 'Suspense - Moment critique' },
  { value: 'revelation.mp3', label: 'Révélation - Découverte' }
];

const Config = () => {
  const [dayMusic, setDayMusic] = useState<string>('jour.mp3');
  const [nightMusic, setNightMusic] = useState<string>('nuit.mp3');
  const [voteMusic, setVoteMusic] = useState<string>('vote.mp3');
  
  // Load saved configuration on mount
  useEffect(() => {
    const savedDayMusic = localStorage.getItem('werewolf-day-music');
    const savedNightMusic = localStorage.getItem('werewolf-night-music');
    const savedVoteMusic = localStorage.getItem('werewolf-vote-music');
    
    if (savedDayMusic) setDayMusic(savedDayMusic);
    if (savedNightMusic) setNightMusic(savedNightMusic);
    if (savedVoteMusic) setVoteMusic(savedVoteMusic);
  }, []);
  
  // Save configuration when changed
  useEffect(() => {
    localStorage.setItem('werewolf-day-music', dayMusic);
    localStorage.setItem('werewolf-night-music', nightMusic);
    localStorage.setItem('werewolf-vote-music', voteMusic);
  }, [dayMusic, nightMusic, voteMusic]);
  
  const handleMusicChange = (value: string, setMusic: React.Dispatch<React.SetStateAction<string>>) => {
    setMusic(value);
    toast.success('Configuration sauvegardée');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto pt-24 pb-12 px-4">
        <section className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-werewolf-accent/10 rounded-full mb-4 animate-fade-in">
            <Moon className="h-8 w-8 text-werewolf-accent animate-pulse-subtle" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl animate-fade-up">
            Configuration Audio
          </h1>
          
          <p className="mx-auto max-w-2xl text-gray-500 text-lg animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Personnalisez les ambiances sonores pour votre partie de Loup Garou
          </p>
        </section>

        <div className="glass-card p-8 rounded-xl space-y-8 animate-scale-in">
          <div className="space-y-4">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="day-music">Musique du Jour</Label>
                <Select 
                  value={dayMusic} 
                  onValueChange={(value) => handleMusicChange(value, setDayMusic)}
                >
                  <SelectTrigger id="day-music" className="w-full">
                    <SelectValue placeholder="Sélectionner une musique" />
                  </SelectTrigger>
                  <SelectContent>
                    {audioOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Cette musique sera jouée pendant les phases de jour</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="night-music">Musique de la Nuit</Label>
                <Select 
                  value={nightMusic} 
                  onValueChange={(value) => handleMusicChange(value, setNightMusic)}
                >
                  <SelectTrigger id="night-music" className="w-full">
                    <SelectValue placeholder="Sélectionner une musique" />
                  </SelectTrigger>
                  <SelectContent>
                    {audioOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Cette musique sera jouée pendant les phases de nuit</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vote-music">Musique du Vote</Label>
                <Select 
                  value={voteMusic} 
                  onValueChange={(value) => handleMusicChange(value, setVoteMusic)}
                >
                  <SelectTrigger id="vote-music" className="w-full">
                    <SelectValue placeholder="Sélectionner une musique" />
                  </SelectTrigger>
                  <SelectContent>
                    {audioOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Cette musique sera jouée pendant les phases de vote</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="w-full border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        <p>Loup Garou de Thiercelieux © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Config;
