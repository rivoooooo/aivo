# API 服务优化与前端渲染更新计划

## 目标
根据数据库表最新设计，优化 API 服务端点和前端渲染，确保数据正确映射和类型安全。

## 数据库表结构分析

### 1. categories 表
- id, name, description, icon, displayOrder, createdAt

### 2. challenges 表
- id, categoryId (外键), slug, name, description, difficulty, language, createdAt

### 3. challengeResources 表
- id, challengeId (外键), type, importSource, initCode (JSON), codeSource (JSON), displayOrder, createdAt

## 实现步骤

### 1. 优化后端 API 服务 (src/server/index.ts)

创建以下端点：

#### GET /api/challenges
- 获取挑战列表
- 支持查询参数：`lang` (语言筛选), `category` (分类筛选), `difficulty` (难度筛选), `page`, `limit` (分页)

#### GET /api/challenges/:slug
- 获取单个挑战详情（已存在，需优化返回结构）

#### GET /api/challenges/:slug/resources
- 获取挑战的所有资源

#### GET /api/categories
- 获取分类列表

### 2. 更新数据库查询 (src/server/lib/db/queries.ts)

添加新函数：
- `getChallengesList()` - 获取挑战列表（支持分页和筛选）
- `getChallengeWithResourcesOptimized()` - 优化后的单挑战查询
- `getChallengeResourcesByChallengeSlug()` - 通过 slug 获取资源

### 3. 更新前端类型定义 (src/lib/api/challenge.ts)

更新接口定义匹配数据库结构：
- ChallengeFile
- ChallengeResource
- Challenge
- Category
- ApiResponse 类型

### 4. 更新 React Hook (src/lib/hooks/useChallenge.ts)

- 添加列表获取钩子 `useChallenges`
- 添加分类获取钩子 `useCategories`

### 5. 更新前端页面组件

#### 挑战列表页 (challenge/page.tsx)
- 使用新的 API 端点获取数据
- 支持分页、筛选

#### 挑战详情页 (challenge/[slug]/page.tsx)
- 优化数据映射
- 完善空状态处理

#### Playground 页 (challenge/[slug]/playground/page.tsx)
- 同步更新数据获取逻辑

## 验收标准

1. API 端点正确响应，数据结构与数据库表一致
2. TypeScript 类型检查通过
3. 前端页面正确渲染数据
4. 空状态和错误处理正常工作
5. 分页和筛选功能正常
