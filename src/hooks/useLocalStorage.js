import { useState, useEffect } from 'react';

/**
 * Custom hook to persist state in localStorage
 * Works just like useState, but saves to browser storage
 *
 * @param {string} key - The localStorage key to use
 * @param {*} initialValue - Default value if nothing is stored
 * @returns {[*, Function]} - Current value and setter function
 */
export function useLocalStorage(key, initialValue) {
  // Get stored value or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
