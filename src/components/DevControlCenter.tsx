'use client';

import React, {useState, useEffect} from 'react';
import {ConfigurationManager} from '@/z_configuration/ConfigurationManager';

export default function DevControlCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    // 用于强制刷新控制台自身的 UI
    const [localTick, setLocalTick] = useState(0);

    useEffect(() => setIsMounted(true), []);

    if (process.env.NODE_ENV !== 'development' || !isMounted) return null;

    const config = ConfigurationManager.get();

    // 核心修改方法：构建深层对象并通知 Manager
    // 例如：path = ['ui', 'sidebar', 'logoTitle'], value = '新标题'
    const handleUpdate = (path: string[], value: any) => {
        // 动态构建嵌套对象 { ui: { sidebar: { logoTitle: '新标题' } } }
        const overridePayload = path.reduceRight((acc, key) => ({[key]: acc}), value);

        // 调用我们刚写的 override 方法，触发全局重绘！
        // ConfigurationManager.override(overridePayload);
        ConfigurationManager.override(overridePayload);
        setLocalTick(t => t + 1); // 刷新控制台自身
    };

    // 🧠 核心魔法：递归渲染引擎
    const renderNode = (obj: any, currentPath: string[] = []): React.ReactNode => {
        if (!obj) return null;

        return Object.keys(obj).map(key => {
            const value = obj[key];
            const fullPath = [...currentPath, key];
            const pathKey = fullPath.join('.');

            // 如果是对象，递归渲染一个缩进区块
            if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                return (
                    <div key={pathKey}
                         style={{marginLeft: 10, marginTop: 10, borderLeft: '2px solid #3498db', paddingLeft: 10}}>
                        <strong style={{color: '#2c3e50', fontSize: 13}}>📂 {key}</strong>
                        {renderNode(value, fullPath)}
                    </div>
                );
            }

            // 如果是布尔值，渲染 Switch / Checkbox
            if (typeof value === 'boolean') {
                return (
                    <div key={pathKey}
                         style={{display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13}}>
                        <label style={{color: '#555'}}>{key}</label>
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleUpdate(fullPath, e.target.checked)}
                        />
                    </div>
                );
            }

            // 如果是字符串或数字，渲染 Input
            if (typeof value === 'string' || typeof value === 'number') {
                return (
                    <div key={pathKey}
                         style={{display: 'flex', flexDirection: 'column', padding: '5px 0', fontSize: 13}}>
                        <label style={{color: '#555', marginBottom: 2}}>{key}</label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleUpdate(fullPath, e.target.value)}
                            style={{
                                padding: '4px 8px',
                                border: '1px solid #ccc',
                                borderRadius: 4,
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                );
            }

            return null; // 忽略函数或无法解析的类型
        });
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: 20,
                    left: 20,
                    zIndex: 9999,
                    padding: '10px 15px',
                    background: '#34495e',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            >
                ⚙️ 开启调试台
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            width: 320,
            maxHeight: '80vh',
            overflowY: 'auto',
            background: '#f8f9fa',
            border: '1px solid #ddd',
            borderRadius: 8,
            zIndex: 9999,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                background: '#2c3e50',
                color: 'white',
                padding: '12px 15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <span style={{fontWeight: 'bold'}}>配置控制中心</span>
                <button onClick={() => setIsOpen(false)} style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: 16
                }}>✖
                </button>
            </div>
            <div style={{padding: 15}}>
                {renderNode(config)}
            </div>
        </div>
    );
}