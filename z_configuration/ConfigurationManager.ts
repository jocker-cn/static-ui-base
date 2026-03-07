// src/z_configuration/ConfigurationManager.ts
import { AppConfiguration, IAppConfiguration } from './AppConfiguration';
import { IConfigLoader, DevConfigLoader, SwitcherConfigLoader, BuildConfigLoader } from './ConfigLoaders';

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

// 2. 初始化核心单例
let configInstance = new AppConfiguration(loader.load());
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
}

// 🔥 HMR 钩子：当任意 YAML 文件变动时，通知 Manager 重新 load()
// @ts-ignore
if (process.env.NODE_ENV === 'development' && module.hot) {
    // @ts-ignore
    module.hot.accept(loader.load.id, () => { // 泛指配置目录
        ConfigurationManager.reload();
    });
}