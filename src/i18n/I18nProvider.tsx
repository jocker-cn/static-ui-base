// src/i18n/I18nProvider.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { libI18n } from './instance';

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
    // 防止 Next.js SSR 水合不匹配的经典做法
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        // 将我们创建的独立实例注入到 React 树中
        <I18nextProvider i18n={libI18n}>
            {children}
        </I18nextProvider>
    );
};