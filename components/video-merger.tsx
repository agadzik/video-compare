"use client";

import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

export function VideoMerger() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ffmpeg, isLoading } = useFFmpeg();
  const [merged, setMerged] = useState(false);

  async function merge() {
    if (!ffmpeg) return;

    await ffmpeg.exec([
      "-i",
      "video1-timer.mp4",
      "-i",
      "video2-timer.mp4",
      "-filter_complex",
      "[1:v]scale2ref[2nd][ref];[ref][2nd]vstack=inputs=2",
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");

    if (videoRef.current && data instanceof Uint8Array) {
      videoRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
    }

    setMerged(true);
  }

  return (
    <div className="w-full h-full relative">
      {merged ? (
        <a
          className="absolute top-0 left-0"
          href={videoRef.current?.src}
          download="merged.mp4"
        >
          save
        </a>
      ) : (
        <Button
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          onClick={merge}
        >
          Merge
        </Button>
      )}
      <video className="w-full h-full object-contain" ref={videoRef} />
    </div>
  );
}
