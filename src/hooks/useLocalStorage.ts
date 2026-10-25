import { useState } from 'react';

/**
 * Generic hook for persisting state in localStorage with optional validation.
 * @param key Storage key
 * @param initialValue Initial value if no valid stored value exists
 * @param validator Optional function that returns true if the value is acceptable.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validator?: (value: T) => boolean,
) {
  // Initialise state; only parse stored value if it passes the optional validator.
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item) as T;
        if (!validator || validator(parsed)) {
          return parsed;
        }
        console.warn(`Invalid value for localStorage key "${key}", falling back to initial value.`);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    return initialValue;
  });

  // Wrapped setter that validates before persisting.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      if (validator && !validator(valueToStore)) {
        console.warn(`Attempted to store invalid value for key "${key}", operation ignored.`);
        return;
      }
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
