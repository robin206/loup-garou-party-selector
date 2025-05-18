
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, X, Check, AlertCircle, FileAudio, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import audioService from '@/services/audioService';
import { Badge } from '@/components/ui/badge';

interface AudioFileUploaderProps {
  onFileUploaded: (fileName: string) => void;
}

const AudioFileUploader: React.FC<AudioFileUploaderProps> = ({ onFileUploaded }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];
      
      selectedFiles.forEach(file => {
        // Vérifier le type de fichier avec une validation plus souple
        const isMP3 = file.type.includes('mp3') || file.type.includes('mpeg');
        const isWEBM = file.type.includes('webm') || file.name.toLowerCase().endsWith('.webm');
        const isOGG = file.type.includes('ogg') || file.name.toLowerCase().endsWith('.ogg');
        
        if (!isMP3 && !isWEBM && !isOGG) {
          invalidFiles.push(`${file.name} (format non supporté)`);
          return;
        }
        
        // Vérifier la taille du fichier (10MB max)
        if (file.size > 15 * 1024 * 1024) {
          invalidFiles.push(`${file.name} (taille > 15MB)`);
          return;
        }
        
        validFiles.push(file);
      });
      
      if (invalidFiles.length > 0) {
        setError(`Fichiers ignorés: ${invalidFiles.join(', ')}`);
      }
      
      if (validFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...validFiles]);
        console.log(`${validFiles.length} fichiers acceptés`);
      }
    }
  };
  
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    try {
      setUploading(true);
      setProgress(0);
      setUploadedFiles([]);
      
      // Calculer le progrès total en fonction du nombre de fichiers
      const progressStep = 100 / files.length;
      let currentProgress = 0;
      let successCount = 0;
      
      for (const file of files) {
        try {
          // Création d'un nom de fichier préfixé pour les ambiances
          let fileName = file.name;
          if (!fileName.startsWith('ambiance_') && !fileName.startsWith('Ambiance_')) {
            fileName = 'ambiance_' + fileName;
          }
          
          // Lecture du fichier
          const fileReader = new FileReader();
          
          const fileLoaded = new Promise<Blob>((resolve, reject) => {
            fileReader.onload = async (event) => {
              if (event.target && event.target.result) {
                try {
                  const audioBlob = new Blob([event.target.result], { type: file.type });
                  resolve(audioBlob);
                } catch (error) {
                  reject(error);
                }
              } else {
                reject(new Error("Erreur lors de la lecture du fichier"));
              }
            };
            
            fileReader.onerror = () => {
              reject(new Error(`Erreur lors de la lecture de ${file.name}`));
            };
          });
          
          // Débuter la lecture du fichier
          fileReader.readAsArrayBuffer(file);
          
          // Attendre que le fichier soit lu
          const audioBlob = await fileLoaded;
          
          // Ajouter au cache
          if ('caches' in window) {
            const cache = await caches.open('loup-garou-v2');
            await cache.put(`/audio/${fileName}`, new Response(audioBlob));
            
            // Mettre à jour le service audio
            await audioService.addCustomAudio(fileName, audioBlob);
            
            // Mettre à jour la liste des fichiers téléchargés
            setUploadedFiles(prev => [...prev, fileName]);
            successCount++;
            
            // Informer le parent qu'un fichier a été téléchargé
            onFileUploaded(fileName);
          } else {
            throw new Error('Votre navigateur ne supporte pas l\'API Cache');
          }
        } catch (fileError) {
          console.error(`Erreur lors du traitement de ${file.name}:`, fileError);
          toast.error(`Échec du téléchargement de ${file.name}`);
        } finally {
          // Mettre à jour la progression globale
          currentProgress += progressStep;
          setProgress(Math.min(Math.round(currentProgress), 99));
        }
      }
      
      // Finaliser l'opération
      setProgress(100);
      
      if (successCount > 0) {
        toast.success(`${successCount} fichier(s) audio téléchargé(s) avec succès`);
        
        // Nettoyer après un délai
        setTimeout(() => {
          setFiles([]);
          setUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 2000);
      } else {
        setError("Aucun fichier n'a pu être téléchargé");
        setUploading(false);
      }
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
      setError('Une erreur est survenue lors du téléchargement');
      setUploading(false);
    }
  };
  
  const resetForm = () => {
    setFiles([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        {!files.length ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
              >
                <span>Télécharger des fichiers</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="audio/mp3,audio/mpeg,audio/webm,audio/ogg"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  multiple
                />
              </label>
              <p className="pl-1">ou glisser-déposer</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">MP3, WEBM, OGG jusqu'à 10MB par fichier</p>
          </div>
        ) : (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2 mb-2">
              <div className="flex items-center">
                <FileAudio className="h-5 w-5 text-blue-500 mr-2" />
                <span className="font-medium">{files.length} fichier(s) sélectionné(s)</span>
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
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                  <div className="flex items-center overflow-hidden">
                    <Music className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="ml-2 text-xs text-gray-500 flex-shrink-0">
                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 rounded-full"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            {uploading && (
              <div className="mt-4 space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-500 text-right">{progress}%</p>
                
                {uploadedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {uploadedFiles.map((name, idx) => (
                      <Badge key={idx} variant="outline" className="bg-green-50">
                        <Check className="h-3 w-3 mr-1 text-green-500" />
                        <span className="truncate max-w-48">{name}</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <Button 
          onClick={handleUpload}
          disabled={!files.length || uploading}
          className={files.length ? "self-end" : "hidden"}
        >
          {uploading ? 'Téléchargement...' : `Télécharger ${files.length} fichier(s)`}
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
          <p className="text-sm text-green-700">Import terminé avec succès!</p>
        </div>
      )}
    </div>
  );
};

export default AudioFileUploader;
