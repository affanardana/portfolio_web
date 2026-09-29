import { useCallback, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useLanguage } from '../i18n/index.jsx';
import { Stagger, StaggerItem } from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';
import ProjectModal from './ProjectModal.jsx';
import { IconArrowUpRight } from './icons.jsx';

/**
 * A full-card button handles "open details"; the external link is raised above
 * it (z-20) so it stays independently clickable and focusable.
 */
function ProjectCard({ project, featured, onOpen }) {
  const { t } = useLanguage();
  const linkLabel = project.id === 'a' ? t.projects.readLabel : t.projects.visitLabel;

  return (
    /*
      No transform on this element - see the note on SkillCard. The lift is
      carried by the `group` wrapper in the grid instead, so the card's own
      rounded background is never the thing Chrome promotes and mis-clips.
    */
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white/90 shadow-[0_12px_34px_-26px_rgba(20,19,26,0.4)] transition-[background-color,border-color,box-shadow] duration-500 ease-soft group-hover:border-accent/25 group-hover:bg-white group-hover:shadow-[0_34px_64px_-36px_rgba(20,19,26,0.5)] ${
        featured ? 'lg:col-span-2 lg:flex-row' : ''
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${t.projects.openLabel}: ${project.title}`}
        className="absolute inset-0 z-10 rounded-[28px]"
      />

      {/*
        The image sits inside its own outlined frame with a gutter around it.
        Edge-to-edge, a wide screenshot ran straight into the card's left and
        right borders and read as if the card had no padding.
      */}
      <div
        className={`relative aspect-[16/10] shrink-0 border-line/70 bg-white/40 p-3 sm:p-4 ${
          featured ? 'border-b lg:aspect-auto lg:w-[52%] lg:border-b-0 lg:border-r' : 'border-b'
        }`}
      >
        <div className="relative size-full overflow-hidden rounded-2xl bg-white ring-1 ring-line shadow-[0_4px_14px_-10px_rgba(20,19,26,0.4)]">
          {/*
            object-contain, never cover: these are screenshots and a diagram,
            and cover zoomed them enough to cut words off the edges.
          */}
          <img
            src={project.hover}
            alt={project.detailAlt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-contain"
          />

          {project.previewCaption && (
            <span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-ink-muted ring-1 ring-line backdrop-blur">
              {project.previewCaption}
            </span>
          )}
        </div>
      </div>

      <div
        className={`flex flex-1 flex-col p-5 sm:p-6 ${featured ? 'lg:p-8' : ''}`}
      >
        <span className="font-display text-[12px] font-bold tracking-[0.22em] text-accent">
          {project.number}
        </span>

        <h3
          className={`mt-2.5 font-display font-bold leading-snug tracking-[-0.015em] text-ink ${
            featured ? 'text-[19px] lg:text-[22px]' : 'text-[17px]'
          }`}
        >
          {project.title}
        </h3>

        <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">{project.subtitle}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag, index) => (
            <li
              key={tag}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                index === 0 ? 'bg-accent-tint text-accent-strong' : 'bg-ink/[0.045] text-ink-muted'
              }`}
            >
              {tag}
            </li>
          ))}
        </ul>

        {/* mt-auto keeps the two side-by-side cards' footers on one line */}
        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between gap-3 border-t border-line/70 pt-4">
            <a
            href={project.link}
            target="_blank"
            rel="noreferrer noopener"
            className="relative z-20 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft transition-colors duration-300 hover:text-accent"
          >
              {linkLabel}
              <IconArrowUpRight className="size-3.5" />
            </a>

            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent">
              {t.projects.openLabel}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);
  const lastFocused = useRef(null);
  const items = t.projects.items;

  const openProject = useCallback((index) => {
    lastFocused.current = document.activeElement;
    setOpenIndex(index);
  }, []);

  const closeProject = useCallback(() => {
    setOpenIndex(null);
    lastFocused.current?.focus?.();
  }, []);

  const stepProject = useCallback(
    (delta) => {
      setOpenIndex((current) =>
        current === null ? current : (current + delta + items.length) % items.length,
      );
    },
    [items.length],
  );

  return (
    /*
     * Starts right under the bar rather than centring: this section is long
     * enough that centring it would just hide the first card below the fold.
     */
    <section id="projects" className="relative scroll-mt-24 px-6 pb-20 pt-8 lg:pb-28 lg:pt-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.projects.eyebrow} subtitle={t.projects.subtitle} />

        <Stagger className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2" gap={0.1} amount={0.1}>
          {items.map((project, index) => (
            <StaggerItem
              key={project.id}
              className={`group h-full transition-transform duration-500 ease-soft hover:-translate-y-1.5 ${
                index === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              <ProjectCard
                project={project}
                featured={index === 0}
                onOpen={() => openProject(index)}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <ProjectModal
            key="project-modal"
            project={items[openIndex]}
            onClose={closeProject}
            onStep={stepProject}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
