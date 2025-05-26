import React, { createContext, useState, useEffect } from 'react';

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [typeface, setTypeface] = useState('System');

  // Optionally, load preferences from persistent storage here (e.g., AsyncStorage)

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <PreferencesContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        fontSize,
        setFontSize,
        typeface,
        setTypeface,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
