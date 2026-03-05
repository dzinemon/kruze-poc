/**
 * Google Charts loader utility
 * Ensures the Google Charts library is loaded once globally
 * Returns a promise that resolves to the google object
 */

type GoogleType = {
  charts: {
    load: (version: string, options: { packages: string[] }) => void;
    setOnLoadCallback: (callback: () => void) => void;
  };
  visualization: Record<string, any>;
};

declare global {
  interface Window {
    google?: GoogleType;
  }
}

let loadPromise: Promise<GoogleType> | null = null;

export const loadGoogleCharts = (): Promise<GoogleType> => {
  // Return cached promise if already loading/loaded
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (typeof window !== "undefined" && window.google?.charts) {
      resolve(window.google);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";

    script.onload = () => {
      if (!window.google) {
        reject(new Error("Google Charts library failed to load"));
        return;
      }

      window.google.charts.load("current", {
        packages: ["corechart", "bar", "table"],
      });

      window.google.charts.setOnLoadCallback(() => {
        if (window.google) {
          resolve(window.google);
        }
      });
    };

    script.onerror = () => {
      reject(new Error("Failed to load Google Charts loader script"));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};
