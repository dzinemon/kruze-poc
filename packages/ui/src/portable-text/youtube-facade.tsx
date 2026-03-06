"use client";

import { useState, useCallback } from "react";
import { Play } from "lucide-react";

interface YouTubeFacadeProps {
  videoId: string;
  caption?: string;
}

/**
 * YouTube Facade Component
 *
 * Shows a thumbnail with a play button overlay. On click, loads the actual
 * YouTube iframe with autoplay. This pattern improves page load performance
 * by deferring the iframe load until user interaction.
 *
 * Thumbnail sources (in order of preference):
 * - maxresdefault.jpg (1280x720, not always available)
 * - sddefault.jpg (640x480, reliable fallback)
 */
export function YouTubeFacade({ videoId, caption }: YouTubeFacadeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleThumbnailError = useCallback(() => {
    setThumbnailError(true);
  }, []);

  // YouTube thumbnail URLs
  const maxresThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const sdThumbnail = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
  const thumbnailSrc = thumbnailError ? sdThumbnail : maxresThumbnail;

  // Iframe URL with autoplay and privacy-enhanced mode
  const iframeSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  if (isPlaying) {
    return (
      <div className="my-8">
        <div className="aspect-video">
          <iframe
            src={iframeSrc}
            title={caption || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full rounded-md"
          />
        </div>
        {caption && (
          <p className="mt-2 text-center text-sm text-text-secondary">
            {caption}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="my-8">
      <button
        type="button"
        onClick={handlePlay}
        className="group relative block w-full cursor-pointer overflow-hidden rounded-md focus-ring"
        aria-label={`Play video: ${caption || "YouTube video"}`}
      >
        {/* Thumbnail */}
        <div className="aspect-video bg-neutral-200 dark:bg-neutral-800">
          <img
            src={thumbnailSrc}
            alt={caption || "Video thumbnail"}
            onError={handleThumbnailError}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Semi-transparent backdrop */}
          <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/30" />

          {/* Play button */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:shadow-brand sm:h-20 sm:w-20">
            <Play className="h-7 w-7 fill-current sm:h-8 sm:w-8" />
          </div>
        </div>
      </button>
      {caption && (
        <p className="mt-2 text-center text-sm text-text-secondary">{caption}</p>
      )}
    </div>
  );
}
