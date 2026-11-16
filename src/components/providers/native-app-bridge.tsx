"use client";

import { useEffect } from "react";

/**
 * Glue for the Android app (Capacitor loads this site in a WebView and injects
 * `window.Capacitor`). No npm dependency: plugins are reached through the
 * injected bridge, so the website itself is unaffected and this is a no-op in
 * a normal browser.
 */
type ListenerHandle = { remove: () => void };
type CapacitorBridge = {
  isNativePlatform?: () => boolean;
  Plugins?: {
    App?: {
      addListener: (
        event: "backButton",
        cb: (e: { canGoBack: boolean }) => void,
      ) => Promise<ListenerHandle> | ListenerHandle;
      minimizeApp: () => Promise<void>;
    };
  };
};

export function NativeAppBridge() {
  useEffect(() => {
    const cap = (window as unknown as { Capacitor?: CapacitorBridge }).Capacitor;
    if (!cap?.isNativePlatform?.()) return;
    document.documentElement.classList.add("native-app");

    const app = cap.Plugins?.App;
    if (!app) return;
    let handle: ListenerHandle | undefined;
    // Android back button: go back in history, or send the app to the background
    // from a top-level screen instead of closing it.
    Promise.resolve(
      app.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack && window.history.length > 1) window.history.back();
        else void app.minimizeApp();
      }),
    ).then((h) => (handle = h));
    return () => handle?.remove();
  }, []);

  return null;
}
