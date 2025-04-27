
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Fonction pour forcer la mise à jour du service worker
const updateServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('Service worker mis à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du service worker:', error);
    }
  }
};

// Timestamp for update: 2025-04-14-1
// Au chargement de l'application, on force la mise à jour
updateServiceWorker();

const root = document.getElementById("root");
if (root) {
  const rootInstance = createRoot(root);
  rootInstance.render(<App />);
} else {
  console.error("Root element not found");
}
