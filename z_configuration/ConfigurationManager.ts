// src/z_configuration/ConfigurationManager.ts
import {IConfigLoader, DevConfigLoader, SwitcherConfigLoader, BuildConfigLoader} from './ConfigLoaders';
import merge from "lodash/merge";
import get from "lodash/get"; // ⚠️ 需要用到 lodash/get 来根据 prefix 提取数据

const isProd = process.env.NEXT_PUBLIC_ENV === 'production';
const isSwitcherEnabled = process.env.NEXT_PUBLIC_ENABLE_SWITCHER === 'true';

// 1. 初始化具体的策略 Loader
let loader: IConfigLoader;
if (isProd) {
    loader = new BuildConfigLoader();
} else if (isSwitcherEnabled) {
    loader = new SwitcherConfigLoader();
} else {
    loader = new DevConfigLoader();
}

function deepFreeze<T>(obj: T): T {
    if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(prop => {
            const value = (obj as any)[prop];
            if (value && typeof value === 'object') {
                deepFreeze(value);
            }
        });
        return Object.freeze(obj);
    }
    return obj;
}

// ==========================================
// ⚠️ 新架构核心：IoC 容器状态
// ==========================================
// 1. 原始 JSON 数据树 (替代了以前唯一的 configInstance)
let rawYamlData = loader.load();
// 2. 实例缓存池 (类似 Spring 的 Bean Factory)
const instanceCache = new Map<any, any>();
// 3. 页面重绘监听器
const listeners: Array<() => void> = [];

export class ConfigurationManager {
    public static getLoader(): IConfigLoader {
        return loader;
    }

    // ==========================================
    // 🚀 新增：泛型 IoC 获取器 (取代了之前的 get)
    // ==========================================
    public static getConfig<T>(ConfigClass: new () => T): T {
        // 如果缓存池里已经 new 过这个类了，直接返回单例
        if (instanceCache.has(ConfigClass)) {
            return instanceCache.get(ConfigClass);
        }

        // 1. 实例化具体的配置类
        const instance = new ConfigClass();

        // 2. 读取我们在类上打的 @ConfigurationProperties(prefix) 注解
        const prefix = (ConfigClass as any).__configPrefix;

        // 3. 根据前缀，从全局 JSON 树中抠出对应的数据，并深度合并进去
        if (prefix) {
            const prefixData = get(rawYamlData, prefix, {});
            merge(instance, prefixData);
        } else {
            merge(instance, rawYamlData);
        }

        // 4. 判断是否需要冻结防篡改 (你可以把 deepFreeze 开关放在 app 前缀下)
        const shouldFreeze = get(rawYamlData, 'app.deepFreeze', isProd);
        const finalInstance = shouldFreeze ? deepFreeze(instance) : instance;

        // 5. 存入缓存并返回
        instanceCache.set(ConfigClass, finalInstance);
        return finalInstance as T;
    }

    // ==========================================
    // 🛠️ 专供 Dev 悬浮控制台使用的后门方法
    // ==========================================
    public static getRawData() {
        return rawYamlData;
    }

    public static overrideRaw(partialData: any) {
        if (process.env.NODE_ENV !== 'development') return;

        // 1. 合并到原始树
        merge(rawYamlData, partialData);

        // 2. ⚠️ 极其关键：必须清空缓存池！
        // 这样下一次组件通过 Context 重新渲染并调用 getConfig 时，才会映射出带有新值的实例。
        instanceCache.clear();

        // 3. 触发 React 的 renderTick 重绘
        listeners.forEach(l => l());
    }

    // ==========================================
    // 系统级订阅与重载
    // ==========================================
    public static reload() {
        // 重新读取 YAML -> 覆盖原始树 -> 清空缓存 -> 触发页面全量重绘
        rawYamlData = loader.load();
        instanceCache.clear();
        listeners.forEach(l => l());
    }

    public static subscribe(listener: () => void) {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
        };
    }
}

// 🔥 HMR 钩子 (保持不变)
// @ts-ignore
if (process.env.NODE_ENV === 'development' && module.hot) {
    // @ts-ignore
    module.hot.accept(loader.load.id, () => {
        ConfigurationManager.reload();
    });
}