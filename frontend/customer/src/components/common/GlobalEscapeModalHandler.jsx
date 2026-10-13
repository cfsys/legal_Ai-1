import { useEffect } from 'react';

/**
 * Global Escape Key Listener for Modals
 * Automatically detects any open modal dialog or overlay in the DOM and closes it on Escape.
 */
export function GlobalEscapeModalHandler() {
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key !== 'Escape' && e.key !== 'Esc') return;

      // Find all potential modal overlay containers currently in DOM
      const allElements = Array.from(document.querySelectorAll('div, dialog, [role="dialog"], [aria-modal="true"]'));
      
      const modalOverlays = allElements.filter((el) => {
        if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;

        // Check if fixed overlay covering the screen
        const isFixed = style.position === 'fixed';
        const isFullCover = (
          (style.top === '0px' && style.bottom === '0px') ||
          (style.inset === '0px') ||
          (el.offsetWidth >= window.innerWidth * 0.9 && el.offsetHeight >= window.innerHeight * 0.9)
        );
        const hasOverlayBg = (
          style.backgroundColor.includes('rgba') ||
          style.backgroundColor.includes('rgb(15') ||
          style.backdropFilter !== 'none'
        );

        return (isFixed && isFullCover && hasOverlayBg) || el.getAttribute('role') === 'dialog' || el.getAttribute('aria-modal') === 'true';
      });

      if (modalOverlays.length === 0) return;

      // Pick the topmost modal overlay (highest z-index or deepest in DOM tree)
      const topModal = modalOverlays[modalOverlays.length - 1];

      // Find close button inside this modal
      // 1. Look for button containing Lucide X icon or aria-label="Close" or Cancel button
      const closeBtn = topModal.querySelector(
        'button[aria-label="Close"], button[aria-label="close"], button.modal-close, button[data-close], button:has(svg.lucide-x), button:has(svg)'
      ) || Array.from(topModal.querySelectorAll('button')).find((btn) => {
        const text = btn.textContent?.trim().toLowerCase();
        return text === 'cancel' || text === 'close' || text === '×' || text === '✕';
      });

      if (closeBtn && typeof closeBtn.click === 'function') {
        e.preventDefault();
        e.stopPropagation();
        closeBtn.click();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown, true);
    };
  }, []);

  return null;
}

export default GlobalEscapeModalHandler;
