
/** Durée du fondu sortant de la musique en cours lors d'un changement d'ambiance ou d'un arrêt. */
const FADE_MS = 2000;
/** Pas de rafraîchissement du volume pendant un fondu. */
const FADE_STEP_MS = 50;

/**
 * Une piste d'ambiance en cours de lecture. Chaque piste a son propre élément audio
 * et son propre fondu sortant : un fondu n'en écrase jamais un autre.
 */
interface Track {
  file: string;
  audio: HTMLAudioElement;
  /** Niveau de fondu de 0 à 1, multiplié par le volume général pour obtenir le volume réel. */
  level: number;
  fadeTimer: number | null;
  releaseTimer: number | null;
}

class AudioService {
  /** Piste d'ambiance audible (la plus récente démarrée avec succès). */
  private current: Track | null = null;
  /** Pistes en fondu sortant, libérées une fois le fondu terminé. */
  private leaving: Set<Track> = new Set();
  /** Numéro de la dernière demande de lecture : une demande plus ancienne qui aboutit en retard est abandonnée. */
  private requestId = 0;
  /** Instant (performance.now) où toutes les pistes en fondu sortant seront silencieuses. */
  private silentAt = 0;
  private volume: number = 0.7;
  private preloadedAudios: Map<string, HTMLAudioElement> = new Map();
  private preloadComplete: boolean = false;
  private preloadPromise: Promise<void> | null = null;
  private customAudios: Set<string> = new Set();
  
  // Musiques par défaut mises à jour avec les nouveaux fichiers d'ambiance
  private defaultDayMusic = 'ambiance/cobblevillage.webm';
  private defaultNightMusic = 'ambiance/night_village.webm';
  private defaultVoteMusic = 'ambiance/epic_Paint_It_Black.mp3';
  
  constructor() {
    // Volume enregistré (curseur de volume) : sans cela le service démarre à 70 % tant qu'on
    // n'est pas passé par la page de configuration, qui était la seule à l'appliquer.
    try {
      const saved = parseInt(localStorage.getItem('werewolf-volume') ?? '', 10);
      if (Number.isFinite(saved)) this.volume = Math.max(0, Math.min(1, saved / 100));
    } catch {
      // localStorage indisponible : on garde la valeur par défaut
    }
    // Charger les fichiers audio personnalisés précédemment ajoutés
    this.loadCustomAudiosFromStorage();
  }
  
  /**
   * Charge la liste des fichiers audio personnalisés à partir du localStorage
   */
  private loadCustomAudiosFromStorage(): void {
    try {
      const customAudiosJson = localStorage.getItem('werewolf-custom-audios');
      if (customAudiosJson) {
        const customAudiosArray = JSON.parse(customAudiosJson);
        if (Array.isArray(customAudiosArray)) {
          this.customAudios = new Set(customAudiosArray);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers audio personnalisés:', error);
    }
  }
  
  /**
   * Sauvegarde la liste des fichiers audio personnalisés dans le localStorage
   */
  private saveCustomAudiosToStorage(): void {
    try {
      localStorage.setItem('werewolf-custom-audios', JSON.stringify(Array.from(this.customAudios)));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des fichiers audio personnalisés:', error);
    }
  }
  
  /**
   * Ajoute un fichier audio personnalisé
   */
  public async addCustomAudio(fileName: string, audioBlob: Blob): Promise<void> {
    try {
      // Ajouter à la liste des fichiers personnalisés
      this.customAudios.add(fileName);
      this.saveCustomAudiosToStorage();
      
      // Précharger le fichier audio
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = URL.createObjectURL(audioBlob);
      
      return new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', () => {
          this.preloadedAudios.set(fileName, audio);
          console.log(`Audio personnalisé préchargé: ${fileName}`);
          resolve();
        }, { once: true });
        
        audio.addEventListener('error', (error) => {
          console.error(`Erreur de chargement de l'audio personnalisé ${fileName}:`, error);
          reject(error);
        });
        
        audio.load();
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'audio personnalisé:', error);
      throw error;
    }
  }
  
  /**
   * Joue une ambiance. Si une musique est en cours, elle baisse doucement jusqu'au silence
   * (FADE_MS), puis la nouvelle démarre d'un coup au volume normal. Pas de fondu enchaîné.
   * Le nouveau fichier se charge pendant le fondu sortant, pour démarrer sans délai.
   * Sans musique en cours, la nouvelle démarre tout de suite au volume normal.
   */
  public playAudio(audioFile: string, loop: boolean = true): void {
    // Cette ambiance joue déjà (et n'est pas en train de s'éteindre) : rien à faire
    if (this.current && this.current.file === audioFile && !this.current.audio.paused) {
      return;
    }

    const requestId = ++this.requestId;
    const track = this.createTrack(audioFile, loop);

    const previous = this.current;
    this.current = null;
    if (previous) this.retireTrack(previous, FADE_MS);

    const start = () => {
      // Une demande plus récente (ou un arrêt) est arrivée entre-temps : on abandonne
      if (requestId !== this.requestId) {
        this.disposeTrack(track);
        return;
      }
      track.audio.play().then(() => {
        if (requestId !== this.requestId) {
          this.disposeTrack(track);
          return;
        }
        this.current = track;
        track.level = 1;
        track.audio.volume = this.volume;
      }).catch(error => {
        console.error(`Échec de lecture de ${audioFile}:`, error);
        this.disposeTrack(track);
      });
    };

    // On attend que toute musique en fondu sortant (y compris d'un clic précédent) soit silencieuse
    const wait = this.silentAt - performance.now();
    if (wait > 0) {
      window.setTimeout(start, wait + 50);
    } else {
      start();
    }
  }

  /**
   * Joue un son du sampler sans interrompre la musique de fond
   */
  public playSampleSound(soundName: string): void {
    try {
      // S'assurer que le nom contient bien le préfixe "sampler_"
      const fullSoundName = soundName.startsWith('sampler_') ? soundName : `sampler_${soundName}`;
      
      // Vérifier si le son est préchargé
      const cacheKey = `sampler/${fullSoundName}`;
      let sampleSound: HTMLAudioElement;
      
      if (this.preloadedAudios.has(cacheKey)) {
        sampleSound = this.preloadedAudios.get(cacheKey)!.cloneNode(true) as HTMLAudioElement;
      } else {
        // Construire le chemin complet avec le préfixe s'il n'est pas déjà présent
        sampleSound = new Audio(`/audio/sampler/${fullSoundName}`);
        console.warn(`Son ${fullSoundName} non préchargé, chargement à la volée`);
      }
      
      sampleSound.volume = this.volume;
      sampleSound.play().catch(error => {
        console.error(`Erreur lors de la lecture du son ${fullSoundName}:`, error);
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'élément audio pour le sampler:', error);
    }
  }
  
  /**
   * Arrête l'ambiance en cours avec un fondu sortant.
   * Annule aussi toute lecture demandée mais pas encore démarrée.
   */
  public stopAudio(): void {
    this.requestId++;
    if (this.current) {
      this.retireTrack(this.current, FADE_MS);
      this.current = null;
    }
  }

  /**
   * Précharge tous les fichiers audio dans le cache
   */
  public preloadAudioFiles(): Promise<void> {
    // Un seul préchargement à la fois : chaque page qui monte useAudio() l'appelle,
    // et relancer des dizaines de téléchargements en parallèle saturait la connexion.
    if (!this.preloadPromise) {
      this.preloadPromise = this.doPreloadAudioFiles().catch(error => {
        this.preloadPromise = null;
        throw error;
      });
    }
    return this.preloadPromise;
  }

  private doPreloadAudioFiles(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadComplete) {
        resolve();
        return;
      }
      
      try {
        // Seules les musiques de jour, nuit et vote choisies sont préchargées (les autres
        // se chargent à la demande) : précharger tout le catalogue (~90 Mo) saturait la connexion.
        const audioFiles = this.getPhaseMusicFiles();
        const samplerSounds = [
          'sampler_loup.ogg', 
          'sampler_ours.ogg', 
          'sampler_clocher.ogg', 
          'sampler_tonnerre.ogg',
          'sampler_hunter.ogg',
          'sampler_clock.ogg',
          'sampler_violon.ogg'
        ];
        
        // Ajouter les fichiers personnalisés à précharger
        const customAudios = Array.from(this.customAudios);
        
        let loadedCount = 0;
        const totalFiles = audioFiles.length + samplerSounds.length + customAudios.length;
        
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
            // Vérifier si c'est un fichier d'ambiance (nouveau dossier)
            const audioPath = file.startsWith('ambiance/') ? `/audio/${file}` : `/audio/${file}`;
            const audio = new Audio(audioPath);
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
        
        // Préchargement des fichiers audio personnalisés depuis le cache
        customAudios.forEach(async (fileName) => {
          try {
            if ('caches' in window) {
              const cache = await caches.open('loup-garou-v2');
              const response = await cache.match(`/audio/${fileName}`);
              
              if (response) {
                const blob = await response.blob();
                const audio = new Audio();
                audio.preload = 'auto';
                audio.src = URL.createObjectURL(blob);
                
                audio.addEventListener('canplaythrough', () => {
                  this.preloadedAudios.set(fileName, audio);
                  fileLoaded();
                }, { once: true });
                
                audio.addEventListener('error', (error) => {
                  console.error(`Erreur de chargement de l'audio personnalisé ${fileName}:`, error);
                  fileLoaded();
                });
                
                audio.load();
              } else {
                console.warn(`Fichier audio personnalisé ${fileName} non trouvé dans le cache`);
                fileLoaded();
              }
            } else {
              console.warn('API Cache non supportée, impossible de précharger les fichiers audio personnalisés');
              fileLoaded();
            }
          } catch (e) {
            console.error(`Erreur lors du préchargement de l'audio personnalisé ${fileName}:`, e);
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
   * Crée la piste (élément audio muet, volume 0) pour un fichier d'ambiance.
   */
  private createTrack(audioFile: string, loop: boolean): Track {
    let audio: HTMLAudioElement;
    if (this.preloadedAudios.has(audioFile)) {
      // Copie de l'élément préchargé (le même fichier peut être rejoué plus tard)
      audio = this.preloadedAudios.get(audioFile)!.cloneNode(true) as HTMLAudioElement;
    } else {
      audio = new Audio(`/audio/${audioFile}`);
      console.warn(`Audio ${audioFile} non préchargé, chargement à la volée`);
    }
    audio.loop = loop;
    audio.volume = 0;
    audio.preload = 'auto';
    audio.addEventListener('error', (e) => {
      console.error(`Erreur de lecture audio pour ${audioFile}:`, e);
    });
    return { file: audioFile, audio, level: 0, fadeTimer: null, releaseTimer: null };
  }

  /**
   * Fondu d'une piste vers un niveau cible (1 = plein volume, 0 = silence). Sert au fondu sortant.
   * Le fondu est calculé sur l'horloge réelle : si le navigateur ralentit les minuteurs,
   * il rattrape son retard au tick suivant au lieu de se prolonger.
   * La courbe en cosinus donne un fondu sortant doux.
   */
  private fadeTrack(track: Track, target: number, durationMs: number): void {
    this.cancelFade(track);
    const from = track.level;
    const startedAt = performance.now();

    const apply = (level: number) => {
      track.level = level;
      track.audio.volume = Math.max(0, Math.min(1, level * this.volume));
    };

    track.fadeTimer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / durationMs);
      const curve = target > from ? Math.sin(progress * Math.PI / 2) : 1 - Math.cos(progress * Math.PI / 2);
      apply(from + (target - from) * curve);
      if (progress >= 1) {
        apply(target);
        this.cancelFade(track);
      }
    }, FADE_STEP_MS);
  }

  private cancelFade(track: Track): void {
    if (track.fadeTimer !== null) {
      clearInterval(track.fadeTimer);
      track.fadeTimer = null;
    }
  }

  /**
   * Fait baisser une piste jusqu'au silence puis la libère.
   */
  private retireTrack(track: Track, durationMs: number): void {
    this.leaving.add(track);
    this.silentAt = Math.max(this.silentAt, performance.now() + durationMs);
    this.fadeTrack(track, 0, durationMs);
    track.releaseTimer = window.setTimeout(() => this.disposeTrack(track), durationMs + 200);
  }

  /**
   * Arrête définitivement une piste et libère ses ressources.
   */
  private disposeTrack(track: Track): void {
    this.cancelFade(track);
    if (track.releaseTimer !== null) {
      clearTimeout(track.releaseTimer);
      track.releaseTimer = null;
    }
    try {
      track.audio.pause();
      track.audio.currentTime = 0;
    } catch (error) {
      console.error('Erreur lors de l\'arrêt de la piste audio:', error);
    }
    this.leaving.delete(track);
    if (this.current === track) this.current = null;
  }

  /**
   * Musiques réellement utilisées par la partie (jour, nuit, vote), sans doublon.
   */
  private getPhaseMusicFiles(): string[] {
    const read = (key: string, fallback: string) => {
      try {
        return localStorage.getItem(key) || fallback;
      } catch {
        return fallback;
      }
    };
    const files = [
      read('werewolf-day-music', this.defaultDayMusic),
      read('werewolf-night-music', this.defaultNightMusic),
      read('werewolf-vote-music', this.defaultVoteMusic),
    ];
    return Array.from(new Set(files));
  }

  /**
   * Obtient la liste des fichiers audio disponibles
   */
  public getAvailableAudioFiles(): string[] {
    // Liste des fichiers audio par défaut (mise à jour avec les nouveaux fichiers d'ambiance)
    const defaultAudios = [
      'ambiance/cobblevillage.webm',
      'ambiance/night_village.webm',
      'ambiance/epic_Paint_It_Black.mp3',
      'ambiance/braveheart.webm',
      'ambiance/clear-haken.webm',
      'ambiance/diablo.webm',
      'ambiance/epic_toxic.mp3',
      'ambiance/FF7_CosmoCanion.webm',
      'ambiance/naruto.webm',
      'ambiance/pirate_blackpearl.webm',
      'ambiance/The_Last_of_Us.mp3',
      'ambiance/Violin.mp3',
      'ambiance/wow_elwynnforest.webm',
      'ambiance/Dark.mp3'
    ];
    
    // Ajouter les fichiers audio personnalisés
    return [...defaultAudios, ...Array.from(this.customAudios)];
  }
  
  /**
   * Obtient uniquement les fichiers audio qui commencent par "ambiance/"
   */
  public getAmbianceAudioFiles(): string[] {
    return this.getAvailableAudioFiles().filter(file => 
      file.startsWith('ambiance/')
    );
  }
  
  /**
   * Définit le volume global
   */
  public setVolume(volume: number): void {
    if (!Number.isFinite(volume)) return;
    this.volume = Math.max(0, Math.min(1, volume));
    // Applique le nouveau volume immédiatement, en respectant le niveau de fondu de chaque piste
    const tracks = this.current ? [this.current, ...this.leaving] : [...this.leaving];
    tracks.forEach(track => {
      track.audio.volume = Math.max(0, Math.min(1, track.level * this.volume));
    });
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
