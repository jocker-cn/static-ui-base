// src/i18n/useAppTranslation.ts
import { useTranslation } from 'react-i18next';

// 🌟 核心理念 3：防腐层 Hook。所有业务组件只能用这个 Hook。
export const useAppTranslation = () => {
    const { t, i18n } = useTranslation();

    const switchLanguage = (lang: 'zh' | 'en') => {
        i18n.changeLanguage(lang);
        // 如果你需要同步到你的 SessionManager 或 localStorage，可以在这里加一行
    };

    return { t, i18n, currentLang: i18n.language, switchLanguage };
};