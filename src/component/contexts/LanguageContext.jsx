import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { collectVisibleTexts } from "../../utils/collectVisibleTexts";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const browserLang = navigator.language.split("-")[0];

  const defaultTargetLang = ["ko", "en"].includes(browserLang)
    ? browserLang
    : "en";

  const [targetLang, setTargetLang] = useState(defaultTargetLang);

  const location = useLocation();

  const translateVisibleTexts = async (texts, lang = targetLang) => {
    if (lang === browserLang) {
      return;
    }

    if (texts.length === 0) return;

    const joinedText = texts.join("\n");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/translate`,
        {
          text: joinedText,
          sourceLang: "auto",
          targetLang: lang,
        },
      );

      let translatedArray = response.data.data.split("\n");

      if (
        location.pathname.includes("/class/create") ||
        location.pathname.includes("/class/setting")
      ) {
        const customWeekdayMap = {
          월: "Mon",
          화: "Tue",
          수: "Wed",
          목: "Thu",
          금: "Fri",
          토: "Sat",
          일: "Sun",
        };

        // joinedText가 개행으로 연결되어 있으니 split해서 개별 처리
        const originalArray = joinedText.split("\n");

        translatedArray = originalArray.map((original, idx) => {
          // 요일이면 직접 번역, 아니면 백에서 받은 결과 사용
          return customWeekdayMap[original] || translatedArray[idx];
        });
      }

      const textNodes = [];

      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            if (!node.parentElement) return NodeFilter.FILTER_REJECT;
            if (node.parentElement.tagName === "SCRIPT")
              return NodeFilter.FILTER_REJECT;
            if (node.parentElement.tagName === "STYLE")
              return NodeFilter.FILTER_REJECT;
            if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        },
      );

      while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
      }

      for (let i = 0; i < textNodes.length && i < translatedArray.length; i++) {
        textNodes[i].nodeValue = translatedArray[i];
      }
    } catch (error) {
      console.error("번역 실패:", error);
    }
  };

  // 페이지 이동할 때 자동으로 다시 번역
  useEffect(() => {
    const doTranslate = async () => {
      if (targetLang === browserLang) {
        return;
      }
      const visibleTexts = collectVisibleTexts();
      await translateVisibleTexts(visibleTexts, targetLang);
    };

    doTranslate();
  }, [location.pathname, targetLang]);

  return (
    <LanguageContext.Provider
      value={{
        targetLang,
        setTargetLang,
        translateVisibleTexts,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
