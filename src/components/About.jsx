import { useLanguage } from '../i18n/index.jsx';
import Reveal, { Stagger, StaggerItem } from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';
import { BrandIcon, SKILL_GLYPHS, brandColours, GlyphData } from './icons.jsx';

/**
 * Brand marks start as flat ink and take their real colour on hover; the two
 * skill entries use bespoke glyphs tinted with the accent instead.
 */
function SkillCard({ skill }) {
  const Glyph = SKILL_GLYPHS[skill.id] ?? GlyphData;
  const isBrand = Boolean(brandColours[skill.id]);
  const tint = isBrand ? brandColours[skill.id] : 'var(--color-accent)';

  /*
   * The hover LIFT lives on this wrapper, not on the card itself.
   * Chrome promotes a transformed element to its own compositing layer; if that
   * layer is evicted (card scrolled off-screen) and rebuilt, it can come back
   * without the element's border-radius clip - painting the card's opaque white
   * background as a hard-edged rectangle straight over its own border, icon and
   * text. A bare wrapper has no background to paint wrong, so promotion here is
   * harmless. Keep the transform on this side of the pair.
   */
  return (
    <StaggerItem className="group h-full transition-transform duration-500 ease-soft hover:-translate-y-1.5">
      <div
        style={{ '--brand': tint }}
        className="flex h-full flex-col items-center gap-3.5 rounded-3xl border border-line bg-white/90 p-5 text-center shadow-[0_10px_28px_-24px_rgba(20,19,26,0.4)] transition-[background-color,border-color,box-shadow] duration-500 ease-soft group-hover:border-transparent group-hover:bg-white group-hover:shadow-[0_24px_48px_-28px_rgba(20,19,26,0.45)]"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink/[0.04] text-ink-muted transition-all duration-500 ease-soft group-hover:bg-[color-mix(in_oklab,var(--brand)_12%,white)] group-hover:text-[var(--brand)]">
          {isBrand ? (
            <BrandIcon name={skill.id} className="size-7" title={skill.name} />
          ) : (
            <Glyph className="size-7" />
          )}
        </span>

        <span className="text-[13px] font-semibold leading-snug text-ink">{skill.name}</span>

        <span className="mt-auto pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          {skill.kind}
        </span>
      </div>
    </StaggerItem>
  );
}

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative scroll-mt-24 px-6 pb-20 lg:pb-28">
      <div className="mx-auto max-w-6xl">
        {/*
          The bio occupies its own screenful, centred the same way the hero is,
          so selecting "About Me" lands on a composed view rather than a heading
          pinned to the top edge.
        */}
        <div className="flex min-h-[calc(100svh-6rem)] flex-col justify-center text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 text-[11.5px] font-bold uppercase tracking-[0.2em] text-accent">
              <span className="h-px w-6 bg-accent/40" />
              {t.about.eyebrow}
            </span>
          </Reveal>

          <Stagger className="mx-auto mt-7 max-w-3xl" gap={0.12}>
            {t.about.body.map((paragraph, index) => (
              <StaggerItem key={index}>
                <p className="text-[17.5px] leading-[1.75] text-ink-soft">{paragraph}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/*
          Pushed a full screen down. The bio block fills the viewport exactly,
          so this gap is always below the fold - the skills heading never shows
          up in the same view as the bio.
        */}
        <div className="pt-32 lg:pt-40">
          <SectionHeading
            eyebrow={t.about.skillsEyebrow}
            title={t.about.skillsTitle}
            subtitle={t.about.skillsSubtitle}
          />

          {/* nine cards fall into a clean 3x3 from `sm` up */}
          <Stagger
            className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3.5 sm:grid-cols-3 lg:gap-4"
            gap={0.07}
          >
            {t.about.skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
