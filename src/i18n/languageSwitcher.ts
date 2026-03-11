export const languageSwitcherTranslations = {
  zh: {
    currentLanguage: "中文",
    switchTo: {
      zh: "中文",
      en: "English"
    }
  },
  en: {
    currentLanguage: "English",
    switchTo: {
      zh: "中文",
      en: "English"
    }
  }
} as const;

export type Locale = keyof typeof languageSwitcherTranslations;
