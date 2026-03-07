// src/config/AppConfiguration.ts
import {IsString, IsUrl} from 'class-validator';

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
    isEnvSwitcherEnabled(): boolean; // 新增：是否开启环境切换器
}

// ==========================================
// 3. 具体实现类 (Implementation - 负责处理原始数据和校验)
// ==========================================
export class AppConfiguration implements IAppConfiguration {
    // 我们只对最基础、最致命的字段进行运行期拦截
    @IsUrl({}, {message: 'API Base URL 格式不正确'})
    apiBaseUrl: string;

    // 内部保存原始的 UI 配置树
    private uiConfig: any;

    private app: any;
    private yamlData: any;
    constructor(yamlData: any) {
        // 容错处理：确保即使 YAML 漏写了，也不会导致 undefined 报错
        this.apiBaseUrl = yamlData?.apiBaseUrl || '';
        this.uiConfig = yamlData?.ui || {};
        this.app = yamlData?.app || {};
        this.yamlData = yamlData || {};
    }

    // --- 接口方法实现 ---
    getAppName(): string {
        return this?.app?.name || 'Unknown App';
    }
    isEnvSwitcherEnabled(): boolean {
        // 从 YAML 的 debug 节点获取，默认为 false
        return !!this.yamlData?.debug?.enableEnvSwitcher;
    }
    getAppVersion(): string {
        return this?.app?.version || '1.0.0';
    }

    getApiBaseUrl(): string {
        return this.apiBaseUrl;
    }

    getSidebarLogoTitle(): string {
        return this.uiConfig?.sidebar?.logoTitle || '默认系统名称';
    }

    isSidebarDefaultOpen(): boolean {
        // 默认给 true
        return this.uiConfig?.sidebar?.defaultOpen ?? true;
    }

    getSidebarItems(): SidebarItem[] {
        return this.uiConfig?.sidebar?.items || [];
    }
}