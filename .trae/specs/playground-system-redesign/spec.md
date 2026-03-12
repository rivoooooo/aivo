# Playground 系统重构规范

## 背景

当前 Playground 存在以下问题:

1. 编辑器和预览没有连接,预览显示的是数据库中的静态代码
2. 缺少对 Vue/React SFC 的在线运行支持
3. 没有管理后台来管理模板和挑战
4. 用户系统不完善

## 目标

重新设计 Playground 系统,使其成为一个完整的在线编程训练平台:

1. 引入 Sandbox 模板系统 - 基础运行环境配置
2. 引入 Admin 管理后台 - 管理模板和挑战
3. 集成 Better Auth - 用户认证系统
4. 支持 Vue/React SFC 在线运行
5. 重构数据库设计

## 核心概念

### Sandbox 模板

Sandbox 模板是预配置的代码运行环境,包含:

* **类型**: html, javascript, react, vue

* **文件配置**: 1-2 个基础文件

* **依赖**: 通过 esm.sh 引入的外部库

* **示例**:

  * 纯 HTML 模板 (index.html + style.css)

  * React 模板 (App.jsx + index.html)

  * Vue 模板 (App.vue + index.html)

### 挑战 (Challenge)

基于 Sandbox 模板创建的编程挑战:

* 继承模板的文件结构

* 可以自定义初始代码

* 包含挑战描述和难度

### 用户系统

使用 Better Auth 实现:

* 邮箱/密码登录

* OAuth (Google 等)

* 管理员角色

### 管理后台

Admin 页面用于:

* 创建/编辑 Sandbox 模板

* 创建/编辑挑战

* 用户管理

## 变更内容

### 1. 数据库重构

#### 1.1 新增表: sandboxes (模板)

```sql
sandboxes (
  id: UUID PRIMARY KEY,
  name: VARCHAR(255),           -- 模板名称
  slug: VARCHAR(100) UNIQUE,   -- URL 标识
  description: TEXT,            -- 描述
  type: VARCHAR(20),           -- html | javascript | react | vue
  importSource: TEXT,            -- esm.sh 依赖
  files: JSON,                  -- 文件配置
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
)
```

#### 1.2 修改 challenges 表

* 移除原有的 resources 子表

* 改为引用 sandbox 模板

* 添加管理员字段

```sql
challenges (
  id: UUID PRIMARY KEY,
  categoryId: UUID REFERENCES categories(id),
  sandboxId: UUID REFERENCES sandboxes(id),  -- 新增: 关联模板
  slug: VARCHAR(100),
  name: VARCHAR(255),
  description: TEXT,
  difficulty: VARCHAR(20),
  language: VARCHAR(10) DEFAULT 'en',
  starterCode: JSON,             -- 自定义的初始代码 (覆盖模板)
  isPublished: BOOLEAN DEFAULT false,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
)
```

#### 1.3 用户和认证表

使用 Better Auth 生成的表:

* users

* sessions

* accounts

* verification

* admin (插件)

#### 1.4 管理员角色表

```sql
admins (
  id: UUID PRIMARY KEY,
  userId: UUID REFERENCES users(id) UNIQUE,
  role: VARCHAR(20) DEFAULT 'admin',  -- admin | super_admin
  createdAt: TIMESTAMP
)
```

### 2. Sandbox 模板系统

#### 2.1 模板类型

* **html**: 纯 HTML/CSS/JS

* **javascript**: 原生 JavaScript

* **react**: React 组件 (使用 htm + React 或编译)

* **vue**: Vue SFC (使用 @vue/repl)

#### 2.2 模板文件结构

```typescript
interface SandboxFile {
  filename: string;
  language: string;  // html | css | javascript | react | vue
  content: string;
}

interface SandboxTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'html' | 'javascript' | 'react' | 'vue';
  importSource: string;
  files: SandboxFile[];
}
```

#### 2.3 模板到挑战的映射

* 挑战继承模板的所有配置

* 可以覆盖模板中的初始代码

* 预览时使用挑战的自定义代码

### 3. Admin 管理后台

#### 3.1 路由结构

```
/{locale}/admin              -- 管理后台首页
/{locale}/admin/sandboxes   -- 模板管理
/{locale}/admin/sandboxes/new     -- 新建模板
/{locale}/admin/sandboxes/[id]   -- 编辑模板
/{locale}/admin/challenges  -- 挑战管理
/{locale}/admin/challenges/new    -- 新建挑战
/{locale}/admin/challenges/[id]  -- 编辑挑战
/{locale}/admin/users       -- 用户管理
```

#### 3.2 功能列表

* **模板管理**: CRUD 操作

* **挑战管理**: 基于模板创建挑战

* **用户管理**: 查看/禁用用户

### 4. Playground 重构

#### 4.1 数据流

```
挑战数据 → 获取 sandbox 配置 → 合并初始代码 → 编辑器/预览
```

#### 4.2 预览模式

根据 sandbox 类型选择:

* **html/javascript**: 自定义 iframe 渲染

* **react**: htm + React 浏览器端渲染

* **vue**: @vue/repl 组件

#### 4.3 实时更新

* 编辑器修改 → 状态更新 → 预览重新渲染

### 5. Better Auth 集成

#### 5.1 认证配置

* 邮箱/密码登录

* Google OAuth

* Session 管理

#### 5.2 管理员权限

* 添加 admin 插件

* 创建管理员角色表

* Admin 页面访问控制

## 影响范围

### 受影响的文件

* `src/server/lib/db/schema.ts` - 数据库 schema

* `src/app/[locale]/playground/**` - 现有 playground (将重构)

* `src/app/[locale]/admin/**` - 新增管理后台

* `src/lib/auth.ts` - Better Auth 配置

* `src/app/api/auth/**` - Auth API 路由

### 受影响的规范

* 挑战资源系统 (完全重构)

* 用户认证系统 (新增)

* 模板系统 (新增)

## 新增需求

### 需求: Sandbox 模板管理

系统应提供 Sandbox 模板的 CRUD 操作

#### 场景: 创建模板

* **当** 管理员访问 /admin/sandboxes/new

* **然后** 可以创建新的 sandbox 模板

* **然后** 包含名称、描述、类型、依赖、文件配置

#### 场景: 编辑模板

* **当** 管理员访问 /admin/sandboxes/\[id]

* **然后** 可以修改模板配置

#### 场景: 删除模板

* **当** 管理员删除模板

* **然后** 检查是否有挑战使用该模板

* **然后** 如果有挑战使用,阻止删除或级联删除

### 需求: 挑战管理

系统应提供挑战的 CRUD 操作

#### 场景: 基于模板创建挑战

* **当** 管理员选择 sandbox 模板

* **然后** 可以自定义初始代码

* **然后** 设置挑战标题、描述、难度

#### 场景: 发布挑战

* **当** 管理员设置 isPublished = true

* **然后** 挑战可以在前台显示

### 需求: 用户认证

系统应提供用户注册和登录功能

#### 场景: 用户注册

* **当** 用户使用邮箱/密码注册

* **然后** 创建用户账户

#### 场景: 用户登录

* **当** 用户登录

* **然后** 创建 session

#### 场景: 管理员登录

* **当** 管理员登录

* **然后** 可以访问 admin 页面

### 需求: Playground 实时预览

系统应提供编辑后实时预览功能

#### 场景: 编辑代码

* **当** 用户修改编辑器中的代码

* **然后** 预览在 300ms 内更新

## 实施计划

### 阶段 1: 数据库和认证

1. 设计新的数据库 schema
2. 集成 Better Auth
3. 创建用户和管理员表

### 阶段 2: Admin 管理后台

1. 创建 admin 布局
2. 实现 sandbox 模板管理
3. 实现挑战管理
4. 实现用户管理

### 阶段 3: Playground 重构

1. 实现 sandbox 加载逻辑
2. 实现多文件编辑器
3. 实现实时预览
4. 支持 Vue/React SFC

### 阶段 4: 测试和优化

1. 功能测试
2. 类型检查
3. 性能优化

