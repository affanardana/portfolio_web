import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLanguage } from '../i18n/index.jsx';
import { EASE_SOFT } from './Reveal.jsx';
import { Flag, IconClose, IconMenu } from './icons.jsx';

const SECTIONS = ['home', 'about', 'projects', 'contact'];

const SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 };

/* --------------------------------------------------------------- pieces */

function NavLink({ id, label, isActive, onNavigate }) {
  const reduceMotion = useReducedMotion();

  return (
    <a
      href={`#${id}`}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={`group relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-300 ${
        isActive ? 'text-ink' : 'text-ink-soft hover:text-accent'
      }`}
    >
      {/*
        Hover lights the item up. The fill is tinted rather than white - a white
        pill is invisible against the white glass bar.
      */}
      {!isActive && (
        <span
          aria-hidden="true"
          className="absolute inset-0 scale-90 rounded-full bg-accent-tint opacity-0 ring-1 ring-accent/20 shadow-[0_4px_14px_-6px_rgba(91,91,214,0.45)] transition-all duration-300 ease-soft group-hover:scale-100 group-hover:opacity-100"
        />
      )}

      {isActive && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-full bg-white/90 shadow-[0_1px_2px_rgba(20,19,26,0.06),0_6px_16px_-8px_rgba(20,19,26,0.28)] ring-1 ring-white/80"
          transition={reduceMotion ? { duration: 0 } : SPRING}
        />
      )}

      <span className="relative">{label}</span>
    </a>
  );
}

function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="group"
      aria-label="Language / Bahasa"
      className="relative flex items-center gap-0.5 rounded-full bg-ink/[0.05] p-1 ring-1 ring-white/60 ring-inset"
    >
      {[
        { code: 'en', short: 'EN' },
        { code: 'id', short: 'ID' },
      ].map((option) => {
        const isActive = language === option.code;

        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLanguage(option.code)}
            aria-pressed={isActive}
            title={isActive ? t.label : t.switchTo}
            className={`group relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-semibold tracking-wide transition-colors duration-300 ${
              isActive ? 'text-ink' : 'text-ink-muted hover:text-accent'
            }`}
          >
            {!isActive && (
              <span
                aria-hidden="true"
                className="absolute inset-0 scale-90 rounded-full bg-accent-tint opacity-0 ring-1 ring-accent/20 shadow-[0_3px_10px_-6px_rgba(91,91,214,0.45)] transition-all duration-300 ease-soft group-hover:scale-100 group-hover:opacity-100"
              />
            )}

            {isActive && (
              <motion.span
                layoutId="lang-active-pill"
                className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(20,19,26,0.14)] ring-1 ring-white/90"
                transition={reduceMotion ? { duration: 0 } : SPRING}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <Flag
                code={option.code}
                className="h-3 w-[18px] rounded-[3px] shadow-[0_1px_2px_rgba(20,19,26,0.2)] ring-1 ring-black/5"
              />
              {option.short}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- navbar */

export default function NavBar({ active = 'home' }) {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef(null);

  // Collapse the sheet when the viewport grows into the desktop layout.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const onChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  // Drives the specular highlight that makes the pane read as real glass.
  const trackPointer = useCallback((event) => {
    const element = barRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    element.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5">
        <motion.nav
          ref={barRef}
          onPointerMove={trackPointer}
          initial={{ y: -26, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.85, ease: EASE_SOFT, delay: 0.1 }}
          className="glass glass-specular w-full max-w-4xl rounded-[26px]"
        >
          {/*
            One fixed size. This used to shrink on scroll, which meant the bar
            visibly resized (and shifted its items) as soon as the page moved.
          */}
          {/* z-10 keeps the bar's content above the pointer highlight */}
          <div className="relative z-10 flex items-center justify-between gap-3 px-3.5 py-2.5">
            <a
              href="#home"
              className="group flex shrink-0 items-center rounded-2xl px-2 py-1"
              aria-label={t.hero.name}
            >
              <span className="font-display text-[15px] font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-[17px]">
                {t.hero.name}
              </span>
            </a>

            <nav className="hidden items-center gap-0.5 md:flex">
              {SECTIONS.map((id) => (
                <NavLink key={id} id={id} label={t.nav[id]} isActive={active === id} />
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <LanguageToggle />

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? t.nav.close : t.nav.menu}
                className="grid size-9 place-items-center rounded-full bg-ink/[0.05] text-ink-soft ring-1 ring-white/60 ring-inset transition-colors duration-300 hover:text-ink md:hidden"
              >
                {menuOpen ? <IconClose className="size-4" /> : <IconMenu className="size-4" />}
              </button>
            </div>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              key="scrim"
              type="button"
              aria-label={t.nav.close}
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 cursor-default bg-ink/5 backdrop-blur-[2px] md:hidden"
            />

            <motion.div
              key="sheet"
              initial={{ opacity: 0, y: -14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.97 }}
              transition={{ duration: 0.34, ease: EASE_SOFT }}
              className="glass fixed inset-x-4 top-[84px] z-40 rounded-3xl p-1.5 md:hidden"
            >
              {SECTIONS.map((id) => {
                const isActive = active === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[16px] font-medium transition-colors duration-300 ${
                      isActive ? 'bg-white/80 text-ink' : 'text-ink-soft hover:bg-white/50 hover:text-ink'
                    }`}
                  >
                    {t.nav[id]}
                    {isActive && <span className="size-1.5 rounded-full bg-accent" />}
                  </a>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
