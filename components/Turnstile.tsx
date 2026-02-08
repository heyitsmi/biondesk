"use client";

import { useEffect, useRef, useState } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: (error: any) => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
}

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function Turnstile({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = "auto",
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);

  useEffect(() => {
    // If the script is already loaded, render the widget
    if (window.turnstile) {
      renderWidget();
      return;
    }

    // Load the script
    const scriptId = "cloudflare-turnstile-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        renderWidget();
      };
      document.body.appendChild(script);
    } else {
        // If script exists but not loaded yet, wait for it
        // Check if window.turnstile becomes available
        const checkInterval = setInterval(() => {
            if (window.turnstile) {
                clearInterval(checkInterval);
                renderWidget();
            }
        }, 100);
    }

    return () => {
      // Cleanup widget on unmount
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  const renderWidget = () => {
    if (!containerRef.current || !window.turnstile) return;

    // Check if widget already rendered in this container
    if (containerRef.current.innerHTML !== "") {
        // already rendered? 
        // Turnstile.remove might have cleared it. 
        // Best to just clear it to be safe
         containerRef.current.innerHTML = "";
    }
   
    try {
      const id = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => onVerify(token),
        "error-callback": (error: any) => onError?.(error),
        "expired-callback": () => onExpire?.(),
        theme,
      });
      setWidgetId(id);
    } catch (e) {
      console.error("Turnstile render error:", e);
    }
  };

  return <div ref={containerRef} className="py-2" />;
}
