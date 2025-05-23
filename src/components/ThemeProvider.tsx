
import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps as NextThemeProviderProps } from 'next-themes/dist/types';

export interface ThemeProviderProps extends Omit<NextThemeProviderProps, 'attribute'> {
  children: React.ReactNode;
}

export function ThemeProvider({ 
  children,
  defaultTheme = 'light',
  enableSystem = false,
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey={storageKey}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
