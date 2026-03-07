'use client';
import React, { useState, useEffect } from 'react';
import { ConfigurationManager } from '@/z_configuration/ConfigurationManager';
// 引入所有需要測試的市場 (生產打包時由於組件不渲染會被 Tree-Shaking 剔除)
import marketA from '@/z_config/application-market-a.yml';

const ENV_MAP: Record<string, any> = { 'market-a': marketA };

export default function FloatingConsole() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [currentKey, setCurrentKey] = useState<string | null>(null);

    const isActive = false;



    if (!isActive || !isMounted) return null;

    if (process.env.NEXT_PUBLIC_ENV === 'production' || !isMounted) return null;

    const handleSwitch = (key: string) => {
        setCurrentKey(key);
        ConfigurationManager.getLoader().switchProfile?.('');
    };

    if (!isOpen) {
        return <button onClick={() => setIsOpen(true)} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>⚙️ 切換環境 [{currentKey || '預設'}]</button>;
    }
    if (!isActive || !isMounted) return null;
    return (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#fff', border: '1px solid #ccc', zIndex: 9999, padding: '10px' }}>
            <button onClick={() => setIsOpen(false)}>關閉</button>
            <hr />
            <button onClick={() => handleSwitch('market-a')}>加載市場 A</button>
            <button onClick={() => { setCurrentKey(null); ConfigurationManager.reload(); }}>恢復預設</button>
        </div>
    );
}