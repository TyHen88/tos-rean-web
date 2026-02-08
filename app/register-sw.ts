export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[TosRean] Service Worker registered:", registration)
        })
        .catch((error) => {
          console.log("[TosRean] Service Worker registration failed:", error)
        })
    })
  }
}
