type FadeDirection = 'in' | 'out';

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private fadeInterval: number | null = null;
  private volume: number = 0.7;
  private preloadedAudios: Map<string, HTMLAudioElement> = new Map();
  private preloadComplete: boolean = false;
  
  // Musiques par défaut
  private defaultDayMusic = 'ambiance_cobblevillage.webm';
  private defaultNightMusic = 'ambiance_defautnuit.webm';
  private defaultVoteMusic = 'ambiance_clear-haken.webm';
  
  /**
   * Joue un fichier audio avec un fondu si une autre piste est déjà en cours
   */
  public playAudio(audioFile: string, loop: boolean = true): void {
    // Si un audio est déjà en cours, on fait un fondu sortant avant de lancer le nouveau
    if (this.currentAudio && !this.currentAudio.paused) {
      this.fadeAudio('out', this.currentAudio).then(() => {
        this.currentAudio?.pause();
        this.startNewAudio(audioFile, loop);
      }).catch(error => {
        console.error('Erreur lors du fondu sortant:', error);
        // En cas d'erreur, on arrête quand même l'audio en cours
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        }
        this.startNewAudio(audioFile, loop);
      });
    } else {
      this.startNewAudio(audioFile, loop);
    }
  }
  
  /**
   * Joue un son du sampler sans interrompre la musique de fond
   */
  public playSampleSound(soundName: string): void {
    try {
      // Vérifier si le son est préchargé
      const cacheKey = `sampler/${soundName}`;
      let sampleSound: HTMLAudioElement;
      
      if (this.preloadedAudios.has(cacheKey)) {
        sampleSound = this.preloadedAudios.get(cacheKey)!.cloneNode(true) as HTMLAudioElement;
      } else {
        sampleSound = new Audio(`/audio/sampler/${soundName}`);
        console.warn(`Son ${soundName} non préchargé, chargement à la volée`);
      }
      
      sampleSound.volume = this.volume;
      sampleSound.play().catch(error => {
        console.error(`Erreur lors de la lecture du son ${soundName}:`, error);
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'élément audio pour le sampler:', error);
    }
  }
  
  /**
   * Arrête l'audio en cours avec un fondu
   */
  public stopAudio(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.fadeAudio('out', this.currentAudio).then(() => {
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        }
      }).catch(error => {
        console.error('Erreur lors du fondu sortant pour l\'arrêt:', error);
        // En cas d'erreur, on arrête brusquement
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        }
      });
    }
  }
  
  /**
   * Précharge tous les fichiers audio dans le cache
   */
  public preloadAudioFiles(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadComplete) {
        resolve();
        return;
      }
      
      try {
        const audioFiles = this.getAvailableAudioFiles();
        const samplerSounds = [
          'sampler_loup.ogg', 
          'sampler_ours.ogg', 
          'sampler_clocher.ogg', 
          'sampler_tonnerre.ogg',
          'sampler_hunter.ogg',
          'sampler_clock.ogg',
          'sampler_violon_1.ogg',
          'sampler_violon_2.ogg',
          'sampler_violon_3.ogg'
        ];
        let loadedCount = 0;
        const totalFiles = audioFiles.length + samplerSounds.length;
        
        // Fonction pour traiter un fichier chargé
        const fileLoaded = () => {
          loadedCount++;
          if (loadedCount >= totalFiles) {
            console.log(`Préchargement audio terminé: ${loadedCount}/${totalFiles} fichiers chargés`);
            this.preloadComplete = true;
            resolve();
          }
        };
        
        // Préchargement des fichiers audio principaux
        audioFiles.forEach(file => {
          try {
            const audio = new Audio(`/audio/${file}`);
            audio.preload = 'auto';
            
            // Gérer les événements de chargement
            audio.addEventListener('canplaythrough', () => {
              this.preloadedAudios.set(file, audio);
              fileLoaded();
            }, { once: true });
            
            audio.addEventListener('error', (error) => {
              console.error(`Erreur de chargement de ${file}:`, error);
              fileLoaded(); // On compte quand même pour ne pas bloquer
            });
            
            // Déclenche le chargement sans jouer
            audio.load();
            
            // Ajouter un timeout de sécurité en cas de blocage
            setTimeout(() => {
              if (!this.preloadedAudios.has(file)) {
                console.warn(`Timeout pour ${file}, considéré comme chargé`);
                fileLoaded();
              }
            }, 5000);
          } catch (e) {
            console.error(`Erreur lors de la création de l'audio ${file}:`, e);
            fileLoaded(); // On compte quand même pour ne pas bloquer
          }
        });
        
        // Préchargement des sons du sampler
        samplerSounds.forEach(sound => {
          try {
            const audio = new Audio(`/audio/sampler/${sound}`);
            audio.preload = 'auto';
            
            audio.addEventListener('canplaythrough', () => {
              this.preloadedAudios.set(`sampler/${sound}`, audio);
              fileLoaded();
            }, { once: true });
            
            audio.addEventListener('error', (error) => {
              console.error(`Erreur de chargement du son ${sound}:`, error);
              fileLoaded();
            });
            
            audio.load();
            
            setTimeout(() => {
              if (!this.preloadedAudios.has(`sampler/${sound}`)) {
                console.warn(`Timeout pour ${sound}, considéré comme chargé`);
                fileLoaded();
              }
            }, 5000);
          } catch (e) {
            console.error(`Erreur lors de la création du son ${sound}:`, e);
            fileLoaded();
          }
        });
      } catch (error) {
        console.error('Erreur générale lors du préchargement audio:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Démarre un nouvel audio avec fondu entrant
   */
  private startNewAudio(audioFile: string, loop: boolean): void {
    try {
      let audio: HTMLAudioElement;
      
      // Vérifier si l'audio est préchargé
      if (this.preloadedAudios.has(audioFile)) {
        // Utiliser l'audio préchargé (en le clonant pour pouvoir le réutiliser)
        audio = this.preloadedAudios.get(audioFile)!.cloneNode(true) as HTMLAudioElement;
        console.log(`Utilisation de l'audio préchargé: ${audioFile}`);
      } else {
        // Sinon, créer un nouvel élément audio
        audio = new Audio(`/audio/${audioFile}`);
        console.warn(`Audio ${audioFile} non préchargé, chargement à la volée`);
      }
      
      audio.loop = loop;
      audio.volume = 0;
      
      // Ajouter des gestionnaires d'erreurs
      audio.addEventListener('error', (e) => {
        console.error(`Erreur de lecture audio pour ${audioFile}:`, e);
      });
      
      audio.play().then(() => {
        this.currentAudio = audio;
        this.fadeAudio('in', audio);
      }).catch(error => {
        console.error(`Échec de lecture de ${audioFile}:`, error);
        
        // Tenter de lire un audio par défaut en cas d'échec
        if (audioFile !== this.defaultDayMusic) {
          console.log('Tentative avec la musique par défaut...');
          this.startNewAudio(this.defaultDayMusic, loop);
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'élément audio:', error);
    }
  }
  
  /**
   * Applique un effet de fondu sur un élément audio
   */
  private fadeAudio(direction: FadeDirection, audio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Nettoyer tout intervalle de fondu existant
        if (this.fadeInterval !== null) {
          clearInterval(this.fadeInterval);
        }
        
        const targetVolume = direction === 'in' ? this.volume : 0;
        const step = direction === 'in' ? 0.05 : -0.05;
        const fadeSpeed = 100; // ms entre chaque étape
        
        this.fadeInterval = window.setInterval(() => {
          try {
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
          } catch (error) {
            clearInterval(this.fadeInterval as number);
            this.fadeInterval = null;
            reject(error);
          }
        }, fadeSpeed);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Obtient la liste des fichiers audio disponibles
   * Remarque: Cette fonction est un placeholder. En réalité, une API backend
   * serait nécessaire pour lister les fichiers d'un répertoire.
   */
  public getAvailableAudioFiles(): string[] {
    // Comme nous ne pouvons pas lire directement le contenu d'un répertoire côté client,
    // nous définissons une liste de fichiers audio connus qui commencent par "ambiance_"
    return [
      'ambiance_Violin.mp3',
      'ambiance_blackpearl.webm',
      'ambiance_braveheart.webm',
      'ambiance_clear-haken.webm',
      'ambiance_cobblevillage.webm',
      'ambiance_cosmo.webm',
      'ambiance_dark.mp3',
      'ambiance_defautnuit.webm',
      'ambiance_diablo.webm',
      'ambiance_elwynnforest.webm',
      'ambiance_naruto.webm',
      'Ambiance_The_Last_of_Us.mp3'
    ];
  }
  
  /**
   * Obtient uniquement les fichiers audio qui commencent par "ambiance_"
   */
  public getAmbianceAudioFiles(): string[] {
    return this.getAvailableAudioFiles().filter(file => 
      file.startsWith('ambiance_') || file.startsWith('Ambiance_')
    );
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
   * Obtient la musique par défaut pour le jour
   */
  public getDefaultDayMusic(): string {
    return this.defaultDayMusic;
  }
  
  /**
   * Obtient la musique par défaut pour la nuit
   */
  public getDefaultNightMusic(): string {
    return this.defaultNightMusic;
  }
  
  /**
   * Obtient la musique par défaut pour le vote
   */
  public getDefaultVoteMusic(): string {
    return this.defaultVoteMusic;
  }
  
  /**
   * Vérifie si un fichier audio est préchargé
   */
  public isAudioPreloaded(filename: string): boolean {
    return this.preloadedAudios.has(filename);
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
