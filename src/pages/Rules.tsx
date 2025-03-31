
import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { GameState } from '@/types';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Rules = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameState = location.state as GameState;
  const [rulesContent, setRulesContent] = useState<string>('');
  
  useEffect(() => {
    // Fetch the rules HTML content when the component mounts
    fetch('/regles.html')
      .then(response => response.text())
      .then(html => {
        setRulesContent(html);
        
        // Process the HTML to modify image display after content is loaded
        setTimeout(() => {
          // Make summary images display as avatars
          const summaryLinks = document.querySelectorAll('.rules-content ul li a');
          summaryLinks.forEach(link => {
            const img = link.querySelector('img');
            if (img) {
              const imgSrc = img.getAttribute('src');
              const imgAlt = img.getAttribute('alt') || 'Character';
              
              // Create avatar container
              const avatarContainer = document.createElement('div');
              avatarContainer.className = 'flex items-center gap-2';
              
              // Create avatar element
              const avatar = document.createElement('div');
              avatar.className = 'rounded-full overflow-hidden w-10 h-10 flex-shrink-0';
              
              // Set the image inside the avatar
              const newImg = document.createElement('img');
              newImg.src = imgSrc || '';
              newImg.alt = imgAlt;
              newImg.className = 'w-full h-full object-cover';
              
              avatar.appendChild(newImg);
              
              // Create text span
              const textSpan = document.createElement('span');
              textSpan.textContent = link.textContent || '';
              
              // Replace link content
              link.innerHTML = '';
              avatarContainer.appendChild(avatar);
              avatarContainer.appendChild(textSpan);
              link.appendChild(avatarContainer);
              link.classList.add('flex', 'items-center');
            }
          });
          
          // Make content images smaller and float left
          const contentImages = document.querySelectorAll('.rules-content h3 ~ p img');
          contentImages.forEach(img => {
            const imgElement = img as HTMLImageElement;
            imgElement.style.float = 'left';
            imgElement.style.width = '80px';
            imgElement.style.height = 'auto';
            imgElement.style.marginRight = '15px';
            imgElement.style.marginBottom = '10px';
          });
          
          // Make the summary images display in a flex row
          const summaryUl = document.querySelector('.rules-content > ul');
          if (summaryUl) {
            summaryUl.className = 'flex flex-wrap gap-3 mb-6';
            
            const summaryItems = summaryUl.querySelectorAll('li');
            summaryItems.forEach(item => {
              item.className = 'flex-shrink-0';
            });
          }
        }, 100);
      })
      .catch(error => {
        console.error('Error fetching rules content:', error);
      });
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
        
        {/* Render the fetched HTML content */}
        <div 
          className="rules-content glass-card p-8 rounded-xl animate-fade-up"
          dangerouslySetInnerHTML={{ __html: rulesContent }}
        />
      </main>
      
      <footer className="w-full border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        <p>Loup Garou de Thiercelieux © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Rules;
