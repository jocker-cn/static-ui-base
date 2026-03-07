// next.config.js
import path from 'path';
import fs from 'fs';

const activeProfile = process.env.PROFILE;

// 默认指向一个空配置
let profilePath = path.resolve(__dirname, 'z_config/empty.yml');
if (activeProfile) {
    const targetPath = path.resolve(__dirname, `z_config/application-${activeProfile}.yml`);
    if (fs.existsSync(targetPath)) {
        profilePath = targetPath;
        console.log(`✅ Webpack 绑定特定市场扩展配置: ${targetPath}`);
    }
}
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',

    webpack: (config: any) => {
        // ⚠️ 核心改造：精确锁定 yaml-loader 的作用域
        config.module.rules.push({
            test: /\.ya?ml$/,
            // 只有在 include 数组里的文件，才会被转译为 JSON
            include: [
                path.resolve(__dirname, 'application.yml'), // 允许根目录的基础配置
                path.resolve(__dirname, 'z_config')           // 允许 config 目录下的扩展配置
            ],
            use: 'yaml-loader',
        });

        // 动态别名映射
        config.resolve.alias['@base-config'] = path.resolve(__dirname, 'application.yml');
        config.resolve.alias['@profile-config'] = profilePath;

        return config;
    },
};

module.exports = nextConfig;