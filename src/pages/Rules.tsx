
import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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

const Rules = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameState = location.state as GameState;
  
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
              {/* Villagers */}
              <a href="#villageois" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/img/perso_villageois.svg" alt="Villageois" />
                  <AvatarFallback>V</AvatarFallback>
                </Avatar>
                <span>Villageois</span>
              </a>
              
              <a href="#villageoises" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/img/perso_villageoises.svg" alt="Villageoises" />
                  <AvatarFallback>VS</AvatarFallback>
                </Avatar>
                <span>Villageoises</span>
              </a>

              <a href="#maire" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/img/perso_maire.svg" alt="Maire" />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
                <span>Maire</span>
              </a>

              {/* Wolf characters */}
              <a href="#loup" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/img/perso_loup.svg" alt="Loup-Garou" />
                  <AvatarFallback>LG</AvatarFallback>
                </Avatar>
                <span>Loup-Garou</span>
              </a>

              <a href="#chienloup" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/img/perso_chienloup.svg" alt="Chien-Loup" />
                  <AvatarFallback>CL</AvatarFallback>
                </Avatar>
                <span>Chien-Loup</span>
              </a>

              {/* Special characters */}
              <a href="#bouc" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/img/perso_bouc.svg" alt="Bouc Émissaire" />
                  <AvatarFallback>BE</AvatarFallback>
                </Avatar>
                <span>Bouc Émissaire</span>
              </a>

              <a href="#renard" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/img/perso_renard.svg" alt="Renard" />
                  <AvatarFallback>R</AvatarFallback>
                </Avatar>
                <span>Renard</span>
              </a>

              <a href="#voleur" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/img/perso_voleur.svg" alt="Voleur" />
                  <AvatarFallback>V</AvatarFallback>
                </Avatar>
                <span>Voleur</span>
              </a>

              <a href="#montreur" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/img/perso_montreur.svg" alt="Montreur d'Ours" />
                  <AvatarFallback>MO</AvatarFallback>
                </Avatar>
                <span>Montreur d'Ours</span>
              </a>

              <a href="#flutiste" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/img/perso_flute.svg" alt="Joueur de Flûte" />
                  <AvatarFallback>JF</AvatarFallback>
                </Avatar>
                <span>Joueur de Flûte</span>
              </a>
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

            {/* Character descriptions */}
            <AccordionItem value="villageois" id="villageois">
              <AccordionTrigger>Villageois</AccordionTrigger>
              <AccordionContent>
                <div className="flex">
                  <img src="/img/perso_villageois.svg" alt="Villageois" className="w-16 h-16 mr-4 float-left" />
                  <div>
                    <p>
                      Les villageois n'ont aucun pouvoir particulier. Leur seule arme est leur perspicacité, leur talent oratoire et leur capacité à repérer les loups-garous parmi les joueurs.
                    </p>
                    <p className="mt-2">
                      Pendant la nuit, ils dorment et ne se réveillent pas. Pendant le jour, ils participent au débat et au vote.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="villageoises" id="villageoises">
              <AccordionTrigger>Villageoises</AccordionTrigger>
              <AccordionContent>
                <div className="flex">
                  <img src="/img/perso_villageoises.svg" alt="Villageoises" className="w-16 h-16 mr-4 float-left" />
                  <div>
                    <p>
                      Les villageoises sont identiques aux villageois, mais leur genre est féminin. Elles peuvent être importantes dans le cadre de certaines extensions où le genre des personnages a une importance.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="maire" id="maire">
              <AccordionTrigger>Maire</AccordionTrigger>
              <AccordionContent>
                <div className="flex">
                  <img src="/img/perso_maire.svg" alt="Maire" className="w-16 h-16 mr-4 float-left" />
                  <div>
                    <p>
                      Le Maire est un personnage particulier car il n'est pas attribué en début de partie. Il est élu par vote lors du premier jour. En cas d'égalité, un second tour est organisé entre les candidats à égalité.
                    </p>
                    <p className="mt-2">
                      Son vote compte double lors des votes du village. Si le Maire est éliminé, il désigne son successeur.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="loup" id="loup">
              <AccordionTrigger>Loup-Garou</AccordionTrigger>
              <AccordionContent>
                <div className="flex">
                  <img src="/img/perso_loup.svg" alt="Loup-Garou" className="w-16 h-16 mr-4 float-left" />
                  <div>
                    <p>
                      Les Loups-garous se réveillent chaque nuit et désignent ensemble une victime à dévorer. Pendant la journée, ils se font passer pour des villageois.
                    </p>
                    <p className="mt-2">
                      Les loups-garous connaissent l'identité des autres loups et doivent collaborer discrètement pour éliminer tous les villageois.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="chienloup" id="chienloup">
              <AccordionTrigger>Chien-Loup</AccordionTrigger>
              <AccordionContent>
                <div className="flex">
                  <img src="/img/perso_chienloup.svg" alt="Chien-Loup" className="w-16 h-16 mr-4 float-left" />
                  <div>
                    <p>
                      Le Chien-Loup doit choisir au début de la première nuit s'il rejoint le camp des Loups-Garous ou celui des Villageois.
                    </p>
                    <p className="mt-2">
                      S'il choisit les Loups-Garous, il se réveille chaque nuit avec eux et participe au choix de la victime. S'il choisit les Villageois, il reste un simple villageois sans pouvoir particulier.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="bouc" id="bouc">
              <AccordionTrigger>Bouc Émissaire</AccordionTrigger>
              <AccordionContent>
                <div className="flex">
                  <img src="/img/perso_bouc.svg" alt="Bouc Émissaire" className="w-16 h-16 mr-4 float-left" />
                  <div>
                    <p>
                      Le Bouc Émissaire est un villageois sans pouvoir particulier, mais si les votes l'éliminent ou si les joueurs n'arrivent pas à se mettre d'accord sur qui éliminer, c'est lui qui est automatiquement éliminé.
                    </p>
                    <p className="mt-2">
                      Après sa mort, il désigne un joueur qui ne pourra plus voter jusqu'à la fin de la partie.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="renard" id="renard">
              <AccordionTrigger>Renard</AccordionTrigger>
              <AccordionContent>
                <div className="flex">
                  <img src="/img/perso_renard.svg" alt="Renard" className="w-16 h-16 mr-4 float-left" />
                  <div>
                    <p>
                      Le Renard peut, chaque nuit, flairer un joueur et ses voisins directs. Si au moins l'un des trois joueurs flairés est un Loup-Garou, le meneur lui fait signe que oui.
                    </p>
                    <p className="mt-2">
                      S'il se trompe et qu'aucun des trois n'est un Loup-Garou, il perd son pouvoir jusqu'à la fin de la partie.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="voleur" id="voleur">
              <AccordionTrigger>Voleur</AccordionTrigger>
              <AccordionContent>
                <div className="flex">
                  <img src="/img/perso_voleur.svg" alt="Voleur" className="w-16 h-16 mr-4 float-left" />
                  <div>
                    <p>
                      Au début de la partie, deux cartes supplémentaires sont placées face cachée. Le Voleur, lors de la première nuit, peut regarder ces deux cartes et choisir d'échanger sa carte contre l'une d'elles.
                    </p>
                    <p className="mt-2">
                      S'il choisit une carte de Loup-Garou, il rejoint le camp des Loups-Garous. Sinon, il conserve son rôle initial ou prend celui qu'il a choisi.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="montreur" id="montreur">
              <AccordionTrigger>Montreur d'Ours</AccordionTrigger>
              <AccordionContent>
                <div className="flex">
                  <img src="/img/perso_montreur.svg" alt="Montreur d'Ours" className="w-16 h-16 mr-4 float-left" />
                  <div>
                    <p>
                      Chaque matin, l'ours du Montreur d'Ours grogne si au moins un de ses voisins directs est un Loup-Garou. Ce grognement est entendu par tous les joueurs.
                    </p>
                    <p className="mt-2">
                      Cette information peut être précieuse pour le village mais peut aussi révéler la position du Montreur d'Ours aux Loups-Garous.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="flutiste" id="flutiste">
              <AccordionTrigger>Joueur de Flûte</AccordionTrigger>
              <AccordionContent>
                <div className="flex">
                  <img src="/img/perso_flute.svg" alt="Joueur de Flûte" className="w-16 h-16 mr-4 float-left" />
                  <div>
                    <p>
                      Le Joueur de Flûte joue solo et cherche à charmer tous les joueurs encore en vie. Chaque nuit, il peut charmer deux joueurs qui le suivront s'ils sont encore en vie à la fin de la partie.
                    </p>
                    <p className="mt-2">
                      Les joueurs charmés continuent à jouer normalement mais savent qu'ils sont charmés. Le Joueur de Flûte gagne si tous les joueurs encore en vie sont charmés.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Game Phases */}
            <AccordionItem value="game-phases">
              <AccordionTrigger>Phases de jeu</AccordionTrigger>
              <AccordionContent>
                <div className="prose prose-slate max-w-none">
                  <h3 className="text-xl font-semibold mb-3">La Nuit</h3>
                  <p className="mb-4">
                    Pendant la nuit, les joueurs ferment les yeux. Le meneur de jeu appelle les personnages dans un ordre précis pour qu'ils accomplissent leurs actions spéciales :
                  </p>
                  <ol className="list-decimal pl-6 mb-4">
                    <li>Le Voleur (première nuit seulement)</li>
                    <li>Le Chien-Loup (première nuit seulement)</li>
                    <li>Le Renard</li>
                    <li>Les Loups-Garous</li>
                    <li>Le Joueur de Flûte</li>
                    <li>Autres personnages spéciaux selon les extensions</li>
                  </ol>

                  <h3 className="text-xl font-semibold mb-3">Le Jour</h3>
                  <p className="mb-4">
                    Au lever du jour, tous les joueurs ouvrent les yeux. Le meneur annonce qui a été dévoré pendant la nuit (ce joueur révèle sa carte et ne participe plus au jeu).
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
