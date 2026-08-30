import { useEffect, useRef } from 'react';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

/**
 * Renders a project preview as looping video, static image, or placeholder.
 *
 * These previews were GIFs. GIF has no interframe compression, so a 20 second
 * screen capture ran to ~15 MB; the same clip as h264 is under 1 MB. The
 * tradeoff is that video needs explicit playback handling, which is what the
 * rest of this component is.
 *
 * Playback is gated on visibility so four clips do not decode at once, and
 * collapses to the poster frame under prefers-reduced-motion.
 */
const ProjectPreview = ({ video, poster, image, title, imageScale }) => {
  const videoRef = useRef(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !video || prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused (low power mode, for one). The
          // poster stays up in that case, so a rejection is not an error.
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [video, prefersReduced]);

  const style = imageScale ? { transform: `scale(${imageScale})` } : undefined;
  const fill = 'w-full h-full object-cover';

  if (!video && !image) {
    return (
      <div className="media-placeholder w-full h-full">
        <span className="media-placeholder__label">{title}</span>
      </div>
    );
  }

  // Static image, or the frozen poster when motion is not wanted.
  if (image || prefersReduced) {
    return (
      <img
        src={image ?? poster}
        alt={`${title} preview`}
        loading="lazy"
        decoding="async"
        className={fill}
        style={style}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      poster={poster}
      muted
      loop
      playsInline
      // Deliberately not `autoPlay`. The observer above starts playback, so
      // offscreen clips never buffer.
      preload="metadata"
      aria-label={`${title} preview`}
      className={fill}
      style={style}
    >
      <source src={video} type="video/mp4" />
    </video>
  );
};

export default ProjectPreview;
