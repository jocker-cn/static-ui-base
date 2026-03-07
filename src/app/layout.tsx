import './globals.css';
import ClientOnly from '@/src/components/ClientOnly';
import FloatingConsole from '@/src/components/FloatingConsole';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body style={{ margin: 0 }}>
        <ClientOnly>
            {children}
        </ClientOnly>
        <FloatingConsole />
        </body>
        </html>
    );
}