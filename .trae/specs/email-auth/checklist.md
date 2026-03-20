# Checklist - Email Auth Implementation

## Implementation Checkpoints

- [ ] `src/lib/auth-client.ts` 文件创建完成，导出 authClient 实例
- [ ] 登录页面 `/login` 表单功能正常
- [ ] 注册页面 `/sign-up` 表单功能正常
- [ ] 邮箱验证 API `/api/auth/verify-email` 正常工作
- [ ] 密码重置 API `/api/auth/forgot-password` 正常工作
- [ ] 密码重置 API `/api/auth/reset-password` 正常工作
- [ ] Session 中间件正确保护需要认证的路由
- [ ] 注册流程测试通过
- [ ] 登录流程测试通过
- [ ] 代码通过 ESLint 检查
