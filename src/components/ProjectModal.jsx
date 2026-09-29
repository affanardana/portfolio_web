import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'motion/react';
import { useLanguage } from '../i18n/index.jsx';
import RichText from './RichText.jsx';
import { EASE_SOFT } from './Reveal.jsx';
import { IconArrowUpRight, IconChevron, IconClose, IconInfo, IconWarning } from './icons.jsx';

function NoteCallout({ note }) {
  const isWarning = note.tone === 'warning';
  const Icon = isWarning ? IconWarning : IconInfo;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        isWarning
          ? 'border-amber-300/80 bg-amber-50/80 text-amber-950'
          : 'border-sky-300/80 bg-sky-50/80 text-sky-950'
      }`}
    >
      <Icon className="mt-px size-5 shrink-0 opacity-70" />
      <p className="text-[14px] leading-relaxed">
        <span className="font-semibold">{note.label}. </span>
        {note.text}
      </p>
    </div>
  );
}

export default function ProjectModal({ project, onClose, onStep }) {
  const { t } = useLanguage();
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      } else if (event.key === 'ArrowRight') {
        onStep(1);
      } else if (event.key === 'ArrowLeft') {
        onStep(-1);
      }
    },
    [onClose, onStep],
  );

  // Lock the page behind the dialog, compensating for the scrollbar so the
  // layout underneath does not jump.
  useEffect(() => {
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarGap > 0) body.style.paddingRight = `${scrollbarGap}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const titleId = `project-${project.id}-title`;

  /*
   * Portalled to <body>: the section it is opened from sits inside a
   * `relative z-10` main element, and a stacking context cannot be escaped
   * from the inside - without the portal the fixed navbar paints over it.
   */
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 lg:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/25 backdrop-blur-md"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.97 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.42, ease: EASE_SOFT }}
        className="relative z-10 flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white/95 shadow-[0_50px_100px_-40px_rgba(20,19,26,0.6)] backdrop-blur-2xl"
      >
        {/* toolbar */}
        <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-line/70 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-ink/[0.05] font-display text-[12px] font-bold text-ink-soft">
              {project.number}
            </span>
            <span className="truncate text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
              {t.projects.detailLabel}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => onStep(-1)}
              aria-label={t.projects.prev}
              className="grid size-9 place-items-center rounded-full bg-white/70 text-ink-soft ring-1 ring-line transition-colors duration-300 hover:bg-white hover:text-ink"
            >
              <IconChevron className="size-4" direction="left" />
            </button>
            <button
              type="button"
              onClick={() => onStep(1)}
              aria-label={t.projects.next}
              className="grid size-9 place-items-center rounded-full bg-white/70 text-ink-soft ring-1 ring-line transition-colors duration-300 hover:bg-white hover:text-ink"
            >
              <IconChevron className="size-4" direction="right" />
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t.projects.closeLabel}
              className="ml-1 grid size-9 place-items-center rounded-full bg-ink text-white transition-all duration-300 hover:bg-accent"
            >
              <IconClose className="size-4" />
            </button>
          </div>
        </div>

        {/* body */}
        <div className="hide-scrollbar relative z-10 overflow-y-auto overscroll-contain px-4 pb-10 pt-7 sm:px-8 sm:pb-12">
          <div className="mx-auto max-w-3xl">
            <ul className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <li
                  key={tag}
                  className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${
                    index === 0
                      ? 'bg-accent-tint text-accent-strong'
                      : 'bg-ink/[0.045] text-ink-muted'
                  }`}
                >
                  {tag}
                </li>
              ))}
            </ul>

            <h3
              id={titleId}
              className="mt-5 font-display text-[clamp(1.5rem,3.4vw,2.1rem)] font-extrabold leading-[1.18] tracking-[-0.025em] text-ink"
            >
              {project.title}
            </h3>

            <p className="mt-4 text-[16px] leading-relaxed text-ink-muted">{project.subtitle}</p>

            {project.note && (
              <div className="mt-6">
                <NoteCallout note={project.note} />
              </div>
            )}

            <figure className="mt-7 overflow-hidden rounded-3xl border border-line bg-white shadow-[0_20px_50px_-30px_rgba(20,19,26,0.4)]">
              <img
                src={project.detail}
                alt={project.detailAlt}
                loading="lazy"
                className="w-full"
              />
            </figure>

            {project.stats && (
              <dl className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {project.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-line bg-white/70 px-4 py-3.5 backdrop-blur-sm"
                  >
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                      {stat.label}
                    </dt>
                    <dd className="mt-1.5 font-display text-[19px] font-bold tracking-tight text-ink">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8 space-y-4">
              {project.body.map((paragraph, index) => (
                <p key={index} className="text-[15.5px] leading-[1.75] text-ink-soft">
                  <RichText
                    text={paragraph}
                    linkClassName="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
                  />
                </p>
              ))}
            </div>

            <a
              href={project.link}
              target="_blank"
              rel="noreferrer noopener"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(20,19,26,0.8)] transition-all duration-400 ease-soft hover:-translate-y-0.5 hover:bg-accent"
            >
              {project.id === 'a' ? t.projects.readLabel : t.projects.visitLabel}
              <IconArrowUpRight className="size-4 transition-transform duration-400 ease-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <p className="mt-6 text-[12px] text-ink-faint">{t.projects.escHint}</p>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
