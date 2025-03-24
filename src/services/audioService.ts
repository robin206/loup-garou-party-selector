
type FadeDirection = 'in' | 'out';

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private fadeInterval: number | null = null;
  private volume: number = 0.7;
  
  /**
   * Joue un fichier audio avec un fondu si une autre piste est déjà en cours
   */
  public playAudio(audioFile: string, loop: boolean = true): void {
    // Si un audio est déjà en cours, on fait un fondu sortant avant de lancer le nouveau
    if (this.currentAudio && !this.currentAudio.paused) {
      this.fadeAudio('out', this.currentAudio).then(() => {
        this.currentAudio?.pause();
        this.startNewAudio(audioFile, loop);
      });
    } else {
      this.startNewAudio(audioFile, loop);
    }
  }
  
  /**
   * Arrête l'audio en cours avec un fondu
   */
  public stopAudio(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.fadeAudio('out', this.currentAudio).then(() => {
        this.currentAudio?.pause();
        if (this.currentAudio) {
          this.currentAudio.currentTime = 0;
        }
      });
    }
  }
  
  /**
   * Démarre un nouvel audio avec fondu entrant
   */
  private startNewAudio(audioFile: string, loop: boolean): void {
    try {
      const audio = new Audio(`/audio/${audioFile}`);
      audio.loop = loop;
      audio.volume = 0;
      
      audio.play().then(() => {
        this.currentAudio = audio;
        this.fadeAudio('in', audio);
      }).catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'élément audio:', error);
    }
  }
  
  /**
   * Applique un effet de fondu sur un élément audio
   */
  private fadeAudio(direction: FadeDirection, audio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve) => {
      // Nettoyer tout intervalle de fondu existant
      if (this.fadeInterval !== null) {
        clearInterval(this.fadeInterval);
      }
      
      const targetVolume = direction === 'in' ? this.volume : 0;
      const step = direction === 'in' ? 0.05 : -0.05;
      const fadeSpeed = 100; // ms entre chaque étape
      
      this.fadeInterval = window.setInterval(() => {
        // Calculer le nouveau volume
        let newVolume = audio.volume + step;
        
        // S'assurer que le volume reste dans les limites
        if (direction === 'in' && newVolume >= targetVolume) {
          newVolume = targetVolume;
          clearInterval(this.fadeInterval as number);
          this.fadeInterval = null;
          resolve();
        } else if (direction === 'out' && newVolume <= targetVolume) {
          newVolume = targetVolume;
          clearInterval(this.fadeInterval as number);
          this.fadeInterval = null;
          resolve();
        }
        
        audio.volume = newVolume;
      }, fadeSpeed);
    });
  }
  
  /**
   * Obtient la liste des fichiers audio disponibles
   * Remarque: Cette fonction est un placeholder. En réalité, une API backend
   * serait nécessaire pour lister les fichiers d'un répertoire.
   */
  public getAvailableAudioFiles(): string[] {
    // Comme nous ne pouvons pas lire directement le contenu d'un répertoire côté client,
    // nous définissons une liste de fichiers audio connus.
    // Dans une application réelle, vous pourriez avoir une API qui liste les fichiers.
    return [
      'jour.webm',
      'nuit.webm',
      'vote.webm',
      'suspense.webm',
      'revelation.webm',
      'tension.webm',
      'victoire.webm',
      'defaite.webm'
    ];
  }
  
  /**
   * Définit le volume global
   */
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }
  
  /**
   * Retourne l'instance singleton du service
   */
  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }
  
  private static instance: AudioService;
}

export default AudioService.getInstance();
