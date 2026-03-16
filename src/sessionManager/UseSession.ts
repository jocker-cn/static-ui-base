import { useSyncExternalStore, useCallback } from 'react';
import { SessionManager, SessionSchema } from './SessionManager';

interface UseSessionOptions {
    /** 是否响应式更新 UI，默认为 true */
    reactive?: boolean;
}

export function useSession<K extends keyof SessionSchema>(
    key: K,
    options: UseSessionOptions = { reactive: true }
) {
    // 1. 订阅逻辑（如果 reactive 为 false，则传入空订阅函数，组件永远不会重渲染）
    const subscribe = useCallback(
        (onStoreChange: () => void) => {
            if (!options.reactive) return () => {}; // 不订阅
            return SessionManager.subscribe(key, onStoreChange);
        },
        [key, options.reactive]
    );

    // 2. 获取快照逻辑
    const getSnapshot = useCallback(() => {
        // sessionStorage 返回的对象引用每次 parse 都会变
        // 这里用 JSON stringify 缓存对比，防止 React 报 Infinity render 警告
        return JSON.stringify(SessionManager.get(key));
    }, [key]);

    // 3. 连接外部 Store
    const snapshotString = useSyncExternalStore(
        subscribe,
        getSnapshot,
        () => null // Server snapshot (因为你 SSR=false，这里直接 return null 即可)
    );

    // 4. 解析最新的值
    const value = snapshotString ? (JSON.parse(snapshotString) as SessionSchema[K]) : null;

    // 5. 封装暴露出可用的操作方法
    const set = useCallback((val: SessionSchema[K]) => SessionManager.set(key, val), [key]);
    const remove = useCallback(() => SessionManager.remove(key), [key]);

    // 提供一个立即获取最新值的方法（不受 reactive 限制）
    const getLatest = useCallback(() => SessionManager.get(key), [key]);

    return { value, set, remove, getLatest };
}