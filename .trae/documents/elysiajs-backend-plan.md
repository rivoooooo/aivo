# ElysiaJS 作为 Next.js 后端的实施计划

## 搜索结果总结

* 在 skills.sh 上搜索 "elysia" 未找到专门的 elysiajs skill

* 需要直接安装和使用 elysiajs 框架

## 实施步骤

### 1. 创建后端目录结构

* 在项目根目录创建 `server/` 文件夹

* 用于存放 ElysiaJS 后端代码

### 2. 初始化 ElysiaJS 项目

* 在 `server/` 目录初始化 bun 项目

* 安装 elysia 依赖

### 3. 创建 ElysiaJS 后端服务

* 创建主入口文件 `server/src/index.ts`

* 配置 API 路由

* 默认情况下使用集成方案让他们在同一个端口去运行

* 另一种只部署服务的方案就是有一个新的 ts文件,单独只运行 后端不运行nextjs(不过这个先不考虑,可以去搜索一下是否可以实现)

  <br />

