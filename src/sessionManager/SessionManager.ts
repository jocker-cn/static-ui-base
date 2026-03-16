// 1. 定义全局严格的 Key-Value 映射契约
export interface SessionSchema {
    token: string;
    theme: 'light' | 'dark';
    userInfo: { id: number; name: string } | null;
    // 在此扩充你的全局 Key ...
}

// 值的来源函数：支持同步或异步
type SourceFn<T> = () => T | Promise<T>;
type Listener = () => void;

class SessionManagerCore {
    private sources = new Map<keyof SessionSchema, SourceFn<any>>();
    private listeners = new Map<keyof SessionSchema, Set<Listener>>();

    // 判断是否在浏览器环境
    private get isBrowser() {
        return typeof window !== 'undefined';
    }

    /**
     * 注册 Key 及其数据来源 (支持链式调用)
     */
    public define<K extends keyof SessionSchema>(key: K, source: SourceFn<SessionSchema[K]>): this {
        this.sources.set(key, source);
        return this;
    }

    /**
     * 项目启动时的初始化遍历
     * 调用方可以选择 await 阻塞，也可以直接调用不阻塞
     */
    public async initAll(): Promise<void> {
        if (!this.isBrowser) return;

        const tasks: Promise<void>[] = [];

        for (const [key, sourceFn] of this.sources.entries()) {
            // 满足设计2：如果 storage 中已存在，则跳过
            if (sessionStorage.getItem(key) !== null) {
                continue;
            }

            try {
                const result = sourceFn();
                if (result instanceof Promise) {
                    // 异步来源
                    tasks.push(
                        result.then((val) => {
                            if (val !== undefined && val !== null) this.set(key, val);
                        })
                    );
                } else {
                    // 同步来源
                    if (result !== undefined && result !== null) this.set(key, result);
                }
            } catch (error) {
                console.error(`[SessionManager] Init failed for key: ${key}`, error);
            }
        }

        await Promise.all(tasks);
    }

    /**
     * 严格类型的 Get
     */
    public get<K extends keyof SessionSchema>(key: K): SessionSchema[K] | null {
        if (!this.isBrowser) return null;
        try {
            const raw = sessionStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    /**
     * 严格类型的 Set，并触发更新
     */
    public set<K extends keyof SessionSchema>(key: K, value: SessionSchema[K]): void {
        if (!this.isBrowser) return;
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            this.notify(key);
        } catch (error) {
            console.error(`[SessionManager] Set failed for key: ${key}`, error);
        }
    }

    /**
     * 严格类型的 Remove
     */
    public remove<K extends keyof SessionSchema>(key: K): void {
        if (!this.isBrowser) return;
        sessionStorage.removeItem(key);
        this.notify(key);
    }

    // --- 内部订阅发布逻辑 ---
    public subscribe<K extends keyof SessionSchema>(key: K, listener: Listener): () => void {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key)!.add(listener);

        // 返回取消订阅的函数
        return () => {
            this.listeners.get(key)?.delete(listener);
        };
    }

    private notify<K extends keyof SessionSchema>(key: K): void {
        this.listeners.get(key)?.forEach((listener) => listener());
    }
}

// 导出单例
export const SessionManager = new SessionManagerCore();