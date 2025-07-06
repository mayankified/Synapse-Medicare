// polyfill-global.js (import this before using react-dates anywhere)
if (typeof window !== "undefined" && typeof global === "undefined") {
    window.global = window
  }
  