/**
 * The page's atmosphere: pastel blobs drifting behind a fine dot grid, with a
 * film-grain layer on top so the white never reads as flat.
 *
 * Purely decorative and fixed, so it costs nothing on scroll.
 */
const BLOBS = [
  { color: 'var(--color-blob-iris)', size: 560, top: '-18%', left: '-14%', opacity: 0.3, duration: '26s', delay: '0s' },
  { color: 'var(--color-blob-sky)', size: 470, top: '0%', left: '62%', opacity: 0.24, duration: '31s', delay: '-7s' },
  { color: 'var(--color-blob-rose)', size: 420, top: '52%', left: '-14%', opacity: 0.2, duration: '29s', delay: '-13s' },
  { color: 'var(--color-blob-amber)', size: 360, top: '70%', left: '72%', opacity: 0.16, duration: '34s', delay: '-4s' },
  { color: 'var(--color-blob-mint)', size: 400, top: '30%', left: '34%', opacity: 0.15, duration: '38s', delay: '-10s' },
];

export default function Background() {
  return (
    <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-canvas" />

      {BLOBS.map((blob, index) => (
        <span
          key={index}
          className="blob"
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            opacity: blob.opacity,
            background: blob.color,
            '--drift-duration': blob.duration,
            '--drift-delay': blob.delay,
          }}
        />
      ))}

      <div className="dot-grid absolute inset-0" />

      {/* warm wash from the top so the nav sits in light */}
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-white/70 to-transparent" />
    </div>
  );
}
