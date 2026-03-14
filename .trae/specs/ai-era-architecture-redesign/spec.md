# AI-Era 架构重设计规范

## 背景

基于代码库现状审计报告，当前架构存在以下关键问题：

1. **sandboxes 表和 challengeResources 表功能重叠** - 需要合并统一
2. **user_progress 表完全缺失** - getUserProgress() 是占位函数
3. **ChallengeFile 类型在多处重复定义** - 需要统一
4. **类型标签、难度颜色硬编码在组件里** - 需要抽离到配置
5. **Playground 的 getChallengeConfig() 在前端做数据转换** - 应由 API 直接返回正确格式

## 目标

重新设计 AI-Era 架构，解决上述问题，同时：

1. 统一数据模型，消除重复表结构
2. 实现用户进度追踪系统
3. 统一类型定义，消除重复代码
4. 支持技能地图功能
5. 支持每日挑战功能

## 现有可保留的内容

- Better Auth 相关表（users/sessions/accounts/verifications）→ 不动
- categories 表结构 → 基本保留，可加字段
- ChallengeFile 格式 { filename, language, content } → 保留，这个格式是对的
- challengeDependencies 表 → 保留依赖关系设计
- 多语言方案（language 字段）→ 保留

## 变更内容

### Part 1: 新版 Schema（Drizzle ORM）

#### 1.1 保留不动的表
- users / sessions / accounts / verifications（Better Auth，完全不改）
- admins

#### 1.2 重新设计的表

**categories 表（扩展）**
在现有基础上补充：
- `color` VARCHAR —— 分类主题色（用于地图上区域颜色）
- `mapX` INTEGER —— 在技能地图上的大致 X 坐标
- `mapY` INTEGER —— 在技能地图上的大致 Y 坐标

**challenges 表（扩展）**
在现有基础上补充以下字段，删除 sandboxId（不再需要）：
- `xpReward` INTEGER NOT NULL DEFAULT 100
- `estimatedTime` INTEGER —— 预计完成分钟数
- `isDaily` BOOLEAN DEFAULT false —— 是否可作为每日任务
- `tags` TEXT[] —— 标签数组（PostgreSQL 原生数组）
- 删除 `sandboxId`（合并到 challengeResources 后不再需要）

**challengeResources 表（重构，替代原 sandboxes）**
这是核心变动：把 sandboxes 和 challengeResources 合并为一张表。

现有字段保留：id, challengeId, type, importSource, initCode, codeSource, displayOrder

新增字段：
- `name` VARCHAR —— 资源名称（如 "HTML + CSS 沙箱"）
- `testCases` JSONB —— 测试用例（可为空，未来自动评判用）
  格式：{ type: 'manual' | 'auto', cases: [] }

说明：
- initCode 和 codeSource 字段继续使用 JSON 存储 ChallengeFile[]
- ChallengeFile 类型：{ filename: string, language: string, content: string }
- type 字段继续使用：'html' | 'react' | 'vue' | 'css' | 'javascript' | 'typescript'

**user_progress 表（新建）**
```
id           UUID PRIMARY KEY
userId       UUID NOT NULL → users.id
challengeId  UUID NOT NULL → challenges.id
status       VARCHAR: 'in_progress' | 'completed'
startedAt    TIMESTAMP
completedAt  TIMESTAMP（可为空）
xpEarned     INTEGER DEFAULT 0
userCode     JSONB —— 用户最后保存的代码 ChallengeFile[]
UNIQUE(userId, challengeId)
```

**sandbox 表 → 废弃**
challenges.sandboxId 字段删除，sandboxes 表不再使用（数据迁移到 challengeResources）

### Part 2: 统一类型文件

输出 src/types/challenge.ts，包含：

```typescript
// 从 schema 推导的基础类型
export type Category = typeof categories.$inferSelect
export type Challenge = typeof challenges.$inferSelect
export type ChallengeResource = typeof challengeResources.$inferSelect
export type UserProgress = typeof userProgress.$inferSelect

// ChallengeFile（统一定义，消除重复）
export interface ChallengeFile {
  filename: string
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'jsx' | 'vue'
  content: string
}

// 组合类型（供页面使用）
export interface ChallengeWithResources extends Challenge {
  resources: ChallengeResource[]
  category: Category
}

// 地图节点类型（供技能地图组件使用）
export interface ChallengeMapNode {
  id: string
  slug: string
  name: string
  difficulty: string
  categoryId: string
  xpReward: number
  status: 'available' | 'in_progress' | 'completed'  // 登录后才有真实值
}

// 地图数据类型
export interface MapCategory extends Category {
  challenges: ChallengeMapNode[]
}
```

### Part 3: 新版 queries.ts

重写以下函数，给出完整 Drizzle 查询代码：

#### 3.1 保留并更新的查询
- `getAllCategories()` —— 返回类型更新
- `getChallengeBySlug(slug, lang)` —— 返回 ChallengeWithResources
- `getChallengeWithResources(slug, lang, type?)` —— 更新 JOIN 逻辑（不再 JOIN sandboxes）

#### 3.2 新增查询
- `getAllChallengesForMap(userId?: string)` —— 获取所有题目 + 用户进度，返回 MapCategory[]
  供技能地图使用，一次性查出所有需要的数据
- `getUserProgress(userId: string)` —— **真实实现**（当前是占位）
- `upsertUserProgress(data: {...})` —— 创建或更新进度，返回更新后的记录
- `getDailyChallenge(lang: string)` —— 从 isDaily=true 的题目中随机返回一个
- `getUserStats(userId: string)` —— 返回用户总 XP、完成数、连续天数

### Part 4: API 路由更新方案

#### 4.1 需要更新的路由

**/api/challenges/[slug] GET**
现在返回 sandboxes 相关字段，需要改为返回 challengeResources。

新的返回格式：
```typescript
{
  challenge: Challenge,
  resources: ChallengeResource[],
  // resource 中的 initCode 直接是 ChallengeFile[] 格式
  // 不需要前端再做转换
}
```

#### 4.2 需要新增的路由

**/api/progress POST** —— 更新用户进度
请求体：`{ challengeId: string, status: 'in_progress' | 'completed', userCode?: ChallengeFile[] }`
响应：`{ progress: UserProgress, xpEarned: number }`
需要：验证用户已登录（Better Auth session）

**/api/challenges/daily GET** —— 获取今日挑战
响应：`{ challenge: ChallengeWithResources }`

**/api/user/stats GET** —— 获取当前用户统计
响应：`{ totalXp, completedCount, streakDays, progressList: UserProgress[] }`
需要：验证用户已登录

### Part 5: Playground 数据流修复

当前问题：`getChallengeConfig()` 在前端做数据转换（sandboxFiles → initCode）

新的数据流设计：

#### 5.1 Server Component（playground/page.tsx）
直接在服务端获取数据，不走 API：
```typescript
// 伪代码，给出真实实现
const data = await getChallengeWithResources(slug, lang)
// data.resources[0].initCode 已经是 ChallengeFile[] 格式
// 直接传给 Client Component，不需要转换
```

#### 5.2 删除 getChallengeConfig()
`playground/utils.ts` 里的 `getChallengeConfig()` 函数不再需要

#### 5.3 用户代码保存
设计自动保存逻辑（前端 debounce + /api/progress）：
- 用户修改代码后 2000ms 触发自动保存
- 保存内容：`userCode: ChallengeFile[]`（当前所有文件的内容）
- 给出 useAutoSave hook 的实现

## 影响范围

### 受影响的文件

- `src/server/lib/db/schema.ts` - 数据库 schema 重构
- `src/server/lib/db/queries.ts` - 查询函数重写
- `src/types/challenge.ts` - 新增统一类型文件
- `src/app/api/challenges/[slug]/route.ts` - API 路由更新
- `src/app/api/progress/route.ts` - 新增 API 路由
- `src/app/api/challenges/daily/route.ts` - 新增 API 路由
- `src/app/api/user/stats/route.ts` - 新增 API 路由
- `src/app/[locale]/challenge/[slug]/playground/page.tsx` - Playground 页面数据流修复
- `src/app/[locale]/challenge/[slug]/playground/utils.ts` - 删除 getChallengeConfig()
- `src/app/[locale]/challenge/[slug]/page.tsx` - 难度颜色、类型标签硬编码修复

### 受影响的规范

- playground-system-redesign（需要协调，避免冲突）

## 新增需求

### 需求: 数据库 Schema 重构

系统应重构数据库 schema，合并 sandboxes 和 challengeResources 表

#### 场景: 表结构合并
- **当** 迁移执行时
- **然后** sandboxes 表数据迁移到 challengeResources
- **然后** challenges.sandboxId 字段被删除
- **然后** 新增 user_progress 表

### 需求: 用户进度追踪

系统应追踪用户的学习进度

#### 场景: 开始挑战
- **当** 用户首次进入 Playground
- **然后** 创建 user_progress 记录，status = 'in_progress'

#### 场景: 完成挑战
- **当** 用户提交完成
- **然后** 更新 status = 'completed'
- **然后** 记录 completedAt 和 xpEarned

#### 场景: 自动保存代码
- **当** 用户修改代码后 2 秒
- **然后** 自动保存 userCode 到数据库

### 需求: 技能地图数据

系统应提供技能地图所需的数据

#### 场景: 获取地图数据
- **当** 用户访问技能地图页面
- **然后** 返回所有分类和挑战
- **然后** 包含挑战的完成状态（如果已登录）

### 需求: 每日挑战

系统应支持每日挑战功能

#### 场景: 获取今日挑战
- **当** 用户访问每日挑战
- **然后** 从 isDaily=true 的挑战中随机返回一个

### 需求: 统一类型定义

系统应统一 ChallengeFile 类型定义

#### 场景: 类型一致性
- **当** 开发新功能时
- **然后** 从 src/types/challenge.ts 导入类型
- **然后** 不再重复定义 ChallengeFile

## 技术约束

- Next.js 16 App Router
- TypeScript 严格模式
- Drizzle ORM + PostgreSQL
- bun 包管理器
- Better Auth（不改动认证相关代码）
- 不引入新的重量级依赖
