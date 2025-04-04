
import { createContext, useContext, useState, ReactNode } from 'react';

// Removed the imports for Phase and Role since they don't exist in the types module

interface AppContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const defaultContext: AppContextType = {
  theme: 'default',
  setTheme: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>('default');

  const value = {
    theme,
    setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
