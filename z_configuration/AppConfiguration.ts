// src/config/AppConfiguration.ts
import {AppConfig, DebugConfig, SidebarItemConfig, UiConfig} from "@/z_configuration/YamlConfigModel";
import merge from "lodash/merge";

// ==========================================
// 1. 数据结构定义 (Types)
// ==========================================
export interface SidebarItem {
    key: string;
    title: string;
    path: string;
    icon?: string;
    children?: SidebarItem[];
}

// ==========================================
// 2. 接口定义 (Interface - 暴露给 UI 组件的唯一契约)
// ==========================================
export interface IAppConfiguration {
    getAppName(): string;

    getAppVersion(): string;

    getApiBaseUrl(): string;

    getSidebarLogoTitle(): string;

    isSidebarDefaultOpen(): boolean;

    getSidebarItems(): SidebarItem[];

    isEnvSwitcherEnabled(): boolean;
}

// ==========================================
// 3. 具体实现类 (Implementation - 负责处理原始数据和校验)
// ==========================================
export abstract class AbstractAppConfiguration implements IAppConfiguration {

    // --- 数据属性声明 (并赋予绝对安全的默认值) ---
    public app: AppConfig = new AppConfig();
    public apiBaseUrl: string = '';
    public ui: UiConfig = new UiConfig();

    public debug: DebugConfig = new DebugConfig();
    // --- 接口的默认实现 (直接操作自身的属性) ---
    public getApiBaseUrl(): string {
        return this.apiBaseUrl;
    }

    public getSidebarLogoTitle(): string {
        return this.ui.sidebar.logoTitle;
    }

    public getSidebarItems(): SidebarItemConfig[] {
        return this.ui.sidebar.items;
    }

    public isEnvSwitcherEnabled(): boolean {
        return this.debug.enableEnvSwitcher;
    }


    getAppName(): string {
        return `${this.app.name} UAT`;
    }

    getAppVersion(): string {
        return this.app.version;
    }

    isSidebarDefaultOpen(): boolean {
        return this.ui.sidebar.defaultOpen;
    }

}

export class AppConfiguration extends AbstractAppConfiguration {

    constructor(rawYamlData: any) {
        super();

        // ⚠️ Java/C# 架构师最爱的魔法：
        // 直接将传入的 JSON 对象与当前实例 (this) 进行深度合并。
        // 因为 super() 已经执行，this 上已经有了所有的默认值。
        // 如果 rawYamlData 缺斤少两，合并后依然会有默认值兜底！
        merge(this, rawYamlData);
    }

    // 如果某个特殊环境需要覆盖默认逻辑，直接在这里 Override 即可！
    // override getSidebarLogoTitle(): string {
    //     return `[测试环境] ${super.getSidebarLogoTitle()}`;
    // }
}