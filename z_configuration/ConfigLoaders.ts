// src/z_configuration/ConfigLoaders.ts
import merge from 'lodash/merge';
import baseConfig from '@base-config';

// ==========================================
// 1. 定义标准加载器接口
// ==========================================
export interface IConfigLoader {
    load(): any; // 返回合并后的完整 JSON 配置
    getCurrentProfileName(): string;
    // 仅在 Switcher 模式下有意义的方法，其他模式可空实现
    switchProfile?(profileName: string): void;
    getAvailableProfiles?(): string[];
}

// ⚠️ 核心魔法：Webpack 全量扫描目录下的扩展配置
// 这样我们在 Dev 和 Switcher 模式下，可以直接从内存里按名字取 YAML
const getYamlContext = () => {
    try {
        // @ts-ignore
        return require.context('@/z_config', false, /application-.*\.ya?ml$/);
    } catch (e) {
        return null;
    }
};

// ==========================================
// 策略 1：本地 Dev 开发加载器
// 优势：动态读取 process.env，改了 .env 后 Next.js 重新注入变量，直接生效！
// ==========================================
export class DevConfigLoader implements IConfigLoader {
    load() {
        const profile = this.getCurrentProfileName();
        const context = getYamlContext();
        let profileConfig = {};

        if (context && profile) {
            const key = `./application-${profile}.yml`;
            if (context.keys().includes(key)) {
                profileConfig = context(key).default || context(key);
            }
        }
        return merge({}, baseConfig, profileConfig);
    }

    getCurrentProfileName() {
        // 直接读取运行时环境变量
        console.log(process.env.NEXT_PUBLIC_PROFILE)
        return process.env.NEXT_PUBLIC_PROFILE || 'default';
    }
}

// ==========================================
// 策略 2：市场切换加载器 (QA 测试环境)
// 优势：读写 LocalStorage，提供全量 Profile 列表供悬浮窗使用
// ==========================================
export class SwitcherConfigLoader implements IConfigLoader {
    private activeProfile: string;

    constructor() {
        // 初始化时优先读取缓存
        if (typeof window !== 'undefined') {
            this.activeProfile = localStorage.getItem('__active_env_key') || process.env.NEXT_PUBLIC_PROFILE || 'default';
        } else {
            this.activeProfile = 'default';
        }
    }

    load() {
        const context = getYamlContext();
        let profileConfig = {};
        if (context) {
            const key = `./application-${this.activeProfile}.yml`;
            if (context.keys().includes(key)) {
                profileConfig = context(key).default || context(key);
            }
        }
        return merge({}, baseConfig, profileConfig);
    }

    getCurrentProfileName() { return this.activeProfile; }

    getAvailableProfiles() {
        const context = getYamlContext();
        if (!context) return [];
        return context.keys().map((k: string) => {
            const match = k.match(/application-(.*)\.ya?ml$/);
            return match ? match[1] : '';
        }).filter(Boolean);
    }

    switchProfile(profileName: string) {
        this.activeProfile = profileName;
        if (typeof window !== 'undefined') {
            localStorage.setItem('__active_env_key', profileName);
        }
    }
}

// ==========================================
// 策略 3：纯净 Build 加载器 (生产环境)
// 优势：完全静态，最高性能，依赖 Webpack Alias 进行死绑定
// ==========================================
export class BuildConfigLoader implements IConfigLoader {
    load() {
        // 直接读取 next.config.js 绑定的 alias，没有任何动态查找逻辑
        const buildProfileConfig = require('@profile-config');
        return merge({}, baseConfig, buildProfileConfig.default || buildProfileConfig);
    }

    getCurrentProfileName() {
        return process.env.NEXT_PUBLIC_PROFILE || 'production';
    }
}