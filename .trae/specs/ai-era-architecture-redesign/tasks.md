# AI-Era 架构重设计任务清单

## Part 1: 数据库 Schema 重构

### 任务 1.1: 更新 schema.ts 定义
- [ ] 1.1.1: 扩展 categories 表（添加 color, mapX, mapY 字段）
- [ ] 1.1.2: 扩展 challenges 表（添加 xpReward, estimatedTime, isDaily, tags 字段，删除 sandboxId）
- [ ] 1.1.3: 重构 challengeResources 表（添加 name, testCases 字段）
- [ ] 1.1.4: 新建 user_progress 表
- [ ] 1.1.5: 更新 relations 定义
- [ ] 1.1.6: 导出所有 $inferSelect 和 $inferInsert 类型

### 任务 1.2: 创建数据库迁移
- [ ] 1.2.1: 备份现有数据库
- [ ] 1.2.2: 运行 db:push 更新数据库结构
- [ ] 1.2.3: 迁移 sandboxes 数据到 challengeResources
- [ ] 1.2.4: 删除 sandboxes 表
- [ ] 1.2.5: 验证迁移结果

### 任务 1.3: 更新 seed.ts
- [ ] 1.3.1: 更新 categories 种子数据（添加 color, mapX, mapY）
- [ ] 1.3.2: 更新 challenges 种子数据（添加新字段，移除 sandboxId）
- [ ] 1.3.3: 更新 challengeResources 种子数据（添加 name 字段）
- [ ] 1.3.4: 运行 db:seed 验证数据导入

## Part 2: 统一类型定义

### 任务 2.1: 创建类型文件
- [ ] 2.1.1: 创建 src/types/challenge.ts 文件
- [ ] 2.1.2: 定义 ChallengeFile 接口
- [ ] 2.1.3: 定义 ChallengeWithResources 接口
- [ ] 2.1.4: 定义 ChallengeMapNode 和 MapCategory 接口
- [ ] 2.1.5: 导出 schema 推导的基础类型

### 任务 2.2: 替换重复类型定义
- [ ] 2.2.1: 更新 playground/utils.ts，使用统一类型
- [ ] 2.2.2: 更新 schema.ts 中的 ChallengeFile 引用
- [ ] 2.2.3: 检查并更新其他文件中的 ChallengeFile 定义

## Part 3: 重写 queries.ts

### 任务 3.1: 更新现有查询
- [ ] 3.1.1: 重写 getAllCategories() 函数
- [ ] 3.1.2: 重写 getChallengeBySlug(slug, lang) 函数
- [ ] 3.1.3: 重写 getChallengeWithResources(slug, lang, type?) 函数

### 任务 3.2: 新增查询函数
- [ ] 3.2.1: 实现 getAllChallengesForMap(userId?: string) 函数
- [ ] 3.2.2: 实现 getUserProgress(userId: string) 函数（真实实现）
- [ ] 3.2.3: 实现 upsertUserProgress(data) 函数
- [ ] 3.2.4: 实现 getDailyChallenge(lang: string) 函数
- [ ] 3.2.5: 实现 getUserStats(userId: string) 函数

## Part 4: API 路由实现

### 任务 4.1: 更新现有 API 路由
- [ ] 4.1.1: 更新 /api/challenges/[slug]/route.ts，返回 challengeResources 格式

### 任务 4.2: 新增 API 路由
- [ ] 4.2.1: 创建 /api/progress/route.ts（POST 方法）
- [ ] 4.2.2: 创建 /api/challenges/daily/route.ts（GET 方法）
- [ ] 4.2.3: 创建 /api/user/stats/route.ts（GET 方法）

### 任务 4.3: 认证中间件
- [ ] 4.3.1: 在 /api/progress 中添加 Better Auth 会话验证
- [ ] 4.3.2: 在 /api/user/stats 中添加 Better Auth 会话验证

## Part 5: Playground 数据流修复

### 任务 5.1: 重构 Playground 页面
- [ ] 5.1.1: 更新 playground/page.tsx，直接使用 getChallengeWithResources
- [ ] 5.1.2: 删除 getChallengeConfig() 调用
- [ ] 5.1.3: 更新组件 props 传递

### 任务 5.2: 删除冗余代码
- [ ] 5.2.1: 删除 playground/utils.ts 中的 getChallengeConfig() 函数
- [ ] 5.2.2: 清理相关类型定义

### 任务 5.3: 实现自动保存
- [ ] 5.3.1: 创建 useAutoSave hook
- [ ] 5.3.2: 实现 2000ms debounce 逻辑
- [ ] 5.3.3: 集成 /api/progress POST 调用
- [ ] 5.3.4: 在 playground 页面中使用 useAutoSave

## Part 6: 硬编码配置抽离

### 任务 6.1: 难度颜色配置
- [ ] 6.1.1: 在 challenge.ts 类型文件中定义难度颜色映射
- [ ] 6.1.2: 更新 challenge/[slug]/page.tsx，使用配置而非硬编码

### 任务 6.2: 类型标签配置
- [ ] 6.2.1: 在 challenge.ts 类型文件中定义类型标签映射
- [ ] 6.2.2: 更新 challenge/[slug]/page.tsx，使用配置而非硬编码

## Part 7: 验证和测试

### 任务 7.1: 类型检查
- [ ] 7.1.1: 运行 npx tsc --noEmit
- [ ] 7.1.2: 修复所有类型错误

### 任务 7.2: 功能测试
- [ ] 7.2.1: 测试数据库迁移是否成功
- [ ] 7.2.2: 测试查询函数是否正常工作
- [ ] 7.2.3: 测试 API 路由是否返回正确格式
- [ ] 7.2.4: 测试 Playground 数据流是否正常
- [ ] 7.2.5: 测试自动保存功能

### 任务 7.3: 回归测试
- [ ] 7.3.1: 测试挑战列表页
- [ ] 7.3.2: 测试挑战详情页
- [ ] 7.3.3: 测试技能地图（如有）

## 任务依赖关系

```
Part 1 (数据库)
  ├── 1.1 → 1.2 → 1.3
  │
Part 2 (类型) ← 依赖 Part 1 完成
  ├── 2.1 → 2.2
  │
Part 3 (查询) ← 依赖 Part 1, 2 完成
  ├── 3.1 → 3.2
  │
Part 4 (API) ← 依赖 Part 3 完成
  ├── 4.1 → 4.2 → 4.3
  │
Part 5 (Playground) ← 依赖 Part 2, 3, 4 完成
  ├── 5.1 → 5.2 → 5.3
  │
Part 6 (配置) ← 依赖 Part 2 完成
  ├── 6.1 → 6.2
  │
Part 7 (验证) ← 依赖所有前面部分完成
```

## 优先级

### P0 - 必须完成
- 1.1 更新 schema.ts 定义
- 1.2 创建数据库迁移
- 2.1 创建类型文件
- 3.1 更新现有查询
- 3.2 新增查询函数
- 4.1 更新现有 API 路由
- 5.1 重构 Playground 页面

### P1 - 重要
- 1.3 更新 seed.ts
- 2.2 替换重复类型定义
- 4.2 新增 API 路由
- 5.2 删除冗余代码
- 5.3 实现自动保存
- 6.1 难度颜色配置
- 6.2 类型标签配置

### P2 - 可选
- 4.3 认证中间件（如果 Better Auth 已集成）
- 7.3 回归测试
