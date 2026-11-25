"use client";

import { useEffect, useRef, useState } from "react";
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

/** Smaller, compressed Cloudinary rendition for grid cards. */
function cloudinaryVideoThumb(url: string, width = 480): string {
  return url.replace(/(res\.cloudinary\.com\/[^/]+\/video\/upload\/)/, `$1w_${width},q_auto/`);
}

/**
 * Grid-card video: plays muted on loop by itself, but only while the card is
 * on screen — off-screen cards pause and don't download, so a big grid stays light.
 */
function AutoplayThumbVideo({ src, poster }: { src: string; poster: string | null }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (visible) {
      setLoaded(true);
      el.play().catch(() => {});
    } else el.pause();
  }, [visible, loaded]);

  return (
    <video
      controlsList="nodownload noremoteplayback"
      disablePictureInPicture
      draggable={false}
      ref={ref}
      src={loaded ? cloudinaryVideoThumb(src) : undefined}
      poster={poster ?? undefined}
      className="h-full w-full object-cover"
      preload="none"
      autoPlay
      loop
      muted
      playsInline
    />
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
function ExerciseMediaInner({
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

  // Lists: autoplay muted on loop, but only for cards currently on screen.
  if (media.videoUrl && thumb) {
    return (
      <div className={className}>
        <div className="relative flex h-full w-full items-center justify-center bg-black" aria-label={alt}>
          <AutoplayThumbVideo src={media.videoUrl} poster={cloudinaryVideoPoster(media.videoUrl)} />
        </div>
      </div>
    );
  }

  if (media.videoUrl) {
    return (
      <div className={className}>
        <div className="flex h-full w-full items-center justify-center bg-black">
          <video
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            draggable={false}
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

const block = (e: React.SyntheticEvent) => e.preventDefault();

/**
 * Exercise media is the coach's own content: block the browser's
 * "Save image/video as" (right-click / long-press) and drag-to-desktop.
 * This deters casual saving; it can't stop screen recording.
 */
export function ExerciseMedia(props: Parameters<typeof ExerciseMediaInner>[0]) {
  return (
    <span
      className="contents"
      style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none" }}
      onContextMenu={block}
      onDragStart={block}
    >
      <ExerciseMediaInner {...props} />
    </span>
  );
}
