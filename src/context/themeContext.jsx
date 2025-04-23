import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
        document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
