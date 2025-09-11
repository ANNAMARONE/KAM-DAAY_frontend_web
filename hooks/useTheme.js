import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer le thème global
 * Peut être utilisé dans n'importe quel composant
 */
export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialiser le thème au chargement
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDark);
    }

    // Écouter les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Appliquer le thème au document
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const setTheme = (theme) => {
    setIsDarkMode(theme === 'dark');
  };

  // Récupérer les valeurs CSS calculées
  const getThemeValue = (cssVariable) => {
    const root = document.documentElement;
    return getComputedStyle(root).getPropertyValue(cssVariable).trim();
  };

  // Helper pour obtenir des couleurs spécifiques
  const getColors = () => {
    return {
      primary: getThemeValue('--primary-solid'),
      secondary: getThemeValue('--secondary'),
      accent: getThemeValue('--accent-solid'),
      success: getThemeValue('--success'),
      warning: getThemeValue('--warning'),
      error: getThemeValue('--error'),
      info: getThemeValue('--info'),
      background: getThemeValue('--background-solid'),
      foreground: getThemeValue('--foreground'),
      card: getThemeValue('--card'),
      border: getThemeValue('--border'),
    };
  };

  // Helper pour obtenir les classes de couleur appropriées
  const getThemeClasses = () => {
    const baseClasses = {
      page: 'bg-gradient-page transition-colors duration-300',
      card: 'card-theme',
      button: 'btn-primary',
      input: 'input-theme',
      text: {
        primary: 'text-theme-primary',
        secondary: 'text-theme-secondary',
        muted: 'text-theme-muted',
      },
      shadow: {
        sm: 'shadow-theme-sm',
        md: 'shadow-theme-md',
        lg: 'shadow-theme-lg',
        xl: 'shadow-theme-xl',
      }
    };

    return baseClasses;
  };

  return {
    isDarkMode,
    theme: isDarkMode ? 'dark' : 'light',
    toggleTheme,
    setTheme,
    getThemeValue,
    getColors,
    getThemeClasses,
  };
};

export default useTheme;