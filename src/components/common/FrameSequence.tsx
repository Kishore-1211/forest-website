"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export interface FrameSequenceHandle {
  setProgress: (progress: number) => void;
}

interface FrameSequenceProps {
  folder: string;
  frameCount: number;
  className?: string;
}

export const FrameSequence = forwardRef<
  FrameSequenceHandle,
  FrameSequenceProps
>(function FrameSequence(
  { folder, frameCount, className },
  ref
) {
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
      Math.floor(progress * (frameCount - 1))
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

    imagesRef.current = [];
    let loaded = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();

      img.src = `${folder}/frame_${String(i).padStart(4, "0")}.png`;

      img.onload = () => {
        loaded++;

        if (loaded === 1) {
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }

        if (loaded === frameCount) {
          console.log(`Loaded ${frameCount} frames`);
        }
      };

      imagesRef.current.push(img);
    }
  }, [folder, frameCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full object-cover ${className ?? ""}`}
    />
  );
});