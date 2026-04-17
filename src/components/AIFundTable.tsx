import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchLocalizedFunds } from '../api/fundApi';
import { useI18nEventFetch } from '../i18n/useI18nEventFetch';


// ==========================================
// 📦 1. 纯净的生产级组件 (外部真正使用的版本)
// ==========================================
export const AIFundTable = () => {
    const { t } = useTranslation('staticUiLib');
    const { data: fundList, loading } = useI18nEventFetch(fetchLocalizedFunds);

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', opacity: loading ? 0.5 : 1 }}>
            <h3>{t('chat.table.title', '基金数据')}</h3>
            <table style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                    <th>{t('chat.table.fund_code', '代码')}</th>
                    <th>{t('chat.table.fund_name', '名称')}</th>
                    <th>{t('chat.table.fund_type', '类型')}</th>
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
