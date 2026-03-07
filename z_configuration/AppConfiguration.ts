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
    getApiBaseUrl(): string;

    getSidebarLogoTitle(): string;

    isSidebarDefaultOpen(): boolean;

    getSidebarItems(): SidebarItem[];
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

    constructor(yamlData: any) {
        // 容错处理：确保即使 YAML 漏写了，也不会导致 undefined 报错
        this.apiBaseUrl = yamlData?.apiBaseUrl || '';
        this.uiConfig = yamlData?.ui || {};
    }

    // --- 接口方法实现 ---

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