
import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Moon, Sun } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { GameState } from '@/types';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

interface CharacterInfo {
  name: string;
  description: string;
  id: string;
  image: string;
}

const Rules = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameState = location.state as GameState;
  const [characters, setCharacters] = useState<CharacterInfo[]>([]);
  
  useEffect(() => {
    // Parse the characters from the text file
    fetch('/personnages_regles.txt')
      .then(response => response.text())
      .then(text => {
        const charactersData: CharacterInfo[] = text.split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => {
            const [name, description] = line.split('|');
            
            // Generate an ID from the name
            const id = name.toLowerCase().replace(/[^\w]/g, '-');
            
            // Determine the image path based on the character name
            const imageName = name.toLowerCase()
              .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
              .replace(/[^\w]/g, '')
              .replace(/loupsgarus/, 'loup')
              .replace(/voyante/, 'voyante')
              .replace(/sorcière/, 'sorciere')
              .replace(/mainloup/, 'grandloup')
              .replace(/petite fille/, 'fille')
              .replace(/servante dévouée/, 'servante')
              .replace(/maire/, 'maire')
              .replace(/joueur de flûte/, 'flute')
              .replace(/montreur d'ours/, 'montreur')
              .replace(/bouc émissaire/, 'bouc')
              .replace(/infect père des loups/, 'infectloup')
              .replace(/grandméchantloup/, 'grandloup')
              .replace(/chienloup/, 'chienloup');
              
            return {
              name,
              description,
              id,
              image: `/img/perso_${imageName}.svg`
            };
          });
          
        setCharacters(charactersData);
      })
      .catch(error => console.error('Error loading characters:', error));
  }, []);
  
  const handleBackToGame = () => {
    // Try to load game state from localStorage
    const savedGameState = localStorage.getItem('werewolf-game-current-state');
    
    if (savedGameState) {
      try {
        const parsedGameState = JSON.parse(savedGameState);
        toast.success("Retour à la partie en cours...");
        navigate('/game', { state: parsedGameState });
      } catch (e) {
        console.error("Error parsing saved game state:", e);
        navigate('/');
      }
    } else if (gameState) {
      navigate('/game', { state: gameState });
    } else {
      navigate('/');
    }
  };

  // Group characters by their type
  const villageCharacters = characters.filter(char => 
    !char.name.toLowerCase().includes('loup') && 
    !char.name.toLowerCase().includes('infect') && 
    !char.name.toLowerCase().includes('blanc') &&
    !char.name.toLowerCase().includes('chien-loup')
  );
  
  const wolfCharacters = characters.filter(char => 
    char.name.toLowerCase().includes('loup') || 
    char.name.toLowerCase().includes('infect') || 
    char.name.toLowerCase().includes('blanc') ||
    char.name.toLowerCase().includes('chien-loup')
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto pt-24 pb-12 px-4">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={handleBackToGame}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au jeu
          </Button>
        </div>
        
        <div className="glass-card p-8 rounded-xl animate-fade-up">
          <h1 className="text-3xl font-bold mb-6 text-center">Règles du Jeu</h1>
          
          {/* Characters Summary */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Personnages</h2>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {characters.map((character) => (
                <a 
                  key={character.id} 
                  href={`#${character.id}`} 
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={character.image} alt={character.name} />
                    <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{character.name}</span>
                </a>
              ))}
            </div>
          </section>

          <Accordion type="single" collapsible className="w-full">
            {/* Basic Rules */}
            <AccordionItem value="basic-rules">
              <AccordionTrigger>Règles de base</AccordionTrigger>
              <AccordionContent>
                <div className="prose prose-slate max-w-none">
                  <h3 className="text-xl font-semibold mb-3">But du jeu</h3>
                  <p className="mb-4">
                    Être la dernière équipe avec au moins un joueur en vie. Chaque joueur appartient à l'une des équipes suivantes :
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Les villageois (y compris personnages spéciaux) : ils doivent éliminer tous les loups-garous.</li>
                    <li>Les loups-garous : ils doivent éliminer tous les villageois.</li>
                    <li>Certains personnages jouent "solo" avec des conditions de victoire particulières.</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Déroulement d'une partie</h3>
                  <p className="mb-4">
                    La partie alterne entre deux phases : la nuit et le jour. Pendant la nuit, les loups-garous et certains personnages spéciaux agissent en secret. Pendant le jour, les joueurs débattent et désignent un joueur à éliminer par vote.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* All Characters */}
            <AccordionItem value="all-characters">
              <AccordionTrigger>Tous les personnages</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  {characters.map((character) => (
                    <div key={character.id} id={character.id} className="py-3 border-b border-gray-100 last:border-0">
                      <div className="flex gap-4 items-start">
                        <Avatar className="h-16 w-16 shrink-0">
                          <AvatarImage src={character.image} alt={character.name} />
                          <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{character.name}</h3>
                          <p className="text-sm text-gray-700">{character.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Game Phases */}
            <AccordionItem value="game-phases">
              <AccordionTrigger>Phases de jeu</AccordionTrigger>
              <AccordionContent>
                <div className="prose prose-slate max-w-none">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-slate-900 text-white p-3 rounded-full">
                      <Moon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-0">La Nuit</h3>
                  </div>
                  
                  <p className="mb-4">
                    Pendant la nuit, les joueurs ferment les yeux. Le meneur de jeu appelle les personnages dans un ordre précis pour qu'ils accomplissent leurs actions spéciales :
                  </p>
                  
                  <ol className="list-decimal pl-6 mb-6 space-y-2">
                    <li><strong>Le Voleur</strong> (première nuit seulement) : il peut échanger sa carte avec l'une des deux cartes supplémentaires.</li>
                    <li><strong>Le Cupidon</strong> (première nuit seulement) : il désigne deux personnes qui seront amoureuses.</li>
                    <li><strong>Les Amoureux</strong> se reconnaissent (première nuit seulement après Cupidon).</li>
                    <li><strong>Le Voyante</strong> : elle peut voir l'identité d'un joueur.</li>
                    <li><strong>Le Loup Blanc</strong> (une nuit sur deux) : il peut éliminer un autre loup-garou.</li>
                    <li><strong>Les Loups-Garous</strong> : ils choisissent une victime à dévorer.</li>
                    <li><strong>La Sorcière</strong> : elle peut sauver la victime des loups ou empoisonner quelqu'un.</li>
                    <li><strong>Le Joueur de Flûte</strong> : il charme deux joueurs.</li>
                    <li><strong>Les Joueurs Charmés</strong> se reconnaissent.</li>
                  </ol>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-400 text-white p-3 rounded-full">
                      <Sun className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-0">Le Jour</h3>
                  </div>
                  
                  <p className="mb-4">
                    Au lever du jour, tous les joueurs ouvrent les yeux. Le meneur annonce qui a été dévoré pendant la nuit, ainsi que d'autres informations selon les rôles en jeu (grognement de l'ours du Montreur d'Ours, etc.).
                  </p>
                  
                  <p className="mb-4">
                    Les joueurs débattent ensuite pour tenter d'identifier les Loups-Garous. À la fin du débat, un vote est organisé pour éliminer un joueur suspecté d'être un Loup-Garou.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Victory Conditions */}
            <AccordionItem value="victory-conditions">
              <AccordionTrigger>Conditions de Victoire</AccordionTrigger>
              <AccordionContent>
                <div className="prose prose-slate max-w-none">
                  <ul className="list-disc pl-6 mb-4">
                    <li><strong>Les Villageois gagnent</strong> si tous les Loups-Garous sont éliminés.</li>
                    <li><strong>Les Loups-Garous gagnent</strong> s'ils sont aussi nombreux que les Villageois.</li>
                    <li><strong>Le Joueur de Flûte gagne</strong> si tous les joueurs encore en vie sont charmés.</li>
                    <li><strong>Les Amoureux gagnent</strong> s'ils sont les derniers en vie (dans le cas où ils sont de camps opposés).</li>
                    <li><strong>L'Ange déchu gagne</strong> s'il est éliminé au premier vote du village.</li>
                    <li><strong>L'Abominable sectaire gagne</strong> s'il est le dernier survivant de son camp.</li>
                  </ul>
                  <p>
                    La partie se termine immédiatement dès qu'une condition de victoire est remplie.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      
      <footer className="w-full border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        <p>Loup Garou de Thiercelieux © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Rules;
