import { libI18n } from '../i18n/instance';

export const fetchLocalizedFunds = async () => {
    // 每次调用的瞬间，直接从事件中心拿最新的语言
    const currentLang = libI18n.language || 'zh';

    // 模拟网络请求
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockDb: Record<string, any[]> = {
                zh: [{ code: '001', name: '科技基金', type: '股票型' }],
                en: [{ code: '001', name: 'Tech Fund', type: 'Equity' }]
            };
            resolve(mockDb[currentLang] || mockDb['zh']);
        }, 500);
    });
};