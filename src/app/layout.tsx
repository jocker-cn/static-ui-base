// src/app/layout.tsx
import './globals.css';
import ClientOnly from '@/src/components/ClientOnly';
import DevControlCenter from "@/src/components/DevControlCenter";
import { I18nProvider } from '@/src/i18n/I18nProvider'; // 引入 Provider

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body style={{ margin: 0 }}>
        {/* 🌟 包裹 Provider */}
        <I18nProvider>
            <ClientOnly>
                {children}
            </ClientOnly>
        </I18nProvider>

        <DevControlCenter />
        </body>
        </html>
    );
}