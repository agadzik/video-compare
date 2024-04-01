"use client";

import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";

const fontSize = 64;

interface VideoInputProps {
  id: string;
  label: string;
}

export function VideoInput({ id, label }: VideoInputProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isGeneratingRef = useRef(false);
  const [video, setVideo] = useState<File | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const { ffmpeg, isLoading } = useFFmpeg();

  const generate = useCallback(async () => {
    if (!ffmpeg) return;

    ffmpeg.on("progress", ({ progress: newProgress }) => {
      setProgress((prev) => Math.max(prev, Math.round(newProgress * 100)));
    });

    const inputFilename = `${id}.mp4`;
    const outputFilename = `${id}-timer.mp4`;

    ffmpeg.writeFile(inputFilename, await fetchFile(video));

    await ffmpeg.exec([
      "-i",
      inputFilename,
      "-vf",
      `pad=iw:ih+${fontSize}:0:0:color=Black,drawtext=fontfile=/monospace.ttf:text='%{pts}':x=0:y=(main_h-th):fontsize=${fontSize}:fontcolor=white:box=1:boxcolor=Black@0.8:boxborderw=10`,
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      outputFilename,
    ]);

    const data = await ffmpeg.readFile(outputFilename);

    if (videoRef.current && data instanceof Uint8Array) {
      videoRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
    }
  }, [ffmpeg, id, video]);

  useEffect(() => {
    if (!video || !ffmpeg || isLoading || isGeneratingRef.current) return;

    isGeneratingRef.current = true;
    generate().finally(() => {
      isGeneratingRef.current = false;
    });
  }, [video, isLoading, ffmpeg, generate]);

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideo(e.target.files?.[0]);
    void generate();
  };

  return (
    <>
      {!video ? (
        <>
          <h2 className="absolute top-2 left-2 font-bold">{label}</h2>
          <Input
            accept="video/*"
            className="w-1/2"
            type="file"
            onChange={handleVideoFileChange}
            id={id}
          />
        </>
      ) : null}
      {video ? (
        <video className="w-full h-full object-contain" ref={videoRef} />
      ) : null}
    </>
  );
}
