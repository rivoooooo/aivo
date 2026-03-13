# 用户认证模块规格文档

## 一、概述

### 目标
实现完整的用户认证模块，包括用户注册、登录、身份验证、权限管理等核心功能，与数据库架构和前端界面无缝集成。

### 背景
项目已有以下基础：
- better-auth v1.5.5 已集成
- Drizzle ORM 数据库schema已定义（users, sessions, accounts, verifications表）
- API路由 `/api/auth/*` 已配置
- Header UI 组件存在但缺少认证区域

本模块需要完善：
1. 前端认证UI（登录/注册Modal、用户菜单）
2. 前后端认证状态同步
3. Session管理
4. 管理员权限

## 二、变更内容

### 1. 新增功能
- **AuthSection 组件**: Header认证区域，根据登录状态显示不同UI
- **GuestButtons 组件**: 未登录状态显示Login/Register按钮
- **UserMenu 组件**: 已登录状态显示用户菜单
- **LoginModal 组件**: 登录表单Modal
- **RegisterModal 组件**: 注册表单Modal
- **useSession Hook**: 客户端Session管理
- **服务端认证工具**: 服务器端session获取

### 2. 国际化扩展
在 `en.json` 和 `zh.json` 中新增 auth 相关key

### 3. API扩展
- GET `/api/auth/get-session` - 获取当前session
- POST `/api/auth/sign-out` - 登出

## 三、技术规格

### 认证架构
```
┌─────────────────────────────────────────────────────┐
│                    Frontend                         │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │ AuthSection │  │ LoginModal  │  │RegisterModal│ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬─────┘ │
│         │                │                 │       │
│         └────────────────┼─────────────────┘       │
│                          │                         │
│                    useSession                       │
└──────────────────────────┼──────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────┐
│                   API Layer                         │
│  ┌─────────────────────────────────────────────┐  │
│  │          /api/auth/* (better-auth)           │  │
│  │  /sign-in, /sign-up, /sign-out, /get-session│  │
│  └─────────────────────────────────────────────┘  │
└──────────────────────────┼──────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────┐
│                  Database Layer                     │
│  ┌────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐ │
│  │  users  │ │ sessions│ │ accounts│ │verifications│ │
│  └────────┘ └─────────┘ └─────────┘ └──────────┘ │
└─────────────────────────────────────────────────────┘
```

### UI组件结构
```
components/
├── layout/
│   ├── Header.tsx          # 已存在，需集成AuthSection
│   └── AuthSection.tsx     # 新增：认证区域入口
├── auth/
│   ├── GuestButtons.tsx    # 新增：未登录按钮组
│   ├── UserMenu.tsx        # 新增：用户菜单
│   ├── LoginModal.tsx      # 新增：登录Modal
│   └── RegisterModal.tsx   # 新增：注册Modal
└── ui/
    └── (existing components)
```

### 表结构（已有）
- users: id, email, name, image, createdAt
- sessions: id, expiresAt, token, userId, ipAddress, userAgent
- accounts: id, accountId, providerId, userId, accessToken, refreshToken
- verifications: id, identifier, value, expiresAt

### 安全要求
- 密码使用bcrypt加密（better-auth内置）
- Session使用HttpOnly Cookie
- CSRF保护（better-auth内置）
- 输入验证和错误处理

## 四、需求规格

### Requirement: 用户注册
系统应允许用户通过邮箱和密码注册新账户。

#### Scenario: 成功注册
- **WHEN** 用户填写用户名、邮箱、密码并提交
- **THEN** 在数据库创建新用户记录
- **AND** 返回成功状态
- **AND** 自动登录

#### Scenario: 注册失败 - 用户名已占用
- **WHEN** 用户输入已被使用的用户名
- **THEN** 显示错误信息 "username already taken"
- **AND** 不创建用户记录

#### Scenario: 注册失败 - 邮箱已注册
- **WHEN** 用户输入已被使用的邮箱
- **THEN** 显示错误信息（better-auth默认处理）
- **AND** 不创建用户记录

#### Scenario: 注册失败 - 密码太短
- **WHEN** 用户输入少于8位密码
- **THEN** 显示错误信息 "password must be at least 8 characters"

### Requirement: 用户登录
系统应允许已注册用户通过邮箱/用户名和密码登录。

#### Scenario: 成功登录
- **WHEN** 用户输入正确的凭证并提交
- **THEN** 创建session
- **AND** 返回成功状态
- **AND** 关闭Modal，更新UI为已登录状态

#### Scenario: 登录失败 - 凭证错误
- **WHEN** 用户输入错误的凭证
- **THEN** 显示错误信息 "invalid username or password"
- **AND** 不创建session

### Requirement: 用户登出
已登录用户应能够安全登出。

#### Scenario: 成功登出
- **WHEN** 用户点击Logout菜单项
- **THEN** 清除session
- **AND** 更新UI为未登录状态

### Requirement: 用户菜单
已登录用户应能看到包含个人信息和操作的下拉菜单。

#### Scenario: 展开用户菜单
- **WHEN** 用户点击用户名触发器
- **THEN** 显示下拉面板
- **AND** 面板包含用户名、邮箱、导航链接、登出选项

#### Scenario: 关闭用户菜单
- **WHEN** 用户点击菜单外部区域或按Esc
- **THEN** 关闭下拉面板

### Requirement: 路由保护
某些页面仅允许已登录用户访问。

#### Scenario: 访问受保护页面
- **WHEN** 未登录用户尝试访问受保护页面
- **THEN** 重定向到登录页面或显示错误

## 五、验收标准

### UI验收
- [ ] 未登录：导航右侧显示 [ Login ] [ Register ] 两个按钮
- [ ] 点击 Login 打开登录 Modal，样式正确（终端风格）
- [ ] 点击 Register 打开注册 Modal，样式正确
- [ ] 两个 Modal 可互相切换，不重新打开
- [ ] Modal 点击遮罩 / 右上角 × / Esc 键关闭
- [ ] 表单输入框为终端风格（下边框、> 前缀、focus 高亮）
- [ ] 错误状态显示 [ERR] 格式提示
- [ ] 已登录：导航右侧显示 [ username ▾ ]
- [ ] 点击触发器展开用户菜单，再次点击收起
- [ ] 用户菜单包含 Profile / My Challenges / Settings / Logout 四项
- [ ] Logout 颜色为 destructive
- [ ] 点击菜单外区域关闭下拉
- [ ] 下拉展开 / 收起有过渡动效
- [ ] Hydration 无 warning
- [ ] 两套主题下视觉均正确
- [ ] 移动端：按钮可见，Modal 不超出视口
- [ ] i18n：所有文字通过 t() 调用

### 功能验收
- [ ] 用户可以成功注册新账户
- [ ] 用户可以成功登录
- [ ] 用户可以成功登出
- [ ] Session 在页面刷新后保持
- [ ] API 返回正确的认证状态

### 安全验收
- [ ] 密码不以明文存储
- [ ] Session 使用安全Cookie
- [ ] 错误信息不泄露敏感信息
