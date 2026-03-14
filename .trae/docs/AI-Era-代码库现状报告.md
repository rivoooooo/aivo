# AI-Era 代码库现状报告

## 数据库现状

### 表结构

| 表名 | 用途 | 关键字段 |
|------|------|----------|
| `users` | 用户基础信息 | id, email, name, image |
| `sessions` | Better Auth 会话 | id, token, userId, expiresAt |
| `accounts` | Better Auth 账号 | id, providerId, userId, accessToken |
| `verifications` | Better Auth 验证 | id, identifier, value, expiresAt |
| **categories** | 挑战分类 | id, name, description, icon, displayOrder |
| **challenges** | 挑战元信息 | id, categoryId, sandboxId, slug, name, description, difficulty, language, displayOrder, starterCode, isPublished |
| **challengeResources** | 挑战代码资源 | id, challengeId, type, importSource, initCode, codeSource, displayOrder |
| **challengeDependencies** | 挑战依赖关系 | id, challengeId, dependsOn |
| **sandboxes** | 沙箱配置 | id, name, slug, description, type, importSource, files |
| `admins` | 管理员 | id, userId, role |

### 种子数据

**categories 表** - 6个分类：
- HTML, CSS, JavaScript, React, Vue, TypeScript

**challenges 表** - 22个挑战（11个主题 × 2种语言）：
- 每个挑战包含：slug, name, description, difficulty, language

**challengeResources 表** - 8个资源：
- html-form-validation (zh/en)
- react-todo-list (zh/en)
- vue-shopping-cart (zh/en)
- js-calculator (zh)
- css-animated-button (zh)

### 查询函数 (queries.ts)

| 函数名 | 功能 |
|--------|------|
| `getAllCategories()` | 获取所有分类 |
| `getCategoriesWithChallenges(lang)` | 获取分类及关联挑战 |
| `getChallengeBySlug(slug, lang)` | 根据 slug 获取挑战 |
| `getChallengeWithResources(slug, lang, type?)` | 获取挑战及资源 |
| `getChallengesList(params)` | 分页列表查询 |
| `getChallengeResourcesByChallengeSlug()` | 根据 slug 获取资源 |
| `getChallengeDependencies(challengeId)` | 获取挑战依赖 |
| `getUserProgress(userId)` | **占位实现，返回空数组** |
| `getCurrentUser()` | **占位实现，返回 null** |

### 硬编码依赖

**以下字段被代码逻辑依赖，修改需谨慎：**

1. **`challenges.difficulty`** - 值为 `EASY`/`MEDIUM`/`HARD`/`EXPERT`
   - `src/app/[locale]/(main)/challenge/[slug]/page.tsx` 硬编码了颜色映射

2. **`challengeResources.type`** - 值为 `html`/`react`/`vue`/`css`/`javascript`
   - `src/app/[locale]/(main)/challenge/[slug]/page.tsx` 硬编码了类型标签

3. **`challenges.language`** - 值为 `zh`/`en`/`ja`
   - 多处使用 localeToLanguage 映射

---

## 挑战内容现状

### 硬编码内容位置清单

**所有挑战内容都存储在 seed.ts 中**，包括：

| 内容类型 | 位置 | 格式 |
|----------|------|------|
| 分类定义 | seed.ts L11-L18 | TypeScript 对象数组 |
| 挑战元信息 | seed.ts L31-L214 | TypeScript 对象数组 |
| **初始代码模板 (initCode)** | seed.ts L233-L247, L373-L387 等 | JSON 数组（ChallengeFile[]） |
| **参考答案 (codeSource)** | seed.ts L249-L364, L389-L504 等 | JSON 数组（ChallengeFile[]） |
| **esm.sh 依赖引用** | seed.ts L512-L513 | 字符串模板 |

### 数据格式分析

**ChallengeFile 结构：**
```typescript
{
  filename: string;    // 如 "index.html", "App.jsx"
  language: string;    // 如 "html", "javascript", "vue"
  content: string;     // 完整代码内容
}
```

**问题：所有代码内容都是硬编码在 seed.ts 中的字符串**，包括：
- HTML 表单的完整代码（含 CSS 和 JS）
- React 组件代码（使用 React.createElement）
- Vue 单文件组件代码
- CSS 样式代码

---

## 业务逻辑现状

### 组件职责清单

| 组件 | 职责 | 数据来源 |
|------|------|----------|
| `challenge/page.tsx` | 挑战列表页（Server Component） | `getAllCategories()`, `getChallengesByLanguage()` |
| `challenge/[slug]/page.tsx` | 挑战详情页（Client Component） | `useChallenge()` hook → `/api/challenges/[slug]` |
| `challenge/[slug]/playground/page.tsx` | 训练场（Client Component） | `getChallengeConfig()` → `/api/challenges/[slug]` |
| `CodeEditor.tsx` | 代码编辑器 | Props: files, activeFileIndex, onChange |
| `PreviewFrame.tsx` | 预览 iframe | Props: codeSource, importSource, sandboxType |
| `ChallengesMapWrapper.tsx` | 挑战地图交互 | Props: categories, challenges |

### 耦合问题清单

1. **类型标签硬编码** `src/app/[locale]/(main)/challenge/[slug]/page.tsx`
   ```typescript
   const typeLabels: Record<string, { zh: string; en: string }> = {
     html: { zh: 'HTML', en: 'HTML' },
     react: { zh: 'React', en: 'React' },
     vue: { zh: 'Vue', en: 'Vue' },
   };
   ```

2. **难度颜色硬编码** `src/app/[locale]/(main)/challenge/[slug]/page.tsx`
   ```typescript
   const difficultyColors: Record<string, string> = {
     EASY: "var(--success)",
     MEDIUM: "var(--warning)",
     HARD: "var(--chart-3)",
     EXPERT: "var(--error)",
   };
   ```

3. **预览渲染逻辑耦合** `src/app/[locale]/(main)/challenge/[slug]/page.tsx`
   - 组件内根据文件类型硬编码渲染逻辑
   - 对 React 组件特殊处理（添加 UMD 脚本）

4. **Playground 工具函数耦合** `src/app/[locale]/(main)/challenge/[slug]/playground/utils.ts`
   - `getChallengeConfig()` 直接调用 `/api/challenges/[slug]`
   - 在前端做数据转换（sandboxFiles → initCode）

---

## API 路由清单

| 路由 | 方法 | 功能 | 数据来源 |
|------|------|------|----------|
| `/api/challenges/[slug]` | GET | 获取挑战详情 | challenges + sandboxes 表 |
| `/api/admin/challenges` | GET | 获取所有挑战 | challenges 表 |
| `/api/admin/challenges` | POST | 创建挑战 | challenges 表 |
| `/api/admin/sandboxes` | GET/POST | 沙箱管理 | sandboxes 表 |
| `/api/admin/users` | GET | 用户列表 | users 表 |
| `/api/auth/[...all]` | ALL | Better Auth 路由 | Better Auth |
| `/api/auth/sign-out` | POST | 登出 | Better Auth |
| `/api/auth/get-session` | GET | 获取会话 | Better Auth |

---

## 问题汇总

### 需要迁移到数据库的内容

1. **类型标签 (typeLabels)** - 应该存储在 categories 或单独表中
2. **难度等级配置 (difficultyColors)** - 应该存储在数据库或配置表
3. **所有挑战代码内容** - 已经在数据库中，但 seed.ts 是唯一的写入方式

### 需要解耦的逻辑

1. **挑战详情页渲染逻辑** - 应该根据 resource.type 动态选择渲染器，而不是硬编码 if/else
2. **Playground 数据转换** - `getChallengeConfig()` 应该由 API 直接返回正确格式
3. **预览生成逻辑** - 应该提取为独立的渲染服务/函数

### 缺失的字段

| 表 | 缺失字段 | 用途 |
|----|----------|------|
| `challenges` | `xpReward` | 完成挑战获得的 XP |
| `challenges` | `estimatedTime` | 预计完成时间（分钟） |
| `challenges` | `tags` | 挑战标签 |
| `challenges` | `prerequisites` | 前置知识要求 |
| `challengeResources` | `testCases` | 测试用例（用于自动评判） |
| `challengeResources` | `hints` | 提示信息 |
| **缺失表** | `user_progress` | 用户进度追踪 |
| **缺失表** | `challenge_attempts` | 用户尝试记录 |
| **缺失表** | `challenge_tags` | 挑战标签关联 |
| **缺失表** | `challenge_solutions` | 用户提交的解决方案 |

### 重复代码 / 不一致的数据结构

1. **ChallengeFile 类型定义重复**：
   - `src/server/lib/db/schema.ts`
   - `src/app/[locale]/(main)/challenge/[slug]/playground/utils.ts`

2. **API 返回类型不一致**：
   - `/api/challenges/[slug]` 返回 sandboxes 相关字段
   - 但 `getChallengeWithResources()` 查询的是 challengeResources 表

3. **User Progress 完全未实现**：
   - queries.ts 中 `getUserProgress()` 和 `getCurrentUser()` 是占位函数
   - 没有 user_progress 表定义

4. **Sandboxes vs ChallengeResources 混淆**：
   - challenges 表关联 sandboxId
   - 但 challengeResources 表也有 type/importSource/initCode/codeSource
   - 两者功能重叠，架构不清晰

---

## 总结

**当前架构状态：**
- ✅ 基础表结构已建立
- ✅ 多语言支持框架已存在
- ✅ 挑战内容已存入数据库（通过 seed.ts）
- ⚠️ 用户进度系统完全缺失
- ⚠️ 存在 sandboxes 和 challengeResources 双轨制
- ❌ 大量硬编码配置（类型标签、难度颜色）
- ❌ 渲染逻辑与组件耦合
- ❌ 缺少测试用例和自动评判机制
