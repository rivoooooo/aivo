# 用户认证模块实施任务

## 任务清单

### 阶段一：国际化准备

- [x] **1.1** 在 `src/messages/en.json` 中添加 auth 相关key
  - auth.login, auth.register, auth.logout, auth.profile, auth.myChallenges, auth.settings
  - auth.modal.* 登录/注册表单相关文案
  - auth.modal.errors.* 错误提示文案

- [x] **1.2** 在 `src/messages/zh.json` 中添加对应中文翻译
  - 确保中英文key一致

### 阶段二：认证Hook和工具函数

- [x] **2.1** 创建 `src/lib/hooks/use-session.tsx`
  - 实现 useSession hook
  - 管理客户端session状态
  - 提供 signIn, signOut, getSession 方法

- [x] **2.2** 创建 `src/lib/server-auth.ts`
  - 服务器端获取session的工具函数
  - 用于middleware和server components

### 阶段三：UI组件开发

- [x] **3.1** 创建 `src/components/auth/GuestButtons.tsx`
  - 未登录状态显示的Login/Register按钮
  - 终端风格样式
  - 点击触发打开对应Modal

- [x] **3.2** 创建 `src/components/auth/UserMenu.tsx`
  - 已登录状态的用户菜单触发器
  - 下拉面板组件
  - 包含用户名、邮箱、导航项、登出

- [x] **3.3** 创建 `src/components/auth/LoginModal.tsx`
  - 登录表单Modal
  - 终端风格输入框（>前缀、下边框）
  - 表单验证和错误显示
  - 切换到注册Modal的链接

- [x] **3.4** 创建 `src/components/auth/RegisterModal.tsx`
  - 注册表单Modal
  - 终端风格输入框
  - 表单验证和错误显示
  - 切换到登录Modal的链接

- [x] **3.5** 创建 `src/components/auth/AuthSection.tsx`
  - 认证区域入口组件
  - 根据登录状态渲染GuestButtons或UserMenu
  - 处理Modal开关状态

- [x] **3.6** 更新 `src/components/layout/Header.tsx`
  - 集成AuthSection组件
  - 放置在导航链接右侧、主题切换按钮左侧

### 阶段四：API集成

- [x] **4.1** 创建 `src/app/api/auth/get-session/route.ts`
  - GET 返回当前session信息

- [x] **4.2** 创建 `src/app/api/auth/sign-out/route.ts`
  - POST 处理登出请求

### 阶段五：测试和验证

- [x] **5.1** 验证注册功能
  - 测试成功注册流程
  - 测试错误处理（用户名已占用、密码太短等）

- [x] **5.2** 验证登录功能
  - 测试成功登录
  - 测试错误处理（凭证错误）

- [x] **5.3** 验证登出功能

- [x] **5.4** 验证UI交互
  - Modal打开/关闭
  - 用户菜单展开/收起
  - 主题切换
  - 语言切换
  - 响应式布局

- [x] **5.5** 运行 lint 检查
  - 确保无代码风格问题

## 依赖关系

- 任务 1.1 → 1.2（并行无依赖）
- 任务 2.1, 2.2 → 3.1-3.6（组件依赖hook）
- 任务 3.1-3.6 → 4.1-4.2（API集成）
- 任务 1.x, 2.x, 3.x, 4.x → 5.x（全部完成后测试）

## 实施顺序

1. ✅ 首先完成国际化准备（1.1, 1.2）
2. ✅ 然后创建认证Hook和工具（2.1, 2.2）
3. ✅ 接着开发UI组件（3.1-3.6）
4. ✅ 再进行API集成（4.1, 4.2）
5. ✅ 最后进行全面测试（5.1-5.5）

## 已完成

所有任务已完成。用户认证模块已完整实现，包括：
- 前端认证UI（登录/注册Modal、用户菜单）
- Session管理（客户端Hook和Provider）
- 国际化支持（中英文）
- API集成（better-auth）
- 终端风格的UI设计

开发服务器已在 http://localhost:3000 运行。
