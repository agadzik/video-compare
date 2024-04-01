import { load } from "@/lib/ffmpeg";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { useRef } from "react";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

export function useFFmpeg() {
  const { data, isLoading, error } = useSWRImmutable("ffmpeg", async () => {
    const ffmpeg = new FFmpeg();
    console.log("loading ffmpeg...");
    const result = await load(ffmpeg);
    console.log("loaded ffmpeg!", result);

    return ffmpeg;
  });

  console.log({ data, isLoading, error });

  return {
    ffmpeg: data,
    isLoading,
    error,
  };
}
