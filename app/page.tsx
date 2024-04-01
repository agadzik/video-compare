"use client";

import dynamic from "next/dynamic";

const VideoCompareForm = dynamic(
  () =>
    import("@/components/video-compare-form").then(
      (mod) => mod.VideoCompareForm
    ),
  { ssr: false }
);

const VideoInput = dynamic(
  () => import("@/components/video-input").then((mod) => mod.VideoInput),
  { ssr: false }
);

const VideoMerger = dynamic(
  () => import("@/components/video-merger").then((mod) => mod.VideoMerger),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row">
      <section className="flex flex-col basis-1/2">
        <div className="flex items-center justify-center basis-1/2 relative">
          <VideoInput id="video1" label="Video 1" />
        </div>
        <div className="flex items-center justify-center basis-1/2 border-t relative">
          <VideoInput id="video2" label="Video 2" />
        </div>
      </section>
      <section className="flex items-center justify-center basis-1/2 border-l">
        <VideoMerger />
      </section>
    </main>
  );
}
