"use client";

import { useEffect } from "react";

export function NavScrollEffect() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("header[data-nav]");
    const update = () =>
      header?.setAttribute("data-scrolled", String(window.scrollY > 10));
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return null;
}
