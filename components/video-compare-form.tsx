"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { useRef, useState } from "react";
import { fetchFile } from "@ffmpeg/util";

export function VideoCompareForm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ffmpeg, isLoading } = useFFmpeg();
  const [video1, setVideo1] = useState<File | undefined>(undefined);
  const [video2, setVideo2] = useState<File | undefined>(undefined);

  async function merge() {
    if (!ffmpeg) return;

    // Write files to FFmpeg FS (filesystem)
    ffmpeg.writeFile("video1.mp4", await fetchFile(video1));
    ffmpeg.writeFile("video2.mp4", await fetchFile(video2));

    // FFmpeg command to merge videos vertically and extend the shortest
    await ffmpeg.exec([
      "-i",
      "video1.mp4",
      "-i",
      "video2.mp4",
      "-filter_complex",
      "[1:v]scale2ref[2nd][ref];[ref][2nd]vstack=inputs=2",
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "output.mp4",
    ]);

    const data = (await ffmpeg.readFile("output.mp4")) as any;
    // Create a URL for the merged video and set it as the source for the video element
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
    if (videoRef.current) videoRef.current.src = url;
  }

  return (
    <div className="grid gap-4 w-full max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center">Video Merger</h1>
      <p className="text-center text-gray-500 dark:text-gray-400">
        Select two videos to merge and preview the result.
      </p>
      <div className="grid gap-2">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="video1">Video 1</Label>
          <Input
            accept="video/*"
            id="video1"
            type="file"
            onChange={(e) => setVideo1(e.target.files?.[0])}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="video2">Video 2</Label>
          <Input
            accept="video/*"
            id="video2"
            type="file"
            onChange={(e) => setVideo2(e.target.files?.[0])}
          />
        </div>
      </div>
      <Button className="w-full" disabled={isLoading} onClick={merge}>
        {isLoading ? "Initializing..." : "Merge Videos"}
      </Button>
      <div className="rounded-xl overflow-hidden mt-4">
        <span className="w-full aspect-video rounded-md bg-muted">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            controls
          />
        </span>
      </div>
      <Button className="w-full mt-4">Save Video</Button>
    </div>
  );
}
