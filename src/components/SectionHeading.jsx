import Reveal from './Reveal.jsx';

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <Reveal>
        <span
          className={`inline-flex items-center gap-2.5 text-[11.5px] font-bold uppercase tracking-[0.2em] text-accent ${
            align === 'center' ? 'justify-center' : ''
          }`}
        >
          <span className="h-px w-6 bg-accent/40" />
          {eyebrow}
        </span>
      </Reveal>

      {title && (
        <Reveal delay={0.08}>
          <h2 className="mt-4 font-display text-[clamp(1.85rem,4vw,2.6rem)] font-extrabold leading-[1.14] tracking-[-0.03em] text-ink">
            {title}
          </h2>
        </Reveal>
      )}

      {subtitle && (
        <Reveal delay={0.14}>
          <p
            className={`leading-relaxed text-ink-muted ${
              title ? 'mt-4 text-[15.5px]' : 'mt-5 text-[19px] sm:text-[21px]'
            }`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
