import { useEffect } from 'react';

/**
 * Custom hook to trigger a callback when the Escape key is pressed
 * @param {Function} onEscape - Callback function to run when Escape is pressed
 * @param {boolean} isActive - Whether the listener is currently active (e.g., modal is open)
 */
export function useEscapeKey(onEscape, isActive = true) {
  useEffect(() => {
    if (!isActive || !onEscape) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.stopPropagation();
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEscape, isActive]);
}

export default useEscapeKey;
