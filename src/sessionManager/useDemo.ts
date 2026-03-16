import { SessionManager } from './SessionManager';

// 在应用入口或路由守卫处定义规则并初始化
const bootstrap = async () => {
    SessionManager
        .define('theme', () => 'light') // 同步默认值
        .define('userInfo', async () => { // 异步获取默认值
            const res = await fetch('/api/current-user');
            return await res.json();
        });

    // 你决定是否阻塞 UI 渲染
    // await SessionManager.initAll(); // 阻塞式（等待异步取完）
    SessionManager.initAll();          // 非阻塞式
};

bootstrap();


// import { useSession } from '@/hooks/useSession';
//
// export const UserProfile = () => {
//     // 当 userInfo 发生改变时，UserProfile 会自动重新渲染
//     const { value: userInfo, set } = useSession('userInfo');
//
//     return (
//         <div>
//             <p>Hello, {userInfo?.name}</p>
//     <button onClick={() => set({ id: 1, name: 'New Name' })}>
//     Update User
//     </button>
//     </div>
// );
// };