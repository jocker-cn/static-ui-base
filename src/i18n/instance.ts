// src/i18n/instance.ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './locales/zh.json';
import en from './locales/en.json';

// 🌟 核心理念 1：绝对不污染全局！使用 createInstance 打造独立作用域
export const libI18n = i18next.createInstance();

libI18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            zh: { translation: zh }
        },
        lng: 'en', // 默认语言
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // React 自带防 XSS
        }
    });

// 🌟 核心理念 2：暴露出纯函数工具类（专供非 React UI 组件使用，如 Axios、Service、Event 监听）
export const rawTranslate = (key: string, options?: any) => libI18n.t(key, options);

// 可选：在这里监听语言切换事件，触发那些非 React 的全局数据刷新
libI18n.on('languageChanged', (lng) => {
    console.log(`[i18n] 系统语言已切换为: ${lng}`);
    // 如果你有基于 Axios 的全局接口刷新，可以在这里触发
});