import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-8 w-14 rounded-full bg-card border border-border transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Toggle knob */}
      <span
        className={`${
          theme === 'light' ? 'translate-x-1' : 'translate-x-7'
        } inline-block w-6 h-6 transform rounded-full bg-muted transition-transform duration-300`}
      />

      {/* Sun icon */}
      <Sun
        className={`absolute left-2 w-4 h-4 text-amber-500 transition-opacity duration-300 ${
          theme === 'dark' ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Moon icon */}
      <Moon
        className={`absolute right-2 w-4 h-4 text-muted-foreground transition-opacity duration-300 ${
          theme === 'light' ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </button>
  );
};

export default ThemeSwitcher;
