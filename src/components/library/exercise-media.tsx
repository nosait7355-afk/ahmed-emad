"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dumbbell } from "lucide-react";
import { youtubeVideoId, youtubeMaxResThumbnail, youtubeHqThumbnail } from "@/lib/youtube";
import { cloudinaryThumb, cloudinaryVideoPoster } from "@/lib/cloudinary-url";

export interface ExerciseMediaSource {
  videoUrl?: string;
  youtubeUrl?: string;
  imageUrlStart?: string;
  imageUrlEnd?: string;
  gifUrl?: string;
}

/** YouTube thumbnail with automatic maxres -> hq fallback (maxres doesn't exist for every video). */
function YoutubeThumbnail({ videoId, alt }: { videoId: string; alt: string }) {
  const [src, setSrc] = useState(youtubeMaxResThumbnail(videoId));
  return (
    <div className="relative h-full w-full">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover"
        unoptimized
        onError={() => setSrc(youtubeHqThumbnail(videoId))}
      />
    </div>
  );
}

/** Real, playable YouTube embed (play/pause/replay via the native YouTube controls). */
function YoutubePlayer({ videoId, alt }: { videoId: string; alt: string }) {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      title={alt}
      className="h-full w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

/**
 * Simulates a smooth GIF from two static photos (start/end of the movement)
 * by cross-fading between them every 500ms.
 *
 * `hoverOnly` (list thumbnails): stays on the start photo and only animates
 * while hovered, so a grid of cards doesn't run dozens of timers or download
 * every end photo up front.
 */
function MotionFadeImage({
  start,
  end,
  alt,
  hoverOnly = false,
}: {
  start: string;
  end?: string;
  alt: string;
  hoverOnly?: boolean;
}) {
  const [frame, setFrame] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [endLoaded, setEndLoaded] = useState(!hoverOnly);
  const canAnimate = !!end && end !== start;
  const animating = canAnimate && (!hoverOnly || hovered);

  useEffect(() => {
    if (!animating) {
      setFrame(0);
      return;
    }
    const id = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), 500);
    return () => clearInterval(id);
  }, [animating]);

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={hoverOnly ? () => { setHovered(true); setEndLoaded(true); } : undefined}
      onMouseLeave={hoverOnly ? () => setHovered(false) : undefined}
    >
      <Image
        src={start}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover transition-opacity duration-500 ease-in-out"
        style={{ opacity: frame === 0 ? 1 : 0 }}
        unoptimized
      />
      {canAnimate && endLoaded && (
        <Image
          src={end!}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-opacity duration-500 ease-in-out"
          style={{ opacity: frame === 1 ? 1 : 0 }}
          unoptimized
        />
      )}
    </div>
  );
}

/**
 * Renders the best available media for an exercise, in priority order:
 * 1) uploaded video  2) YouTube (thumbnail or real player)  3) start/end photo cross-fade  4) icon.
 *
 * `variant="player"` renders a real, playable YouTube embed — use it for single-exercise
 * detail views (workout-execution, exercise view dialog). Everywhere a list of exercises
 * is shown (grids, programs, templates, history, reports, PR cards...) stays a lightweight
 * static thumbnail to avoid loading many iframes at once.
 */
export function ExerciseMedia({
  media,
  alt,
  className,
  iconClassName,
  variant = "thumbnail",
}: {
  media: ExerciseMediaSource;
  alt: string;
  className?: string;
  iconClassName?: string;
  variant?: "thumbnail" | "player";
}) {
  const thumb = variant === "thumbnail";

  // Lists: a still frame instead of an autoplaying video per card — a grid of
  // 24 cards would otherwise download and play 24 videos at once.
  if (media.videoUrl && thumb) {
    const poster = cloudinaryVideoPoster(media.videoUrl);
    return (
      <div className={className}>
        <div className="relative flex h-full w-full items-center justify-center bg-black">
          {poster ? (
            <Image src={poster} alt={alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" unoptimized />
          ) : (
            <video src={media.videoUrl} className="h-full w-full object-contain" preload="metadata" muted playsInline />
          )}
        </div>
      </div>
    );
  }

  if (media.videoUrl) {
    return (
      <div className={className}>
        <div className="flex h-full w-full items-center justify-center bg-black">
          <video
            src={media.videoUrl}
            className="h-full w-full object-contain"
            autoPlay
            loop
            muted
            playsInline
            controls={false}
          />
        </div>
      </div>
    );
  }

  const videoId = media.youtubeUrl ? youtubeVideoId(media.youtubeUrl) : null;
  if (videoId) {
    return (
      <div className={className}>
        {variant === "player" ? (
          <YoutubePlayer key={videoId} videoId={videoId} alt={alt} />
        ) : (
          <YoutubeThumbnail key={videoId} videoId={videoId} alt={alt} />
        )}
      </div>
    );
  }

  const start = media.imageUrlStart || media.gifUrl;
  if (start) {
    return (
      <div className={className}>
        <MotionFadeImage
          key={`${start}|${media.imageUrlEnd ?? ""}`}
          start={thumb ? cloudinaryThumb(start) : start}
          end={media.imageUrlEnd && (thumb ? cloudinaryThumb(media.imageUrlEnd) : media.imageUrlEnd)}
          alt={alt}
          hoverOnly={thumb}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Dumbbell className={iconClassName ?? "h-10 w-10 text-muted-foreground/40"} />
    </div>
  );
}
