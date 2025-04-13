import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, X, Check, AlertCircle, FileAudio2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import audioService from '@/services/audioService';

interface AudioFileUploaderProps {
  onFileUploaded: (fileName: string) => void;
}

const AudioFileUploader: React.FC<AudioFileUploaderProps> = ({ onFileUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Vérifier le type de fichier avec une validation plus souple
      const isMP3 = selectedFile.type.includes('mp3') || selectedFile.type.includes('mpeg');
      const isWEBM = selectedFile.type.includes('webm') || selectedFile.name.toLowerCase().endsWith('.webm');
      const isOGG = selectedFile.type.includes('ogg') || selectedFile.name.toLowerCase().endsWith('.ogg');
      
      if (!isMP3 && !isWEBM && !isOGG) {
        setError('Format de fichier non supporté. Utilisez MP3, WEBM ou OGG.');
        return;
      }
      
      // Vérifier la taille du fichier (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. La taille maximale est de 10MB.');
        return;
      }
      
      setFile(selectedFile);
      console.log(`Fichier accepté: ${selectedFile.name}, type: ${selectedFile.type}`);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      setProgress(0);
      
      // Simulation de progression pour l'interface utilisateur
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);
      
      // Création d'un nom de fichier préfixé pour les ambiances
      let fileName = file.name;
      if (!fileName.startsWith('ambiance_') && !fileName.startsWith('Ambiance_')) {
        fileName = 'ambiance_' + fileName;
      }
      
      // Lecture du fichier
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        if (event.target && event.target.result) {
          try {
            const audioBlob = new Blob([event.target.result], { type: file.type });
            
            // Ajouter au cache
            if ('caches' in window) {
              try {
                const cache = await caches.open('loup-garou-v2');
                await cache.put(`/audio/${fileName}`, new Response(audioBlob));
                
                // Mettre à jour le service audio
                await audioService.addCustomAudio(fileName, audioBlob);
                
                // Terminer et nettoyer
                clearInterval(progressInterval);
                setProgress(100);
                
                setTimeout(() => {
                  setUploading(false);
                  setFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                  onFileUploaded(fileName);
                }, 1000);
              } catch (cacheError) {
                clearInterval(progressInterval);
                console.error('Erreur lors de l\'ajout au cache:', cacheError);
                setError('Erreur lors de l\'enregistrement du fichier audio');
                setUploading(false);
              }
            } else {
              clearInterval(progressInterval);
              setError('Votre navigateur ne supporte pas l\'API Cache, nécessaire pour stocker les fichiers audio');
              setUploading(false);
            }
          } catch (processingError) {
            clearInterval(progressInterval);
            console.error('Erreur lors du traitement du fichier:', processingError);
            setError('Erreur lors du traitement du fichier audio');
            setUploading(false);
          }
        }
      };
      
      fileReader.onerror = () => {
        clearInterval(progressInterval);
        setError('Erreur lors de la lecture du fichier');
        setUploading(false);
      };
      
      fileReader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
      setError('Une erreur est survenue lors du téléchargement');
      setUploading(false);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          {!file ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                >
                  <span>Télécharger un fichier</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="audio/mp3,audio/mpeg,audio/webm,audio/ogg"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">ou glisser-déposer</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">MP3, WEBM, OGG jusqu'à 10MB</p>
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileAudio2 className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-sm">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetForm}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {uploading && (
                <div className="mt-4 space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-gray-500 text-right">{progress}%</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className="self-end"
        >
          {uploading ? 'Téléchargement...' : 'Télécharger'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {progress === 100 && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 flex items-start">
          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-green-700">Fichier téléchargé avec succès!</p>
        </div>
      )}
    </div>
  );
};

export default AudioFileUploader;
