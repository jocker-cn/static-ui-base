// src/components/AIFundTable.tsx
'use client';
import React, { useState } from 'react';
import { useAppTranslation } from '@/src/i18n/useAppTranslation';
import { rawTranslate } from '@/src/i18n/instance';

export default function AIFundTable() {
    // 1. 使用我们封装的 Hook 获取 t 函数和切换方法
    const { t, switchLanguage, currentLang } = useAppTranslation();

    // 2. 模拟 AI 动态推送过来的数据（注意：数据是英文枚举，不是写死的中文）
    const [mockAiData] = useState([
        { code: '001122', name: 'Tech Growth', type: 'equity' },
        { code: '003344', name: 'Safe Bond', type: 'bond' }
    ]);

    // 3. 动态数据的局部多语言映射纯函数 (不污染全局 JSON 字典)
    const translateFundType = (rawType: string) => {
        const typeMap: Record<string, any> = {
            zh: { equity: '股票型', bond: '债券型' },
            en: { equity: 'Equity', bond: 'Bond' }
        };
        return typeMap[currentLang]?.[rawType] || rawType;
    };

    // 4. 模拟一个非 React 组件（例如纯 JS 逻辑）使用 rawTranslate
    const handleNonReactLogic = () => {
        // 这里没有使用 Hook，直接调用工具类！
        const msg = rawTranslate('app.common.loading');
        alert(`触发普通 JS 逻辑: ${msg}`);
    };

    return (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>AI Fund Table Demo</h3>
                {/* 语言切换按钮：页面静态文本会重绘 */}
                <button
                    onClick={() => switchLanguage(currentLang === 'zh' ? 'en' : 'zh')}
                    style={{ padding: '8px 16px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px' }}
                >
                    {t('app.common.switchLang')}
                </button>
            </div>

            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                    {/* 🌟 体验 TS 魔法：在你的 IDE 里敲 t('app.') 会自动提示！ */}
                    <th>{t('app.chat.table.fund_code')}</th>
                    <th>{t('app.chat.table.fund_name')}</th>
                    <th>{t('app.chat.table.fund_type')}</th>
                </tr>
                </thead>
                <tbody>
                {mockAiData.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee', lineHeight: '2.5' }}>
                        {/* 动态数据渲染：只翻译映射的数据字典 */}
                        <td>{row.code}</td>
                        <td>{row.name}</td>
                        <td>{translateFundType(row.type)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{ marginTop: '20px' }}>
                <input
                    placeholder={t('app.chat.input.placeholder')}
                    style={{ padding: '8px', width: '300px', marginRight: '10px' }}
                />
                <button onClick={handleNonReactLogic}>
                    {t('app.common.confirm')}
                </button>
            </div>
        </div>
    );
}