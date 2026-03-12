# Challenge 训练场路由实现计划

## 1. 概述

为项目添加一个新的 `/challenge/:id` 路由，用于动态渲染一个交互式训练场。该训练场包含一个代码编辑器（左）和实时预览（右），用户可以直接在浏览器中编写和运行代码。

## 2. 功能需求

### 2.1 动态数据加载

* 后端提供 JSON 配置，包含：

  * Challenge ID 和标题

  * 默认代码模板

  * 预置的依赖包（通过 esm.sh）

  * 验证逻辑（可选）

### 2.2 编辑器功能

* 左侧面板：代码编辑器

* 直接使用textare输入,轻量化,不支持代码高亮

* 实时保存到状态

### 2.3 实时预览

* 右侧面板：iframe 预览

* 使用 `srcdoc` 或 Blob URL 实现沙箱

* 自动更新（防抖处理）

* 支持通过 esm.sh 加载依赖

### 2.4 设计风格

* 继承项目的 Terminal CLI 设计系统

* 左右分栏布局

* 响应式支持

## 3. 技术实现

### 3.1 JSON 数据格式

```json
{
  "id": "html-basics",
  "title": "HTML 基础训练",
  "description": "学习 HTML 基础标签",
  "defaultCode": {
    "html": "<div>Hello World</div>",
    "css": "div { color: red; }",
    "js": "console.log('hello')"
  },
  "dependencies": ["react@18", "react-dom@18"],
  "modules": ["https://esm.sh/lodash@4"]
}
```

### 3.2 文件结构

```
src/app/[locale]/challenge/
├── [slug]/
│   ├── page.tsx           # 主页面（现有）
│   └── playground/
│       └── page.tsx       # 新增：训练场页面
```

### 3.3 核心组件

1. **CodeEditor** - 代码编辑器组件

   * 使用 textarea 或轻量级编辑器

   * 支持多标签页（HTML/CSS/JS）

2. **PreviewFrame** - 预览 iframe 组件

   * 接收代码输入

   * 生成完整的 HTML 文档

   * 注入 esm.sh 依赖

3. **PlaygroundPage** - 页面容器

   * 布局管理

   * 状态管理

   * 数据获取

### 3.4 沙箱实现

使用 `srcdoc` 属性创建隔离的预览环境：

```html
<!DOCTYPE html>
<html>
<head>
  <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@18",
        "react-dom": "https://esm.sh/react-dom@18"
      }
    }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    // 用户代码
  </script>
</body>
</html>
```

## 4. 实现步骤

### Step 1: 创建数据获取函数

* 位置：`src/app/[locale]/challenge/playground/utils.ts`

* 功能：根据 ID 获取 challenge 配置

### Step 2: 创建代码编辑器组件

* 位置：`src/app/[locale]/challenge/playground/components/CodeEditor.tsx`

* 功能：简单的编辑器，支持 HTML/CSS/JS 切换

### Step 3: 创建预览组件

* 位置：`src/app/[locale]/challenge/playground/components/PreviewFrame.tsx`

* 功能：生成沙箱 HTML 并渲染

### Step 4: 创建主页面

* 位置：`src/app/[locale]/challenge/playground/page.tsx`

* 功能：整合组件，添加布局和状态管理

### Step 5: 添加路由入口

* 修改现有 challenge 页面或添加导航

## 5. 注意事项

1. **安全性**：使用 iframe srcdoc 隔离用户代码
2. **性能**：添加防抖，避免频繁更新预览
3. **依赖**：使用 esm.sh 动态加载 npm 包
4. **样式**：继承现有 Terminal 设计系统
5. **国际化**：支持 locale 参数

## 6. 验收标准

* [ ] 路由 `/challenge/:id/playground` 可访问

* [ ] 编辑器可以编辑 HTML/CSS/JS 代码

* [ ] 右侧预览实时显示代码效果

* [ ] 支持通过 esm.sh 加载依赖

* [ ] 响应式布局适配移动端

* [ ] 继承 Terminal CLI 设计风格

