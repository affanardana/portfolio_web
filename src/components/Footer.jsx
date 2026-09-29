import { useLanguage } from '../i18n/index.jsx';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative px-6 pb-10 pt-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 border-t border-line/80 pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-[12.5px] text-ink-faint">
          © {new Date().getFullYear()} {t.footer.rights}
        </p>
        <p className="text-[12.5px] text-ink-faint">{t.footer.builtWith}</p>
      </div>
    </footer>
  );
}
