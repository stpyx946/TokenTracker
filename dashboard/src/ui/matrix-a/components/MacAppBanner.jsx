import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const DISMISS_KEY = "macAppBannerDismissed";
const RELEASE_URL = "https://github.com/mm7894215/tokentracker/releases/latest";

/**
 * Clawd pixel-art SVG component — the 15×16 character drawn as rects.
 * Matches clawd-static-base.svg from Clawd-on-Desk.
 */
function ClawdPixel({ size = 48, className = "" }) {
  const scale = size / 16;
  const [eyesClosed, setEyesClosed] = useState(false);

  useEffect(() => {
    const blink = () => {
      const delay = 2500 + Math.random() * 3000;
      const timer = setTimeout(() => {
        setEyesClosed(true);
        setTimeout(() => {
          setEyesClosed(false);
          blink();
        }, 120);
      }, delay);
      return timer;
    };
    const timer = blink();
    return () => clearTimeout(timer);
  }, []);

  const bodyColor = "#DE886D";
  const eyeColor = "#000000";

  return (
    <svg
      width={15 * scale}
      height={10 * scale}
      viewBox="0 5.5 15 10"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Torso */}
      <rect x="2" y="6" width="11" height="7" fill={bodyColor} />
      {/* Arms */}
      <rect x="0" y="9" width="2" height="2" fill={bodyColor} />
      <rect x="13" y="9" width="2" height="2" fill={bodyColor} />
      {/* Legs */}
      <rect x="3" y="13" width="1" height="2" fill={bodyColor} />
      <rect x="5" y="13" width="1" height="2" fill={bodyColor} />
      <rect x="9" y="13" width="1" height="2" fill={bodyColor} />
      <rect x="11" y="13" width="1" height="2" fill={bodyColor} />
      {/* Shadow */}
      <rect x="3" y="15" width="9" height="1" fill="#000" opacity="0.12" />
      {/* Eyes */}
      {eyesClosed ? (
        <>
          <rect x="4" y="9" width="1" height="0.4" fill={eyeColor} />
          <rect x="10" y="9" width="1" height="0.4" fill={eyeColor} />
        </>
      ) : (
        <>
          <rect x="4" y="8" width="1" height="2" fill={eyeColor} />
          <rect x="10" y="8" width="1" height="2" fill={eyeColor} />
        </>
      )}
    </svg>
  );
}

/**
 * Banner prompting local-mode users to install the macOS Menu Bar App.
 * Shows animated Clawd character + download CTA. Dismissible.
 */
export function MacAppBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return true;
      // Auto-dismiss if opened from menu bar app
      if (new URLSearchParams(window.location.search).get("from") === "menubar") {
        localStorage.setItem(DISMISS_KEY, "1");
        return true;
      }
      return false;
    } catch { return false; }
  });

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch {}
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-oai-gray-200 dark:border-oai-gray-800 bg-white dark:bg-oai-gray-900 p-4"
      >
        <div className="flex items-center gap-3">
          {/* Clawd character with breathing animation */}
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex-shrink-0"
          >
            <ClawdPixel size={44} />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-oai-gray-900 dark:text-oai-white">
              Try the Menu Bar App
            </div>
            <div className="text-xs text-oai-gray-500 dark:text-oai-gray-400 mt-0.5">
              Always-on stats with Clawd companion
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.a
              href={RELEASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-oai-gray-900 dark:bg-oai-white dark:text-oai-gray-900 rounded-md hover:opacity-90 transition-opacity"
            >
              Download
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-70">
                <path d="M6 2v6m0 0L3.5 5.5M6 8l2.5-2.5M2 10h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
            <button
              onClick={handleDismiss}
              className="p-1 text-oai-gray-400 hover:text-oai-gray-600 dark:hover:text-oai-gray-300 transition-colors"
              aria-label="Dismiss"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 4l6 6m0-6L4 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
