
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileAudio, Music } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/hooks/useAudio';
import audioService from '@/services/audioService';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AudioFileUploader from '@/components/AudioFileUploader';

const MusicAdmin = () => {
  const navigate = useNavigate();
  const { getAvailableAudios, playSampleSound, stopMusic } = useAudio();
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  
  useEffect(() => {
    // Charger la liste des fichiers audio disponibles
    setAudioFiles(getAvailableAudios());
  }, [getAvailableAudios]);
  
  const handleBackToConfig = () => {
    navigate('/config');
  };
  
  const handlePlayAudio = (fileName: string) => {
    stopMusic();
    const isAmbiance = fileName.startsWith('ambiance_') || fileName.startsWith('Ambiance_');
    if (isAmbiance) {
      audioService.playAudio(fileName, true);
    } else {
      playSampleSound(fileName);
    }
    toast.info(`Lecture de ${fileName}`);
  };
  
  const handleMusicUploaded = (fileName: string) => {
    // Rafraîchir la liste des fichiers
    setAudioFiles(getAvailableAudios());
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto pt-24 pb-12 px-4">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={handleBackToConfig}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la configuration
          </Button>
        </div>
        
        <section className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-werewolf-accent/10 rounded-full mb-4 animate-fade-in">
            <Music className="h-8 w-8 text-werewolf-accent animate-pulse-subtle" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl animate-fade-up">
            Gestion des musiques
          </h1>
          
          <p className="mx-auto max-w-2xl text-gray-500 text-lg animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Ajoutez et gérez les musiques d'ambiance pour votre partie de Loup Garou
          </p>
        </section>

        <div className="glass-card p-8 rounded-xl space-y-8 animate-scale-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Ajouter des nouvelles musiques
              </CardTitle>
              <CardDescription>
                Formats acceptés: MP3, WEBM, OGG. Taille maximale: 10 MB par fichier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AudioFileUploader onFileUploaded={handleMusicUploaded} />
            </CardContent>
          </Card>
          
          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileAudio className="h-5 w-5" />
              Musiques disponibles
            </h2>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du fichier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audioFiles.map((file) => (
                  <TableRow key={file}>
                    <TableCell className="font-medium">{file}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePlayAudio(file)}
                      >
                        Tester
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      
      <footer className="w-full border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        <p>Loup Garou de Thiercelieux © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default MusicAdmin;
