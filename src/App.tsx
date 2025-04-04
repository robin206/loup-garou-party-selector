import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Game from './pages/Game';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Setup from './pages/Setup';
import Help from './pages/Help';
import { AppContextProvider } from './context/AppContext';
import { Phase, Role } from './types';
import Themes from './pages/Themes';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AppContextProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/game" element={<Game />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/themes" element={<Themes />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </AppContextProvider>
  );
}

export default App
