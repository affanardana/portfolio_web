import { motion, useReducedMotion } from 'motion/react';
import { useLanguage } from '../i18n/index.jsx';
import { EASE_SOFT, Stagger, StaggerItem } from './Reveal.jsx';
import { IconArrowUpRight } from './icons.jsx';

/**
 * The portrait sits on top of two offset frames. Because the source PNG has
 * its studio background cut away and is cropped to head + upper body, the
 * image can be scaled past the frame so the head breaks the top edge.
 */
function FramedPortrait({ alt }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      {/* soft colour bloom behind everything */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[46%] size-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent/25 via-blob-rose/50 to-blob-sky/50 blur-3xl"
      />

      {/* slow dashed orbit */}
      <div
        aria-hidden="true"
        className="animate-spin-slow absolute inset-[2%] rounded-full border border-dashed border-accent/15"
      />

      <div className="relative aspect-[4/5]">
        {/*
          Tinted back plate. It has to be clearly darker than the page or the
          head breaking the top edge is invisible against white.
        */}
        <motion.div
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: -3.5 }}
          transition={{ duration: 1, ease: EASE_SOFT, delay: 0.25 }}
          className="absolute inset-x-3 bottom-0 top-[32%] rounded-[46px] bg-gradient-to-br from-[#dedcf8] via-[#eaeafb] to-[#d8e9f9] shadow-[0_30px_64px_-32px_rgba(20,19,26,0.45)] ring-1 ring-white/70"
        />

        {/* front outline */}
        <motion.div
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, rotate: 7 }}
          animate={{ opacity: 1, scale: 1, rotate: 3 }}
          transition={{ duration: 1, ease: EASE_SOFT, delay: 0.38 }}
          className="absolute inset-x-7 bottom-8 top-[38%] rounded-[38px] border border-dashed border-accent/30"
        />

        <motion.img
          src="/img/portrait.png"
          alt={alt}
          width={1043}
          height={1050}
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_SOFT, delay: 0.15 }}
          className="portrait-fade relative z-10 h-full w-full object-contain object-bottom drop-shadow-[0_22px_45px_rgba(20,19,26,0.22)]"
        />
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useLanguage();

  return (
    /*
     * min-h-svh + items-center keeps the hero optically centred in the first
     * screenful, so clicking "Home" never lands you needing to scroll.
     */
    <section
      id="home"
      className="relative flex min-h-svh scroll-mt-24 items-center px-6 pb-16 pt-28 sm:pt-32"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <Stagger className="order-2 text-center lg:order-1 lg:text-left" gap={0.09} amount={0.2}>
          <StaggerItem>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-soft ring-1 ring-line ring-inset backdrop-blur-sm">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              {t.hero.role}
            </span>
          </StaggerItem>

          <StaggerItem>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink">
              {t.hero.name}
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mx-auto mt-6 max-w-xl text-[16.5px] leading-relaxed text-ink-soft lg:mx-0">
              {t.hero.description}
            </p>
          </StaggerItem>

          <StaggerItem>
            <ul className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
              {t.hero.focus.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line bg-white/60 px-3.5 py-1.5 text-[12.5px] font-medium text-ink-soft backdrop-blur-sm transition-colors duration-300 hover:border-accent/40 hover:text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(20,19,26,0.8)] transition-all duration-400 ease-soft hover:-translate-y-0.5 hover:bg-accent hover:shadow-[0_18px_38px_-14px_rgba(91,91,214,0.75)]"
              >
                {t.hero.ctaProjects}
                <IconArrowUpRight className="size-4 transition-transform duration-400 ease-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-5 py-3 text-[14px] font-semibold text-ink-soft backdrop-blur-sm transition-all duration-400 ease-soft hover:-translate-y-0.5 hover:border-accent/40 hover:text-ink"
              >
                {t.hero.ctaContact}
              </a>
            </div>
          </StaggerItem>
        </Stagger>

        <motion.div
          className="order-1 lg:order-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FramedPortrait alt={t.hero.photoAlt} />
        </motion.div>
      </div>
    </section>
  );
}
