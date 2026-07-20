import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import audioService from '@/services/audioService';

const STORAGE_KEY = 'werewolf-volume';

const readVolume = (): number => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved !== null) {
    const parsed = parseInt(saved, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return 70;
};

const VolumeControl: React.FC = () => {
  const [volume, setVolume] = useState<number>(() => readVolume());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const v = parseInt(e.newValue, 10);
        if (!isNaN(v)) setVolume(v);
      }
    };
    const onCustom = () => setVolume(readVolume());
    window.addEventListener('storage', onStorage);
    window.addEventListener('werewolf-volume-change', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('werewolf-volume-change', onCustom);
    };
  }, []);

  const handleChange = (value: number[]) => {
    const v = value[0];
    setVolume(v);
    audioService.setVolume(v / 100);
    localStorage.setItem(STORAGE_KEY, v.toString());
    window.dispatchEvent(new CustomEvent('werewolf-volume-change'));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          title="Volume"
          aria-label="Volume"
        >
          {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="center" side="top">
        <div className="flex items-center gap-2">
          <VolumeX className="h-4 w-4 text-gray-500 shrink-0" />
          <Slider
            value={[volume]}
            max={100}
            step={5}
            onValueChange={handleChange}
            className="flex-1"
            aria-label="Volume"
          />
          <Volume2 className="h-4 w-4 text-gray-700 shrink-0" />
        </div>
        <div className="mt-2 text-center text-xs text-gray-500">{volume}%</div>
      </PopoverContent>
    </Popover>
  );
};

export default VolumeControl;
