import en from './dictionaries/en.json';
import id from './dictionaries/id.json';

const dictionaries = { en, id };

export type TranslationKey = keyof typeof en;
export type Language = 'en' | 'id';

export function getTranslation(lang: Language, key: TranslationKey): string {
  const dictionary = dictionaries[lang] || dictionaries['id'];
  return dictionary[key] || key;
}

export function useTranslation(lang: Language) {
  return function t(key: TranslationKey): string {
    return getTranslation(lang, key);
  }
}
