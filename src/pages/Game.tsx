
import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { GameState, CharacterType, GamePhase } from '@/types';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import GameMasterGuide from '@/components/GameMasterGuide';

const Game = () => {
  const location = useLocation();
  const gameState = location.state as GameState;
  
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [assignedRoles, setAssignedRoles] = useState<CharacterType[]>([]);
  const [showRole, setShowRole] = useState<boolean>(false);
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [dayCount, setDayCount] = useState<number>(1);
  const [roleDistribution, setRoleDistribution] = useState<boolean>(false);
  const [gameMasterView, setGameMasterView] = useState<boolean>(false);

  // If no game state is provided, redirect to the home page
  if (!gameState) {
    return <Navigate to="/" replace />;
  }

  const { players, characters, selectedCharacters } = gameState;

  // Prepare characters with action information
  useEffect(() => {
    if (characters && selectedCharacters && selectedCharacters.length > 0) {
      const updatedCharacters = characters.map(char => {
        if (char.id === 'werewolf') {
          return {
            ...char, 
            actionPhase: 'night', 
            actionOrder: 10, 
            actionDescription: 'Demandez aux Loups-Garous de se réveiller et de choisir une victime.'
          };
        } else if (char.id === 'seer') {
          return {
            ...char, 
            actionPhase: 'night', 
            actionOrder: 20, 
            actionDescription: 'Demandez à la Voyante de se réveiller et de désigner un joueur dont elle veut connaître l\'identité.'
          };
        } else if (char.id === 'witch') {
          return {
            ...char, 
            actionPhase: 'night', 
            actionOrder: 30, 
            actionDescription: 'Demandez à la Sorcière de se réveiller. Montrez-lui la victime et demandez si elle veut utiliser sa potion de vie ou de mort.'
          };
        } else if (char.id === 'hunter') {
          return {
            ...char, 
            actionPhase: 'day', 
            actionOrder: 10, 
            actionDescription: 'Si le Chasseur est tué, il doit immédiatement désigner un joueur qui mourra avec lui.'
          };
        } else if (char.id === 'little-girl') {
          return {
            ...char, 
            actionPhase: 'night', 
            actionOrder: 15, 
            actionDescription: 'La Petite Fille peut espionner les Loups-Garous pendant leur tour.'
          };
        } else if (char.id === 'cupid') {
          return {
            ...char, 
            actionPhase: 'night', 
            actionOrder: 5, 
            actionDescription: 'Lors de la première nuit uniquement, demandez à Cupidon de désigner deux amoureux.'
          };
        } else if (char.id === 'bodyguard') {
          return {
            ...char, 
            actionPhase: 'night', 
            actionOrder: 25, 
            actionDescription: 'Demandez au Garde du Corps de désigner un joueur qu\'il souhaite protéger cette nuit.'
          };
        } else if (char.id === 'white-werewolf') {
          return {
            ...char, 
            actionPhase: 'night', 
            actionOrder: 35, 
            actionDescription: 'Une fois dans la partie, le Loup-Garou Blanc peut éliminer un autre Loup-Garou.'
          };
        }
        // Add other character actions here
        return char;
      });
      
      // Only apply updates to selected characters
      const selectedCharactersWithActions = updatedCharacters.filter(char => 
        selectedCharacters.includes(char.id)
      );
      
      setAssignedRoles(selectedCharactersWithActions);
    }
  }, [characters, selectedCharacters]);

  // Assign roles when the component mounts if they haven't been assigned yet
  const assignRoles = () => {
    // Get the selected character objects
    const selectedCharacterObjects = characters.filter(char => 
      selectedCharacters.includes(char.id)
    );
    
    // Calculate how many roles we need to fill
    const rolesToFill = players - selectedCharacterObjects.length;
    
    // If we need additional villagers to fill the player count
    let assignedCharacters = [...selectedCharacterObjects];
    
    if (rolesToFill > 0) {
      // Add villagers to fill the remaining spots
      const villager = characters.find(char => char.id === 'villager');
      if (villager) {
        for (let i = 0; i < rolesToFill; i++) {
          assignedCharacters.push(villager);
        }
      }
    }
    
    // Shuffle the roles
    assignedCharacters = shuffleArray(assignedCharacters);
    
    setAssignedRoles(assignedCharacters);
    setRoleDistribution(true);
    toast.success(`${players} rôles ont été assignés et mélangés!`);
  };

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleNext = () => {
    if (currentStep < assignedRoles.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowRole(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowRole(false);
    }
  };

  const toggleShowRole = () => {
    setShowRole(prev => !prev);
  };

  const handlePhaseChange = (newPhase: GamePhase) => {
    setGamePhase(newPhase);
    
    // Increment day count when moving from night to day
    if (newPhase === 'day' && gamePhase === 'night') {
      setDayCount(prevCount => prevCount + 1);
    }
    
    toast.success(`Phase changée: ${newPhase}`);
  };

  const toggleGameMasterView = () => {
    setGameMasterView(prev => !prev);
    if (!gameMasterView) {
      toast.info("Mode Maître du Jeu activé");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto pt-24 pb-12 px-4 flex flex-col items-center justify-center">
        {!roleDistribution ? (
          <div className="glass-card p-8 rounded-xl text-center max-w-md animate-scale-in">
            <h2 className="text-2xl font-bold mb-4">Distribution des Rôles</h2>
            <p className="mb-6 text-gray-600">
              Vous avez sélectionné {selectedCharacters.length} rôles pour {players} joueurs.
              Cliquez sur le bouton ci-dessous pour assigner et mélanger les rôles.
            </p>
            <Button 
              onClick={assignRoles} 
              className="bg-werewolf-accent hover:bg-werewolf-accent/90 text-white"
              size="lg"
            >
              <Shuffle className="mr-2 h-5 w-5" /> Mélanger et Distribuer
            </Button>
          </div>
        ) : gameMasterView ? (
          <div className="w-full flex flex-col items-center">
            <GameMasterGuide 
              characters={assignedRoles}
              phase={gamePhase}
              onPhaseChange={handlePhaseChange}
              dayCount={dayCount}
            />
            
            <Button 
              variant="outline" 
              onClick={toggleGameMasterView} 
              className="mt-6"
            >
              Retourner à la distribution des rôles
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="glass-card p-8 rounded-xl text-center max-w-md w-full animate-scale-in relative">
              <div className="absolute top-4 left-4 text-sm font-medium text-gray-500">
                Joueur {currentStep + 1}/{players}
              </div>
              
              <h2 className="text-2xl font-bold mb-6">Votre Rôle</h2>
              
              <div 
                className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center bg-gray-100 cursor-pointer transition-all"
                onClick={toggleShowRole}
              >
                {showRole ? (
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {assignedRoles[currentStep].icon === 'moon' ? '🌙' : 
                       assignedRoles[currentStep].icon === 'eye' ? '👁️' : 
                       assignedRoles[currentStep].icon === 'flask' ? '🧪' : 
                       assignedRoles[currentStep].icon === 'crosshair' ? '🎯' : 
                       assignedRoles[currentStep].icon === 'shield' ? '🛡️' : 
                       assignedRoles[currentStep].icon === 'heart' ? '❤️' : 
                       assignedRoles[currentStep].icon === 'message' ? '💬' : '👤'}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">Cliquer pour révéler</span>
                )}
              </div>
              
              {showRole && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-bold text-werewolf-accent mb-2">
                    {assignedRoles[currentStep].name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {assignedRoles[currentStep].description}
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4">
                    {assignedRoles[currentStep].team === 'werewolf' && (
                      <span className="text-werewolf-blood">Équipe des Loups-Garous</span>
                    )}
                    {assignedRoles[currentStep].team === 'village' && (
                      <span className="text-blue-600">Équipe du Village</span>
                    )}
                    {assignedRoles[currentStep].team === 'solo' && (
                      <span className="text-amber-600">Joueur Solo</span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious} 
                  disabled={currentStep === 0}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={toggleShowRole}
                  className="mx-2"
                >
                  {showRole ? 'Cacher' : 'Révéler'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleNext} 
                  disabled={currentStep === assignedRoles.length - 1}
                  className="flex items-center"
                >
                  Suivant <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={toggleGameMasterView}
              className="mt-8 bg-werewolf-accent hover:bg-werewolf-accent/90"
            >
              Mode Maître du Jeu
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Game;
