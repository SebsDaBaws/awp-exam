import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(document, <RemixBrowser />);

// Register a service worker
/* 
TODO: if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(
    `/sw.js?manifestUrl=${window.__remixManifest.url}`
  );
}
*/