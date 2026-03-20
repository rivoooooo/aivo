# Better Auth 邮箱登录功能规格说明

## Why
项目需要完整的用户认证系统，支持邮箱注册和登录功能。已有 better-auth 基础配置和数据库 schema，需补充前端认证客户端、登录/注册页面和邮箱验证流程。

## What Changes
- 创建 `auth-client.ts` 配置 better-auth 前端客户端
- 创建登录页面 `/login`
- 创建注册页面 `/sign-up`
- 实现邮箱验证功能（可选，用户配置后启用）
- 实现忘记密码/重置密码功能
- 添加 session 管理中间件
- 测试邮箱登录和注册流程

## Impact
- Affected specs: 用户认证
- Affected code:
  - `src/lib/auth-client.ts` (新建)
  - `src/app/[locale]/(auth)/login/page.tsx` (新建)
  - `src/app/[locale]/(auth)/sign-up/page.tsx` (新建)
  - `src/lib/middleware.ts` (更新)
  - `src/components/auth/` (新建认证组件)

## ADDED Requirements

### Requirement: 邮箱注册
系统 SHALL 支持用户使用邮箱和密码进行注册。

#### Scenario: 成功注册
- **WHEN** 用户提交有效的邮箱、密码和名称
- **THEN** 系统创建新用户并返回 session

#### Scenario: 邮箱已被使用
- **WHEN** 用户提交已注册的邮箱
- **THEN** 系统返回错误提示

### Requirement: 邮箱登录
系统 SHALL 支持用户使用邮箱和密码进行登录。

#### Scenario: 成功登录
- **WHEN** 用户提交正确的邮箱和密码
- **THEN** 系统返回有效 session 并重定向到首页

#### Scenario: 密码错误
- **WHEN** 用户提交正确邮箱但错误密码
- **THEN** 系统返回错误提示

#### Scenario: 用户不存在
- **WHEN** 用户提交未注册的邮箱
- **THEN** 系统返回错误提示

### Requirement: 邮箱验证
系统 SHALL 支持邮箱验证功能（当 `requireEmailVerification: true` 时）。

#### Scenario: 注册后需要验证
- **WHEN** 用户完成注册且开启了邮箱验证
- **THEN** 系统发送验证邮件，用户需验证后才能登录

### Requirement: 密码重置
系统 SHALL 支持忘记密码功能。

#### Scenario: 请求密码重置
- **WHEN** 用户请求重置密码并提供注册邮箱
- **THEN** 系统发送包含重置链接的邮件

#### Scenario: 重置密码
- **WHEN** 用户点击邮件中的重置链接并提交新密码
- **THEN** 系统更新用户密码并重置所有 session

### Requirement: Session 管理
系统 SHALL 在后续请求中验证用户 session。

#### Scenario: 有效 session
- **WHEN** 用户发起带有效 session 的请求
- **THEN** 系统识别用户身份

#### Scenario: 无效/过期 session
- **WHEN** 用户发起带无效或过期 session 的请求
- **THEN** 系统返回 401 未授权

## MODIFIED Requirements

### Requirement: 现有 Auth 配置
当前 `src/lib/auth.ts` 配置完整但缺少邮件发送配置。

#### Modification
添加可选的 `sendVerificationEmail` 和 `sendResetPasswordEmail` 配置项用于实际邮件发送。

## REMOVED Requirements
无

## 技术实现细节

### Auth Client 配置
```typescript
import { authClient } from "@/lib/auth-client";

export const { useSession, signIn, signUp, signOut } = authClient;
```

### API 端点
- `POST /api/auth/sign-up` - 用户注册
- `POST /api/auth/sign-in` - 用户登录
- `POST /api/auth/sign-out` - 用户登出
- `GET /api/auth/session` - 获取当前 session

### 数据库表
复用现有 schema (`users`, `sessions`, `accounts`, `verifications`)
