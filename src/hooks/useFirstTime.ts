import { useState, useEffect, useCallback } from 'react';

const FIRST_TIME_KEY = 'notes-app-first-visit';

interface UseFirstTimeReturn {
  isFirstTime: boolean;
  markVisited: () => void;
}

export const useFirstTime = (): UseFirstTimeReturn => {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem(FIRST_TIME_KEY);
    setIsFirstTime(hasVisited === null);
    setIsLoaded(true);
  }, []);

  const markVisited = useCallback(() => {
    localStorage.setItem(FIRST_TIME_KEY, 'true');
    setIsFirstTime(false);
  }, []);

  return {
    isFirstTime: isLoaded && isFirstTime,
    markVisited,
  };
};
