// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const LANG_KEY = 'app_language';
const defaultLang = 'en';
const supportedLangs = ['en', 'si', 'th'];

interface LanguageContextProps {
  lang: string;
  t: Record<string, string>;
  changeLanguage: (l: string) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// simple in-memory cache so we never hit the network twice
const translationsCache: Record<string, Record<string, string>> = {}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<string>(defaultLang);
  const [t, setT] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LANG_KEY)
    if (stored && supportedLangs.includes(stored)) setLang(stored)
    else setLang(defaultLang)
    setIsLoaded(true)
  }, [])

  // Prefetch all non-default locale JSON in the background
  useEffect(() => {
    supportedLangs.filter(l => l !== defaultLang).forEach(l => {
      import(
        /* webpackPrefetch: true */
        `../locales/${l}.json`
      )
        .then(mod => {
          translationsCache[l] = mod.default || mod
        })
        .catch(() => {})
    })
  }, [])
  
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem(LANG_KEY, lang)
    if (lang === defaultLang) {
      // English in-bundle
      setT({})
    } else if (translationsCache[lang]) {
      // already loaded
      setT(translationsCache[lang])
    } else {
      // dynamic import with cache and prefetch hint
      import(
        /* webpackChunkName: "locale-[request]", webpackPrefetch: true */
        `../locales/${lang}.json`
      )
        .then(mod => {
          const data = mod.default || mod
          translationsCache[lang] = data
          setT(data)
        })
        .catch(() => setT({}))
    }
  }, [lang, isLoaded]);

  const changeLanguage = (l: string) => {
    if (supportedLangs.includes(l)) setLang(l);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
