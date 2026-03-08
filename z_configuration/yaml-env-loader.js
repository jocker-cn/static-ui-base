// src/z_configuration/yaml-env-loader.js

module.exports = function (source) {
    // 拦截原始的 YAML 字符串
    // 使用正则匹配 ${VAR_NAME} 或 ${VAR_NAME:默认值} 的格式
    if (this.cacheable) {
        this.cacheable(false);
    }
    return source.replace(/\$\{([^}]+)}/g, (match, envVar) => {
        // 支持 Spring Boot 风格的默认值，例如 ${API_URL:http://localhost:8080}
        const [key, defaultValue] = envVar.split(':');

        // 从 Node.js 的 process.env 中读取真实值
        const value = process.env[key];

        if (value !== undefined) {
            return value;
        } else if (defaultValue !== undefined) {
            return defaultValue;
        } else {
            console.warn(`\n⚠️ [YAML Env Loader] 警告: 环境变量 ${key} 未定义，将被替换为空字符串！`);
            return '';
        }
    });
};