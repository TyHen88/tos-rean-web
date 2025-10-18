export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[GymMine] Service Worker registered:", registration)
        })
        .catch((error) => {
          console.log("[GymMine] Service Worker registration failed:", error)
        })
    })
  }
}
