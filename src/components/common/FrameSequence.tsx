"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { cn } from "@/lib/cn";

export interface FrameSequenceHandle {
  setProgress: (progress: number) => void;
}

interface FrameSequenceProps {
  folder: string;
  frameCount: number;
  /**
   * Additional CSS classes to merge with the canvas defaults.
   * Base classes (absolute inset-0 w-full h-full object-cover) are always
   * applied — pass only supplemental classes here (e.g. a z-index override).
   */
  className?: string;
}

export const FrameSequence = forwardRef<
  FrameSequenceHandle,
  FrameSequenceProps
>(function FrameSequence({ folder, frameCount, className }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentFrameRef = useRef(-1);

  useImperativeHandle(ref, () => ({
    setProgress(progress: number) {
      const canvas = canvasRef.current;
      const ctx = contextRef.current;

      if (!canvas || !ctx) return;

      const images = imagesRef.current;
      if (images.length === 0) return;

      const frame = Math.min(
        frameCount - 1,
        Math.floor(progress * (frameCount - 1)),
      );

      if (frame === currentFrameRef.current) return;

      const image = images[frame];
      if (!image || !image.complete) return;

      currentFrameRef.current = frame;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    contextRef.current = ctx;

    const images: HTMLImageElement[] = new Array(frameCount);
    imagesRef.current = images;
    let sizedCanvas = false;

    const loadFrame = (i: number) => {
      const img = new Image();
      img.src = `${folder}/frame_${String(i).padStart(4, "0")}.webp`;
      img.onload = () => {
        // Pre-decode so the pixel data is GPU-ready before setProgress needs it.
        img.decode?.().catch(() => {});
        if (!sizedCanvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          sizedCanvas = true;
        }
      };
      images[i - 1] = img;
    };

    // Load the first second of frames immediately (critical for first-paint).
    const PRIORITY_FRAMES = Math.min(60, frameCount);
    for (let i = 1; i <= PRIORITY_FRAMES; i++) loadFrame(i);

    // Remaining frames during idle time so they don't block the main thread
    // during the initial render, but arrive as fast as the network allows.
    // requestIdleCallback is unavailable on Safari before 16.4, where calling it
    // unguarded would throw and abort this effect — losing every frame past the
    // priority batch — so fall back to a timeout there.
    const hasIdleCallback = typeof requestIdleCallback === "function";
    const schedule = (fn: () => void) =>
      hasIdleCallback ? requestIdleCallback(fn) : window.setTimeout(fn, 1);
    const cancel = (id: number) =>
      hasIdleCallback ? cancelIdleCallback(id) : window.clearTimeout(id);

    const idleIds: number[] = [];
    const IDLE_BATCH = 30;
    for (let b = 0; b < Math.ceil((frameCount - PRIORITY_FRAMES) / IDLE_BATCH); b++) {
      const start = PRIORITY_FRAMES + b * IDLE_BATCH + 1;
      const end = Math.min(PRIORITY_FRAMES + (b + 1) * IDLE_BATCH, frameCount);
      idleIds.push(
        schedule(() => {
          for (let i = start; i <= end; i++) loadFrame(i);
        }),
      );
    }

    return () => idleIds.forEach(cancel);
  }, [folder, frameCount]);

  return (
    <canvas
      ref={canvasRef}
      // Base classes are always applied. The `object-cover` CSS property
      // works on canvas elements (treated as replaced elements) in all
      // modern browsers, matching the same technique used on <img>/<video>.
      className={cn(
        "absolute inset-0 w-full h-full object-cover",
        className,
      )}
    />
  );
});
