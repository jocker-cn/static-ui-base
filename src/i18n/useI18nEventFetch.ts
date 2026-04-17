import { useState, useEffect, useCallback } from 'react';
import { libI18n } from './instance';

export function useI18nEventFetch<T>(fetcher: () => Promise<T>) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);

    const execute = useCallback(async () => {
        setLoading(true);
        const result = await fetcher();
        setData(result);
        setLoading(false);
    }, [fetcher]);

    useEffect(() => {
        execute(); // 首次挂载执行

        // 🌟 核心：监听外部发来的语言更换事件！
        libI18n.on('languageChanged', execute);

        return () => {
            libI18n.off('languageChanged', execute);
        };
    }, [execute]);

    return { data, loading };
}