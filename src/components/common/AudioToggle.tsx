"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Optional, user-controlled forest ambience per ASSETS.md — never
 * autoplays, volume stays low, and playback is only ever a direct result
 * of the user clicking this button. Glass/blur treatment is one of the
 * few places DESIGN_SYSTEM.md allows it (floating controls).
 */
export function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }

  return (
    <>
      <audio ref={audioRef} loop preload="none" src="/audio/forest-ambient.mp3" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Mute forest ambience" : "Play forest ambience"}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full",
          "border border-soft-white/30 bg-soft-white/20 text-soft-white backdrop-blur-md",
          "transition duration-[250ms] ease-out hover:bg-soft-white/30",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-gold",
          "motion-reduce:transition-none",
        )}
      >
        {isPlaying ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
      </button>
    </>
  );
}

function SpeakerOnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 6a8 8 0 0 1 0 12" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M16 9l5 6M21 9l-5 6" />
    </svg>
  );
}
