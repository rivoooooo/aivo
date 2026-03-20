# Tasks - Email Auth Implementation

## Task Dependencies
- Task 4, 5, 6 可并行执行（相互独立）
- Task 7 依赖 Task 4, 5 完成

---

- [ ] Task 1: 创建 auth-client.ts 配置
  - 创建 `src/lib/auth-client.ts`
  - 导出 `authClient` 实例
  - 导出 `useSession`, `signIn`, `signUp`, `signOut` 等 hooks

- [ ] Task 2: 创建登录页面
  - 创建 `src/app/[locale]/(auth)/login/page.tsx`
  - 实现邮箱/密码表单
  - 添加错误处理和加载状态
  - 添加"忘记密码"链接

- [ ] Task 3: 创建注册页面
  - 创建 `src/app/[locale]/(auth)/sign-up/page.tsx`
  - 实现邮箱/密码/确认密码表单
  - 添加密码强度校验
  - 添加邮箱格式校验

- [ ] Task 4: 创建邮箱验证处理 API
  - 创建 `src/app/api/auth/verify-email/route.ts`
  - 实现邮箱验证确认逻辑
  - 创建验证成功页面

- [ ] Task 5: 创建密码重置 API
  - 创建 `src/app/api/auth/forgot-password/route.ts` (请求重置)
  - 创建 `src/app/api/auth/reset-password/route.ts` (执行重置)
  - 创建密码重置成功页面

- [ ] Task 6: 添加 session 验证中间件
  - 更新 `src/middleware.ts` 或创建新的认证中间件
  - 保护需要登录的路由

- [ ] Task 7: 测试邮箱登录和注册
  - 启动开发服务器
  - 测试注册流程
  - 测试登录流程
  - 测试 session 管理
