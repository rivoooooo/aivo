# AGENTS.md - 项目指南

## 项目概述

- **项目名称**: ai-era-web-dev-skills
- **项目类型**: Turbo Repo Monorepo (Next.js Web 应用)
- **核心功能**: AI 时代前端开发者技能挑战平台
- **目标用户**: 开发者

## 技术栈

- **框架**: Next.js 16.1.6
- **语言**: TypeScript
- **包管理器**: pnpm (通过 Turbo Repo 管理)
- **构建系统**: Turbo
- **AI SDK**: @google/genai
- **UI**: React 19 + Tailwind CSS 4 + shadcn/ui
- **样式**: CSS Modules / Tailwind CSS
- **数据库**: PostgreSQL + Drizzle ORM

## Monorepo 结构

```
ai-era/
├── apps/
│   └── web/                    # Next.js 应用
│       ├── app/                # Next.js App Router
│       ├── components/         # 组件
│       ├── lib/               # 工具函数
│       ├── server/            # 后端服务
│       └── ...
├── packages/
│   ├── ui/                     # shadcn/ui 组件库 (@ai-era/ui)
│   │   └── src/
│   │       ├── components/     # UI 组件
│   │       └── index.ts
│   ├── config/                 # 共享配置 (@ai-era/config)
│   │   └── typescript.json
│   └── db/                     # 数据库 Schema (@ai-era/db)
│       └── src/
├── turbo.json                  # Turbo 构建配置
├── pnpm-workspace.yaml         # pnpm workspace 配置
└── package.json                # 根 workspace 配置
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm install` | 安装所有依赖 |
| `pnpm dev` | 启动开发服务器 (web) |
| `pnpm build` | 构建所有包 |
| `pnpm --filter web dev` | 仅启动 web 应用 |
| `pnpm --filter web build` | 仅构建 web 应用 |
| `pnpm turbo lint` | lint 所有包 |
| `pnpm turbo clean` | 清理构建缓存 |

## 数据库命令

| 命令 | 说明 |
|------|------|
| `docker run -d --name api-test-db -e POSTGRES_DB=api_test -e POSTGRES_USER=api_user -e POSTGRES_PASSWORD=api_password -p 5432:5432 postgres:15-alpine` | 启动 PostgreSQL 容器 |
| `pnpm --filter @ai-era/web drizzle-kit push` | 推送 schema 到数据库 |
| `pnpm --filter @ai-era/web drizzle-kit generate` | 生成迁移文件 |
| `pnpm --filter @ai-era/web drizzle-kit studio` | 打开 Drizzle Studio |

## 已完成功能

### 1. Monorepo 结构 (Turbo Repo)
- pnpm workspaces 配置
- Turbo 构建系统
- 独立包结构 (@ai-era/ui, @ai-era/db, @ai-era/config)

### 2. 数据库架构 (Drizzle ORM)
- PostgreSQL 数据库集成
- Drizzle ORM 配置完整
- 分类和挑战表结构

### 3. 多语言支持
- next-intl 国际化配置
- 中英文语言包
- 语言切换组件

### 4. 挑战资源系统
- challenge_resources 子表
- 支持多种类型 (HTML/React/Vue)
- esm.sh 依赖加载

### 5. 训练场 (Playground)
- 代码编辑器组件
- 实时预览 iframe
- 沙箱环境

### 6. Terminal CLI 设计系统
- 双主题支持 (深色/浅色)
- 5 种颜色主题 (Phosphor/Windows/Ember/Alarm/Void)
- 高对比度配色
- 等宽字体风格
- 0px border-radius

### 7. UI 组件 (shadcn/ui)
- 基于 @base-ui/react
- Button, Dialog, DropdownMenu, Input, Toast 等
- Terminal 风格适配 (0px radius)

## 数据库架构

### 表结构

#### categories 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | VARCHAR(100) | 分类名称 (唯一) |
| description | TEXT | 分类描述 |
| icon | VARCHAR(50) | 分类图标 |
| display_order | INTEGER | 显示顺序 |
| created_at | TIMESTAMP | 创建时间 |

#### challenges 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| category_id | UUID | 外键 (关联 categories) |
| slug | VARCHAR(100) | URL 标识 |
| name | VARCHAR(255) | 挑战名称 |
| description | TEXT | 挑战描述 |
| difficulty | VARCHAR(20) | 难度等级 |
| language | VARCHAR(10) | 语言版本 (默认 en) |
| created_at | TIMESTAMP | 创建时间 |

#### challenge_resources 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| challenge_id | UUID | 外键 (关联 challenges) |
| type | VARCHAR(20) | 类型: html, react, vue |
| import_source | TEXT | esm.sh 依赖引用 |
| init_code | JSON | 初始代码模板 |
| code_source | JSON | 最终源码 |
| display_order | INTEGER | 显示顺序 |
| created_at | TIMESTAMP | 创建时间 |

## 路由结构

| 路由 | 说明 |
|------|------|
| `/` | 首页 |
| `/{locale}` | 国际化根路由 |
| `/{locale}/challenge` | 挑战列表页 |
| `/{locale}/challenge/{slug}` | 挑战详情页 |
| `/{locale}/challenge/{slug}/playground` | 训练场页面 |
| `/{locale}/provider` | AI Provider 列表 |
| `/{locale}/provider/{provider}` | Provider 详情页 |

## 开发规范

### 代码规范
- 使用 ESLint 进行代码检查
- 使用 TypeScript 严格模式
- 遵循 React 19 最佳实践
- 使用 Tailwind CSS 进行样式设计
- **遵循设计系统风格指南**: 引用 `prompt.xml` 文件

### 文件命名
- 组件文件使用 PascalCase (如 `GooglePage.tsx`)
- 工具函数使用 camelCase (如 `utils.ts`)
- 配置文件使用小写连字符 (如 `eslint.config.mjs`)

### 代码风格
- 使用函数式组件
- 使用 TypeScript 类型定义
- 使用 ESLint 配置的规则

## 环境配置

### 必需的环境变量

创建 `.env.local` 文件：

```bash
# Google AI API Key
GOOGLE_API_KEY=your_api_key_here

# Database
DATABASE_URL=postgres://api_user:api_password@localhost:5432/api_test

# Better Auth
BETTER_AUTH_SECRET=your_secret_here
```

### Docker PostgreSQL 启动

```bash
# 启动 PostgreSQL 容器
docker run -d --name api-test-db \
  -e POSTGRES_DB=api_test \
  -e POSTGRES_USER=api_user \
  -e POSTGRES_PASSWORD=api_password \
  -p 5432:5432 \
  postgres:15-alpine
```

### Google AI SDK 使用示例

```typescript
import { GoogleGenerativeAI } from '@google/genai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const result = await model.generateContent('Hello, how are you?');
console.log(result.response.text());
```

## 注意事项

1. 项目使用 pnpm 作为包管理器，通过 Turbo Repo 管理
2. 确保在运行前安装依赖：`pnpm install`
3. 开发服务器默认运行在 `http://localhost:3000`
4. 数据库容器默认端口: 5432
5. UI 组件位于 `packages/ui/src/components/`，并复制到 `apps/web/components/ui/`
6. 数据库文件位于 `packages/db/src/`，并复制到 `apps/web/server/lib/db/`

---

> **设计系统风格指南**: 详见 [prompt.xml](./prompt.xml)
