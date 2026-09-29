import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from './en.js';
import id from './id.js';

const DICTIONARIES = { en, id };
const STORAGE_KEY = 'affan-portfolio:language';
const DEFAULT_LANGUAGE = 'en'; // spec: English is the default

const LanguageContext = createContext(null);

function readStoredLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && DICTIONARIES[stored]) return stored;
  } catch {
    // localStorage can throw in private mode - the default is fine
  }
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readStoredLanguage);
  const t = DICTIONARIES[language];

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;

    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // remembering the choice is a convenience, not a requirement
    }
  }, [language, t]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      isEnglish: language === 'en',
    }),
    [language, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return context;
}
