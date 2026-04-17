import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchLocalizedFunds } from '../api/fundApi';
import { useI18nEventFetch } from '../i18n/useI18nEventFetch';
// 🌟 引入你的实例，专供测试沙箱切换语言使用
import { libI18n } from '../i18n/instance';

// ==========================================
// 📦 1. 纯净的生产级组件 (外部真正使用的版本)
// ==========================================
export const AIFundTable = () => {
    // 🌟 修正点：因为你的 instance.ts 用的是默认的 translation，所以这里不传参数
    const { t } = useTranslation();
    const { data: fundList, loading } = useI18nEventFetch(fetchLocalizedFunds);

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', opacity: loading ? 0.5 : 1 }}>
            <h3>{t('app.chat.table.title', '基金数据')}</h3>
            <table style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                    {/* 请确保这里的 key 与你 zh.json 中的层级完全对应 */}
                    <th>{t('app.chat.table.fund_code', '代码')}</th>
                    <th>{t('app.chat.table.fund_name', '名称')}</th>
                    <th>{t('app.chat.table.fund_type', '类型')}</th>
                </tr>
                </thead>
                <tbody>
                {(fundList as any[])?.map((fund) => (
                    <tr key={fund.code}>
                        <td>{fund.code}</td>
                        <td>{fund.name}</td>
                        <td>{fund.type}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

// ==========================================
// 🛠️ 2. 本地测试沙箱 (最小单元改动，测试全在这个文件内)
// ==========================================
export const AIFundTableDemo = () => {
    const [currentLang, setCurrentLang] = useState(libI18n.language);

    // 监听外部实例变化（防止别的组件切了语言，这里没跟上）
    useEffect(() => {
        const handleLangChange = (lng: string) => setCurrentLang(lng);
        libI18n.on('languageChanged', handleLangChange);
        return () => {
            libI18n.off('languageChanged', handleLangChange);
        };
    }, []);

    const toggleLang = () => {
        const nextLang = currentLang === 'zh' ? 'en' : 'zh';
        // 🌟 直接调用你 instance.ts 中的实例去切换，这会自动触发所有事件！
        libI18n.changeLanguage(nextLang);
    };

    return (
        <div style={{ padding: '24px', background: '#fff', border: '2px dashed #3498db', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, color: '#2c3e50' }}>🛠️ 内部组件测试沙箱 (AIFundTable)</h4>
                <button
                    onClick={toggleLang}
                    style={{ padding: '8px 16px', cursor: 'pointer', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '6px' }}
                >
                    点击切换语言 (当前: {currentLang})
                </button>
            </div>

            {/* 里面直接挂载纯净的生产组件 */}
            <AIFundTable />
        </div>
    );
};