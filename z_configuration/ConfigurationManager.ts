// src/config/ConfigurationManager.ts
import {validateSync} from 'class-validator';
import merge from 'lodash/merge';

// 动态注入的 YAML
import baseConfig from '@base-config';
import profileConfig from '@profile-config';

import {AppConfiguration, IAppConfiguration} from './AppConfiguration';

export class ConfigurationManager {
    private static instance: AppConfiguration;

    public static init() {
        if (process.env.NODE_ENV === 'development' || !this.instance) {
            // 1. 深度合并
            const finalMergedConfig = merge({}, baseConfig, profileConfig || {});

            // 2. 实例化并装载数据
            const localConfig = new AppConfiguration(finalMergedConfig);

            // 3. 执行 class-validator 校验
            const errors = validateSync(localConfig);
            if (errors.length > 0) {
                console.error("❌ UI 配置校验失败:", errors);
            }

            this.instance = localConfig;
        }
    }

    // 全局暴露的单例获取方法
    public static get(): IAppConfiguration {
        if (!this.instance) this.init();
        return this.instance;
    }
}