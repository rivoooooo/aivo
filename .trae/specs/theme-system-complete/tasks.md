# Tasks

- [x] Task 1: 完善 PHOSPHOR 主题配色方案
  - [x] SubTask 1.1: 定义 PHOSPHOR 深色模式完整配色
  - [x] SubTask 1.2: 定义 PHOSPHOR 浅色模式完整配色
  - [x] SubTask 1.3: 确保所有 30+ 个 CSS 变量都有定义

- [x] Task 2: 基于 PHOSPHOR 生成 WINDOWS 主题配色
  - [x] SubTask 2.1: 分析 PHOSPHOR 到 WINDOWS 的色相变化规律（绿→蓝，色相+120°）
  - [x] SubTask 2.2: 生成 WINDOWS 深色模式完整配色
  - [x] SubTask 2.3: 生成 WINDOWS 浅色模式完整配色

- [x] Task 3: 基于 PHOSPHOR 生成 EMBER 主题配色
  - [x] SubTask 3.1: 分析 PHOSPHOR 到 EMBER 的色相变化规律（绿→橙，色相+30°）
  - [x] SubTask 3.2: 生成 EMBER 深色模式完整配色
  - [x] SubTask 3.3: 生成 EMBER 浅色模式完整配色

- [x] Task 4: 基于 PHOSPHOR 生成 ALARM 主题配色
  - [x] SubTask 4.1: 分析 PHOSPHOR 到 ALARM 的色相变化规律（绿→红，色相-60°）
  - [x] SubTask 4.2: 生成 ALARM 深色模式完整配色
  - [x] SubTask 4.3: 生成 ALARM 浅色模式完整配色

- [x] Task 5: 基于 PHOSPHOR 生成 VOID 主题配色
  - [x] SubTask 5.1: 分析 PHOSPHOR 到 VOID 的色相变化规律（绿→紫，色相+180°）
  - [x] SubTask 5.2: 生成 VOID 深色模式完整配色
  - [x] SubTask 5.3: 生成 VOID 浅色模式完整配色

- [x] Task 6: 更新 globals.css 文件
  - [x] SubTask 6.1: 替换现有主题 CSS 变量定义
  - [x] SubTask 6.2: 验证 CSS 语法正确性
  - [x] SubTask 6.3: 运行 TypeScript 类型检查

- [x] Task 7: 修复非主题色残留
  - [x] SubTask 7.1: 修复 EMBER 浅色模式 success 颜色（绿色→黄绿色）
  - [x] SubTask 7.2: 修复 ALARM 浅色模式 success 颜色（绿色→青绿色）
  - [x] SubTask 7.3: 修复 VOID 浅色模式 success 颜色（绿色→青绿色）

# Task Dependencies
- Task 2-5 都依赖于 Task 1（PHOSPHOR 作为基准）
- Task 6 依赖于 Task 1-5
- Task 7 是修复任务，在所有主题生成后执行
