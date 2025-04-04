
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context interface
interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

// Create a provider component
export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <AppContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook for using the context
export const useAppContext = () => useContext(AppContext);
