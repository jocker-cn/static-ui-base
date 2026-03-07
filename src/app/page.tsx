import React from 'react';
import {ConfigurationManager} from "@/z_configuration/ConfigurationManager";

export default function BulletproofLayout() {

    const config = ConfigurationManager.get();

    return (
        // 最外层容器：铺满全屏，采用 Flex 左右布局
        <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'system-ui, sans-serif', margin: 0 }}>

            {/* ================= 左侧侧边栏 (Sidebar) ================= */}
            <div style={{
                width: '260px',
                backgroundColor: '#2c3e50', // 深蓝色背景，视觉反差强烈
                color: '#ecf0f1',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
                zIndex: 10
            }}>
                {/* Logo 区域 */}
                <div style={{ padding: '20px', fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid #34495e' }}>
                    🚀 UI 配置中枢
                    {config.getSidebarLogoTitle()}
                </div>

                {/* 导航菜单 */}
                <div style={{ padding: '20px', flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <li style={{ padding: '12px 15px', backgroundColor: '#34495e', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            📊 仪表盘 (当前)
                        </li>
                        <li style={{ padding: '12px 15px', borderRadius: '6px', cursor: 'pointer', color: '#bdc3c7' }}>
                            ⚙️ 全局设置
                        </li>
                        <li style={{ padding: '12px 15px', borderRadius: '6px', cursor: 'pointer', color: '#bdc3c7' }}>
                            📝 动态表单
                        </li>
                    </ul>
                </div>
            </div>

            {/* ================= 右侧主内容区 (Main Content) ================= */}
            <div style={{ flex: 1, backgroundColor: '#f5f6fa', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* 顶部 Header */}
                <div style={{
                    height: '60px',
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #dcdde1',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    fontWeight: 'bold',
                    color: '#2f3640'
                }}>
                    顶部导航栏 (Header)
                </div>

                {/* 核心内容区 */}
                <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>

                    <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#2f3640', marginTop: 0 }}>
                            欢迎来到核心页面！
                        </h1>

                        <p style={{ color: '#7f8c8d', lineHeight: '1.8', fontSize: '15px' }}>
                            这是一个采用了<strong>绝对防弹（Bulletproof）内联样式</strong>编写的经典左右布局。<br/>
                            如果你现在能清晰地看到左边的深色侧边栏和右边的白色内容区，说明你的 React 渲染引擎运行得非常完美。<br/>
                        </p>

                        <div style={{
                            marginTop: '30px',
                            padding: '20px',
                            backgroundColor: '#e8f8f5',
                            borderLeft: '5px solid #1abc9c',
                            color: '#16a085',
                            borderRadius: '0 4px 4px 0'
                        }}>
                            <strong>💡 架构师建议：</strong><br/>
                            样式框架（如 Tailwind）配坏了是常有的事。我们先把骨架立住。
                            接下来，你希望我们在这张“干净的画布”上，如何把我们之前设计的 <code>application.yml</code> 动态配置接进来？
                            比如：用 YAML 来控制左侧菜单的列表项？
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
}