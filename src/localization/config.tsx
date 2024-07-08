import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";
import RNRestart from "react-native-restart";
import urdu from "./translations/urdu";
import english from "./translations/english";

// supported languages
export const languages = ["en", "ur"];

// language resources - separate files for each language
const resources = {
  en: { translation: english },
  ur: { translation: urdu },
};

// configure i18next
i18next.use(initReactI18next).init({
  resources: resources,
  lng: I18nManager.isRTL ? "ur" : "en",
  interpolation: {
    escapeValue: false,
  },
});

// convenience hook to update app's language and force restart it.
export function forceUpdateLanguage(lng: string) {
  // check if it is a supported language
  if (languages.includes(lng)) {
    // check if it not already set
    if (i18next.language !== lng) {
      i18next.changeLanguage(lng).then(() => {
        I18nManager.forceRTL(lng === "ur");
        RNRestart.restart();
      });
    }
  } else {
    throw new Error("Trying to update to an unsupported language.");
  }
}

export default i18next;
