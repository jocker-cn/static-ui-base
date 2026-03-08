// src/z_configuration/ConfigurationManager.ts
import {AppConfiguration, IAppConfiguration} from './AppConfiguration';
import {IConfigLoader, DevConfigLoader, SwitcherConfigLoader, BuildConfigLoader} from './ConfigLoaders';
import merge from "lodash/merge";

const isProd = process.env.NEXT_PUBLIC_ENV === 'production';
// 假设你通过环境变量 NEXT_PUBLIC_ENABLE_SWITCHER=true 来专门开启切换台
const isSwitcherEnabled = process.env.NEXT_PUBLIC_ENABLE_SWITCHER === 'true';

// 1. 简单工厂：根据环境初始化具体的策略 Loader
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

// 2. 初始化核心单例
let configInstance = new AppConfiguration(loader.load());

if (configInstance.app.deepFreeze) {
    configInstance = deepFreeze(configInstance);
}

const listeners: Array<() => void> = [];

export class ConfigurationManager {
    public static get(): IAppConfiguration {
        return configInstance;
    }

    public static getLoader(): IConfigLoader {
        return loader;
    }

    // 重载配置并触发 UI 刷新
    public static reload() {
        configInstance = new AppConfiguration(loader.load());
        listeners.forEach(l => l());
    }

    public static subscribe(listener: () => void) {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
        };
    }

    public static override(partialConfig: any) {
        if (process.env.NODE_ENV !== 'development') return; // 生产环境防呆保护

        // 1. 将新的局部值深度合并到当前单例中
        merge(configInstance, partialConfig);

        // 2. 触发我们在 ClientOnly 中注册的 renderTick 监听器！
        listeners.forEach(l => l());
    }
}

// 🔥 HMR 钩子：当任意 YAML 文件变动时，通知 Manager 重新 load()
// @ts-ignore
if (process.env.NODE_ENV === 'development' && module.hot) {
    // @ts-ignore
    module.hot.accept(loader.load.id, () => { // 泛指配置目录
        ConfigurationManager.reload();
    });
}