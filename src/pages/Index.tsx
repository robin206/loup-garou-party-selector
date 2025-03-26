
import React from 'react';
import Header from '@/components/Header';
import GameSetup from '@/components/GameSetup';
import WolfLogo from '@/components/WolfLogo';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto pt-24 pb-12 px-4">
        <section className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-werewolf-accent/10 rounded-full mb-4 animate-fade-in">
            <WolfLogo className="h-8 w-8 text-werewolf-accent animate-pulse-subtle" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl animate-fade-up">
            Loup Garou de Thiercelieux
          </h1>
          
          <p className="mx-auto max-w-2xl text-gray-400 text-lg animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Configurez votre partie, sélectionnez les personnages et démarrez l'aventure avec vos amis.
          </p>
        </section>

        <GameSetup />
      </main>
      
      <footer className="w-full border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        <p>Loup Garou de Thiercelieux © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
