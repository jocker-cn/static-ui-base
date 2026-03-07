'use client';
import React, { useState, useEffect } from 'react';
import { ConfigurationManager } from '@/z_configuration/ConfigurationManager';

const isProd = process.env.NEXT_PUBLIC_ENV === 'production';

export default function ClientOnly({ children }: { children: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false);
    const [renderTick, setRenderTick] = useState(0);

    useEffect(() => {
        setHasMounted(true);
        if (isProd) {
            return;
        }

        // 訂閱配置變更，強制刷新子組件
        const unsubscribe = ConfigurationManager.subscribe(() => {
            setRenderTick(prev => prev + 1);
        });
        return () => unsubscribe();
    }, []);

    if (!hasMounted) return <div style={{ height: '100vh', width: '100vw', backgroundColor: '#f5f6fa' }} />;

    // 核心：renderTick 變化時，children 全部重新掛載並重新讀取配置
    return <div key={renderTick} style={{ display: 'contents' }}>{children}</div>;
}