# AI Era Web Dev Skills

> AI 时代前端开发者技能挑战平台

一个基于 Next.js 16 的技能挑战平台，帮助前端开发者提升 AI 辅助开发能力。

## 🚀 快速开始

```bash
# 1. 安装依赖
bun install

# 2. 启动开发服务器
bun run dev
```

访问 [http://localhost:3000](http://localhost:3000)

---

## 🛠 技术栈

| 技术 | 说明 |
|------|------|
| Next.js 16.1.6 | App Router 架构 |
| TypeScript | 类型安全 |
| bun | 包管理器 |
| React 19 + Tailwind CSS 4 | UI 开发 |
| PostgreSQL + Drizzle ORM | 数据持久化 |
| next-intl | 国际化 |
| @google/genai | Google AI 集成 |

---

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   └── [locale]/          # 国际化路由
│       ├── challenge/     # 挑战相关页面
│       │   └── [slug]/
│       │       ├── page.tsx
│       │       └── playground/
│       ├── provider/      # AI Provider 页面
│       └── page.tsx       # 首页
├── components/            # React 组件
├── lib/                   # 工具函数
│   ├── api/              # API 客户端
│   └── hooks/            # 自定义 Hooks
├── server/lib/db/        # 数据库层
│   ├── schema.ts         # 表结构定义
│   ├── index.ts          # 数据库连接
│   ├── queries.ts        # 查询函数
│   └── seed.ts           # 种子数据
└── messages/              # 国际化语言包
```

---

## 📋 常用命令

```bash
# 开发
bun run dev              # 启动开发服务器
bun run build            # 构建生产版本
bun run start            # 运行生产版本

# 代码检查
bun run lint             # ESLint 检查
npx tsc --noEmit         # TypeScript 检查

# 数据库
bun run db:push          # 推送 schema 到数据库
bun run db:seed          # 导入种子数据
bun run db:generate      # 生成迁移文件
```

---

## 🐳 数据库配置

### 启动 PostgreSQL

```bash
docker run -d --name api-test-db \
  -e POSTGRES_DB=api_test \
  -e POSTGRES_USER=api_user \
  -e POSTGRES_PASSWORD=api_password \
  -p 5432:5432 \
  postgres:15-alpine
```

### 环境变量

创建 `.env.local`：

```bash
GOOGLE_API_KEY=your_api_key_here
DATABASE_URL=postgres://api_user:api_password@localhost:5432/api_test
```

---

## 🌍 路由一览

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/{locale}` | 国际化根路由 |
| `/{locale}/challenge` | 挑战列表 |
| `/{locale}/challenge/{slug}` | 挑战详情 |
| `/{locale}/challenge/{slug}/playground` | 训练场 |
| `/{locale}/provider` | AI Provider 列表 |
| `/{locale}/provider/{provider}` | Provider 详情 |

---

## ✨ 功能特性

- **挑战系统** - 多类别前端技能挑战
- **训练场** - 实时代码编辑与预览
- **多语言** - 中英文无缝切换
- **AI 集成** - Google Generative AI 支持
- **Terminal UI** - 终端风格界面

---

## 📖 进一步了解

- [Next.js 官方文档](https://nextjs.org/docs)
- [Next.js 学习路径](https://nextjs.org/learn)
- [Vercel 部署](https://vercel.com/new)

---

## 📄 许可证

MIT