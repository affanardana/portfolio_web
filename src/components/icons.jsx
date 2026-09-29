import { useId } from 'react';
import { brandIcons } from '../data/brandIcons.js';

/* ------------------------------------------------------------ brand logos */

/**
 * Brand mark filled with currentColor, so it inherits the surrounding ink and
 * can take the real brand colour on hover via the `color` style below.
 */
export function BrandIcon({ name, className, title }) {
  const icon = brandIcons[name];
  if (!icon) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role="img"
      aria-label={title ?? icon.title}
    >
      <path d={icon.path} />
    </svg>
  );
}

export const brandColours = Object.fromEntries(
  Object.entries(brandIcons).map(([key, icon]) => [key, icon.hex]),
);

/* ------------------------------------------------------------------ flags */

/**
 * Union Jack. Uses useId so the clip paths stay unique if the toggle is
 * rendered more than once on the page (desktop bar + mobile sheet).
 */
export function FlagUK({ className }) {
  const uid = useId().replace(/:/g, '');
  const field = `uk-field-${uid}`;
  const saltire = `uk-saltire-${uid}`;

  return (
    <svg viewBox="0 0 60 30" className={className} role="img" aria-label="English">
      <clipPath id={field}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={saltire}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${field})`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          clipPath={`url(#${saltire})`}
          stroke="#C8102E"
          strokeWidth="4"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

export function FlagID({ className }) {
  return (
    <svg viewBox="0 0 60 30" className={className} role="img" aria-label="Bahasa Indonesia">
      <rect width="60" height="15" fill="#CE1126" />
      <rect y="15" width="60" height="15" fill="#fff" />
    </svg>
  );
}

export function Flag({ code, className }) {
  return code === 'id' ? <FlagID className={className} /> : <FlagUK className={className} />;
}

/* ------------------------------------------------------------- ui glyphs */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function IconMail({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="3" />
      <path d="m3.5 8 7.24 5.07a2.2 2.2 0 0 0 2.52 0L20.5 8" />
    </svg>
  );
}

export function IconCopy({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <rect x="9" y="9" width="11.25" height="11.25" rx="2.6" />
      <path d="M15 6.2v-.45A2.5 2.5 0 0 0 12.5 3.25h-6.75A2.5 2.5 0 0 0 3.25 5.75v6.75A2.5 2.5 0 0 0 5.75 15h.45" />
    </svg>
  );
}

export function IconCheck({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="m5 12.6 4.6 4.6L19 7.4" />
    </svg>
  );
}

export function IconArrowUpRight({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M7.5 16.5 16.5 7.5" />
      <path d="M9 7.5h7.5V15" />
    </svg>
  );
}

export function IconClose({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  );
}

export function IconChevron({ className, direction = 'right' }) {
  const rotate = { right: 0, left: 180, up: -90, down: 90 }[direction];
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
      {...stroke}
      aria-hidden="true"
    >
      <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
    </svg>
  );
}

export function IconMenu({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

export function IconWarning({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M12 4.6 21 19.4H3z" />
      <path d="M12 10.2v3.9" />
      <path d="M12 17.1h.01" />
    </svg>
  );
}

export function IconInfo({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 11.2v4.6" />
      <path d="M12 8.3h.01" />
    </svg>
  );
}

/* ---------------------------------------------- bespoke skill illustrations */

/** Rising bars — "Data Analysis and Processing". */
export function GlyphData({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="3.4" y="12.4" width="4" height="8.2" rx="1.4" fill="currentColor" opacity="0.4" />
      <rect x="10" y="8.2" width="4" height="12.4" rx="1.4" fill="currentColor" opacity="0.7" />
      <rect x="16.6" y="4" width="4" height="16.6" rx="1.4" fill="currentColor" />
    </svg>
  );
}

/**
 * A small multilayer perceptron with the middle node dashed — the "modified"
 * unit — for "Deep Learning Model Modification".
 */
export function GlyphModel({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45">
        <path d="M7 8l4-3M7 8l4 4M7 8l4 7M7 16l4-11M7 16l4 4M7 16l4 7M13 5l4 7M13 12l4 0M13 19l4-7" />
      </g>
      <g fill="currentColor">
        <circle cx="5.6" cy="8" r="2.1" />
        <circle cx="5.6" cy="16" r="2.1" />
        <circle cx="13" cy="5" r="2.1" />
        <circle cx="13" cy="19" r="2.1" />
        <circle cx="20.4" cy="12" r="2.1" />
      </g>
      <circle
        cx="13"
        cy="12"
        r="2.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="2.6 2.2"
      />
    </svg>
  );
}

/**
 * A compute die with a bolt through it — accelerated inference on dedicated
 * hardware. TensorRT has no usable brand mark (NVIDIA's is trademarked), so
 * this stands in for it.
 */
export function GlyphTensorRT({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect
        x="4.2"
        y="4.2"
        width="15.6"
        height="15.6"
        rx="3.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.45"
      />
      <path d="M13.4 7.1 9.2 13.1h2.9l-.9 3.9 4.2-6.1h-2.9z" fill="currentColor" />
    </svg>
  );
}

/** Two planes pressing together — precision being squeezed down. */
export function GlyphQuantization({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="4" y="3.4" width="16" height="3.8" rx="1.5" fill="currentColor" opacity="0.4" />
      <rect x="4" y="16.8" width="16" height="3.8" rx="1.5" fill="currentColor" opacity="0.4" />
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 8.3v2.7" />
        <path d="m10.4 9.6 1.6 1.6 1.6-1.6" />
        <path d="M12 15.7v-2.7" />
        <path d="m10.4 14.4 1.6-1.6 1.6 1.6" />
      </g>
    </svg>
  );
}

export const SKILL_GLYPHS = {
  tensorrt: GlyphTensorRT,
  quantization: GlyphQuantization,
  data: GlyphData,
  model: GlyphModel,
};
