import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · Legal AI` : "Legal AI · Legal Intelligence. Reimagined.";
    if (description) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) { m = document.createElement("meta"); m.name = "description"; document.head.appendChild(m); }
      m.content = description;
    }
  }, [title, description]);
}

export default ScrollToTop;
