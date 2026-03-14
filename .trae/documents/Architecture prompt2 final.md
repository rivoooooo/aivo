# AI-Era 架构重设计 — Prompt 2

> 基于审计报告，直接发给 AI 助手执行。
> 把审计报告（上面那份 .md 文件）和本提示词一起发送。

---

```
你是一个资深全栈架构师。基于上面的审计报告，为 AI-Era 设计新的架构方案。

## 已知关键问题（必须解决）

1. sandboxes 表和 challengeResources 表功能重叠，需要合并统一
2. user_progress 表完全缺失，getUserProgress() 是占位函数
3. ChallengeFile 类型在多处重复定义
4. 类型标签、难度颜色硬编码在组件里
5. Playground 的 getChallengeConfig() 在前端做数据转换，应由 API 直接返回正确格式

## 现有可保留的内容

- Better Auth 相关表（users/sessions/accounts/verifications）→ 不动
- categories 表结构 → 基本保留，可加字段
- ChallengeFile 格式 { filename, language, content } → 保留，这个格式是对的
- challengeDependencies 表 → 保留依赖关系设计
- 多语言方案（language 字段）→ 保留

---

## 设计任务

### Part 1：新版 Schema（Drizzle ORM）

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

#### 1.3 输出要求
- 完整的 schema.ts 代码（Drizzle ORM 语法）
- 所有表的 relations() 定义
- 文件末尾导出所有 $inferSelect 和 $inferInsert 类型

---

### Part 2：统一类型文件

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

---

### Part 3：新版 queries.ts

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

每个函数给出：
- 完整的 Drizzle 查询代码
- 返回类型（TypeScript）
- 如果涉及 JOIN，说明 JOIN 逻辑

---

### Part 4：API 路由更新方案

#### 4.1 需要更新的路由

**/api/challenges/[slug] GET**
现在返回 sandboxes 相关字段，需要改为返回 challengeResources。

给出新的返回格式：
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

给出每个路由的完整实现代码（route.ts）。

---

### Part 5：Playground 数据流修复

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
`playground/utils.ts` 里的 `getChallengeConfig()` 函数不再需要，
说明应该删除哪些代码。

#### 5.3 用户代码保存
设计自动保存逻辑（前端 debounce + /api/progress）：
- 用户修改代码后 2000ms 触发自动保存
- 保存内容：`userCode: ChallengeFile[]`（当前所有文件的内容）
- 给出 useAutoSave hook 的实现

---

### Part 6：迁移执行步骤

基于以上设计，给出从当前状态迁移到新架构的完整步骤。

每一步格式：
```
## Step N：标题

**操作**：具体做什么
**涉及文件**：列出所有需要改动的文件
**注意事项**：可能踩的坑
**验证方式**：怎么确认这步成功
**回滚方案**：如果出错如何撤销
```

步骤要包含：
1. 备份现有数据库
2. 更新 schema.ts（新增字段和表）
3. 运行 db:push 更新数据库
4. 更新 seed.ts（补充缺失字段的数据）
5. 运行 db:seed 重新导入
6. 更新 queries.ts
7. 更新 API 路由
8. 更新 playground/page.tsx 数据流
9. 删除 getChallengeConfig() 和相关前端转换代码
10. 更新类型定义文件
11. 验证所有页面正常运行

---

## 输出格式

每个 Part 单独 ## 章节。
代码用代码块标注语言。
给出可以直接使用的代码，不写伪代码。
如果某处有多种实现方案，给出你推荐的一种并说明原因。

## 技术约束

- Next.js 16 App Router
- TypeScript 严格模式
- Drizzle ORM + PostgreSQL
- bun 包管理器
- Better Auth（不改动认证相关代码）
- 不引入新的重量级依赖
```