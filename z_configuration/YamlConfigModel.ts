// src/z_configuration/YamlConfigModel.ts

// 1. 侧边栏菜单项配置
export class SidebarItemConfig {
    key: string = '';
    title: string = '';
    path: string = '';
    children?: SidebarItemConfig[];
}

// 2. 侧边栏整体配置
export class SidebarConfig {
    logoTitle: string = '🚀 默认工作台';
    defaultOpen: boolean = false;
    items: SidebarItemConfig[] = [];
}

// 3. UI 整体配置
export class UiConfig {
    sidebar: SidebarConfig = new SidebarConfig();
}

// 4. Debug 调试开关配置
export class DebugConfig {
    enableEnvSwitcher: boolean = false;
}

export class AppConfig {
    name: string = '';
    version: string = '';
    deepFreeze: boolean = false;
}