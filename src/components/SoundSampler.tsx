
import React, { useEffect, useState } from 'react';
import { useAudio } from '@/hooks/useAudio';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundSamplerProps {
  className?: string;
}

const SoundSampler: React.FC<SoundSamplerProps> = ({ className }) => {
  const { playSampleSound, stopMusic } = useAudio();
  const [muted, setMuted] = React.useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Précharger les images SVG lors du montage du composant
  useEffect(() => {
    const imagePaths = [
      '/img/sampler_loup.svg',
      '/img/sampler_ours.svg', 
      '/img/sampler_clocher.svg',
      '/img/sampler_tonnerre.svg'
    ];
    
    const preloadImages = async () => {
      const promises = imagePaths.map(path => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(path);
          img.onerror = () => reject(`Impossible de charger ${path}`);
          img.src = path;
        });
      });
      
      try {
        await Promise.all(promises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Erreur lors du préchargement des images:', error);
        // En cas d'erreur, on considère quand même que les images sont chargées pour éviter de bloquer l'interface
        setImagesLoaded(true);
      }
    };
    
    preloadImages();
  }, []);

  const handlePlaySound = (soundName: string) => {
    if (!muted) {
      playSampleSound(soundName);
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <div className={`${className} w-full bg-black border-t border-werewolf-accent/30 p-4 flex items-center justify-center gap-4 backdrop-blur-lg bg-opacity-70`}>
      <div className="text-white text-sm font-medium mr-2">Effets sonores:</div>
      
      <div className="grid grid-cols-4 gap-4">
        <button
          onClick={() => handlePlaySound('sampler_loup.ogg')}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <img src="/img/sampler_loup.svg" alt="Loup" className="h-10 w-10 mb-1" />
          <span className="text-xs text-gray-300">Loup</span>
        </button>

        <button
          onClick={() => handlePlaySound('sampler_ours.ogg')}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <img src="/img/sampler_ours.svg" alt="Ours" className="h-10 w-10 mb-1" />
          <span className="text-xs text-gray-300">Ours</span>
        </button>

        <button
          onClick={() => handlePlaySound('sampler_clocher.ogg')}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <img src="/img/sampler_clocher.svg" alt="Clocher" className="h-10 w-10 mb-1" />
          <span className="text-xs text-gray-300">Clocher</span>
        </button>

        <button
          onClick={() => handlePlaySound('sampler_tonnerre.ogg')}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <img src="/img/sampler_tonnerre.svg" alt="Tonnerre" className="h-10 w-10 mb-1" />
          <span className="text-xs text-gray-300">Tonnerre</span>
        </button>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMute} 
        className="text-white hover:bg-gray-800"
        title={muted ? "Activer le son" : "Couper le son"}
      >
        {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
      </Button>
    </div>
  );
};

export default SoundSampler;
