import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../i18n/index.jsx';
import Reveal, { EASE_SOFT, Stagger, StaggerItem } from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';
import {
  BrandIcon,
  IconArrowUpRight,
  IconCheck,
  IconCopy,
  IconMail,
  brandColours,
} from './icons.jsx';

const EMAIL = 'email.affanardana@gmail.com';

const SOCIALS = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/affanardana/' },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/affan-ardana-465383340/',
  },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/affan.ardana/' },
];

/** Clipboard API first, execCommand fallback for non-secure origins. */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }

  try {
    const scratch = document.createElement('textarea');
    scratch.value = text;
    scratch.setAttribute('readonly', '');
    scratch.style.position = 'fixed';
    scratch.style.opacity = '0';
    document.body.appendChild(scratch);
    scratch.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(scratch);
    return ok;
  } catch {
    return false;
  }
}

function EmailCard() {
  const { t } = useLanguage();
  const [status, setStatus] = useState('idle');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(EMAIL);
    setStatus(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 2000);
  }, []);

  const label =
    status === 'copied' ? t.contact.copied : status === 'failed' ? t.contact.copyFailed : t.contact.copy;

  return (
    <div className="glass relative overflow-hidden rounded-[28px] p-5 sm:p-6">
      <div className="relative z-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          {t.contact.emailLabel}
        </span>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent(t.contact.emailSubject)}`}
            className="group flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-line bg-white/70 px-4 py-3 transition-all duration-400 ease-soft hover:-translate-y-0.5 hover:border-accent/35 hover:bg-white"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-tint text-accent-strong transition-transform duration-400 ease-soft group-hover:scale-105">
              <IconMail className="size-4.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-ink">{EMAIL}</span>
            </span>
            <IconArrowUpRight className="size-4 shrink-0 text-ink-faint transition-all duration-400 ease-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="relative inline-flex h-[46px] shrink-0 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-ink px-5 text-[13.5px] font-semibold text-white shadow-[0_14px_30px_-16px_rgba(20,19,26,0.85)] transition-all duration-400 ease-soft hover:-translate-y-0.5 hover:bg-accent"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={status}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: EASE_SOFT }}
                className="flex items-center gap-2"
              >
                {status === 'copied' ? (
                  <IconCheck className="size-4" />
                ) : (
                  <IconCopy className="size-4" />
                )}
                {label}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </div>
  );
}

function SocialLinks() {
  const { t } = useLanguage();

  return (
    <div className="mt-10 text-center">
      <Reveal>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          {t.contact.socialsLabel}
        </span>
      </Reveal>

      <Stagger className="mt-4 flex flex-wrap justify-center gap-3" gap={0.07}>
        {SOCIALS.map((social) => (
          <StaggerItem key={social.id}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={social.label}
              style={{ '--brand': brandColours[social.id] }}
              className="group flex items-center gap-3 rounded-2xl border border-line bg-white/65 px-4 py-3 backdrop-blur-sm transition-all duration-500 ease-soft hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-[0_22px_44px_-26px_rgba(20,19,26,0.45)]"
            >
              <BrandIcon
                name={social.id}
                className="size-5 text-ink-muted transition-colors duration-500 ease-soft group-hover:text-[var(--brand)]"
                title={social.label}
              />
              <span className="text-[13.5px] font-semibold text-ink-soft transition-colors duration-500 group-hover:text-ink">
                {social.label}
              </span>
            </a>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

export default function Contact() {
  const { t } = useLanguage();

  return (
    <section
      id="contact"
      className="relative flex min-h-[calc(100svh-6rem)] scroll-mt-24 items-center px-6 pb-16"
    >
      <div className="mx-auto w-full max-w-3xl">
        <SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} />

        <Reveal delay={0.1} className="mt-12">
          <EmailCard />
        </Reveal>

        <SocialLinks />
      </div>
    </section>
  );
}
