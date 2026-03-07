// src/app/page.tsx
'use client';

import React from 'react';
import { ConfigurationManager } from "@/z_configuration/ConfigurationManager";

export default function BulletproofLayout() {
    // 依然是同步读取，享受单例带来的纯净逻辑
    const config = ConfigurationManager.get();
    const sidebarItems = config.getSidebarItems();

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'sans-serif' }}>
            {/* 左侧侧边栏 */}
            <aside style={{ width: '260px', backgroundColor: '#2c3e50', color: '#ecf0f1', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '24px', fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid #34495e' }}>
                    {config.getSidebarLogoTitle()}
                </div>

                <nav style={{ flex: 1, padding: '16px 0' }}>
                    {sidebarItems.map(item => (
                        <div key={item.key} style={{ padding: '12px 24px', cursor: 'pointer', transition: 'background 0.2s' }}>
                            {item.title}
                            {/* 如果有子菜单 */}
                            {item.children && (
                                <div style={{ paddingLeft: '20px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                                    {item.children.map(child => <div key={child.key} style={{ padding: '4px 0' }}>{child.title}</div>)}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div style={{ padding: '16px', fontSize: '12px', opacity: 0.5, borderTop: '1px solid #34495e' }}>
                    API Endpoint: {config.getApiBaseUrl()}
                </div>
            </aside>

            {/* 右侧主内容区 */}
            <main style={{ flex: 1, backgroundColor: '#f5f6fa', padding: '40px' }}>
                <header style={{ marginBottom: '32px' }}>
                    <h2 style={{ color: '#2c3e50' }}>欢迎来到基座控制台</h2>
                    <p style={{ color: '#7f8c8d' }}>当前配置模式：<span style={{ color: '#3498db', fontWeight: 'bold' }}>{process.env.NEXT_PUBLIC_ENV}</span></p>
                </header>

                <section style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h4>动态配置预览 (JSON)</h4>
                    <pre style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '4px', overflow: 'auto' }}>
                        {JSON.stringify(config, null, 2)}
                    </pre>
                </section>
            </main>
        </div>
    );
}