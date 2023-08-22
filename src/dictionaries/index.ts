const dictionaries: any = {
  en: () => import("./en.json").then((r) => r.default),
  fa: () => import("./fa.json").then((r) => r.default),
};

export const useDictionary = (lang: string) => {
  return dictionaries[lang]();
};
