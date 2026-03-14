# 主题系统完善 Spec

## Why
当前主题切换系统虽然可以切换颜色主题，但配色方案不够系统化。需要建立一个基于色相变化的完整配色体系，确保切换主题时所有颜色（文字、边框、装饰等）都跟随变化，不会出现主题颜色与文字颜色不匹配的情况。

## What Changes
- 基于 PHOSPHOR 主题建立完整的 CSS 变量体系
- 其他主题（WINDOWS/EMBER/ALARM/VOID）根据 PHOSPHOR 的色相变化规律生成对应配色
- 每套主题包含完整的深色/浅色模式配色
- 所有颜色变量都跟随主题切换而变化

## Impact
- 影响文件: `src/app/globals.css`
- 影响范围: 整个应用的配色系统
- 用户体验: 主题切换更加一致和协调

## ADDED Requirements

### Requirement: 完整的主题配色系统
The system SHALL provide a complete color system where all visual elements change color consistently when switching themes.

#### Scenario: PHOSPHOR 主题（绿色系）
- **GIVEN** 用户使用 PHOSPHOR 主题
- **WHEN** 查看页面任何元素
- **THEN** 所有颜色都基于绿色色相
  - Primary: #33ff00 (dark) / #2d8a2d (light)
  - Foreground: #33ff00 (dark) / #1a3d1a (light)
  - Border: #1f521f (dark) / #c4d4c4 (light)
  - Muted: #1a3d1a (dark) / #e8e8e0 (light)

#### Scenario: WINDOWS 主题（蓝色系）
- **GIVEN** 用户切换到 WINDOWS 主题
- **WHEN** 查看页面任何元素
- **THEN** 所有颜色都基于蓝色色相
  - Primary: #00aaff (dark) / #0066cc (light)
  - Foreground: #00aaff (dark) / #003380 (light)
  - Border: #003366 (dark) / #99bbdd (light)
  - Muted: #001f3f (dark) / #dde8f5 (light)

#### Scenario: EMBER 主题（橙色系）
- **GIVEN** 用户切换到 EMBER 主题
- **WHEN** 查看页面任何元素
- **THEN** 所有颜色都基于橙色色相
  - Primary: #ff8800 (dark) / #cc5500 (light)
  - Foreground: #ff8800 (dark) / #4d2200 (light)
  - Border: #4d2800 (dark) / #e8c9a0 (light)
  - Muted: #2b1800 (dark) / #f5e8d5 (light)

#### Scenario: ALARM 主题（红色系）
- **GIVEN** 用户切换到 ALARM 主题
- **WHEN** 查看页面任何元素
- **THEN** 所有颜色都基于红色色相
  - Primary: #ff2244 (dark) / #cc0022 (light)
  - Foreground: #ff2244 (dark) / #4d0011 (light)
  - Border: #4d0015 (dark) / #f5b8c4 (light)
  - Muted: #2b000c (dark) / #fde8ec (light)

#### Scenario: VOID 主题（紫色系）
- **GIVEN** 用户切换到 VOID 主题
- **WHEN** 查看页面任何元素
- **THEN** 所有颜色都基于紫色色相
  - Primary: #cc44ff (dark) / #8800cc (light)
  - Foreground: #cc44ff (dark) / #2d0044 (light)
  - Border: #3d0066 (dark) / #ddb8f5 (light)
  - Muted: #1f0033 (dark) / #f0e0ff (light)

## MODIFIED Requirements

### Requirement: CSS 变量结构
每套主题的 CSS 变量 SHALL 包含以下完整集合：

#### Core Colors
- `--primary`: 主色
- `--primary-foreground`: 主色上的文字
- `--primary-rgb`: RGB 值用于透明度
- `--secondary`: 次要色
- `--secondary-foreground`: 次要色上的文字
- `--accent`: 强调色
- `--accent-foreground`: 强调色上的文字
- `--destructive`: 危险色
- `--destructive-foreground`: 危险色上的文字

#### Semantic Colors
- `--success`: 成功状态
- `--warning`: 警告状态
- `--error`: 错误状态
- `--info`: 信息状态

#### Background & Text
- `--background`: 页面背景
- `--foreground`: 主要文字
- `--card`: 卡片背景
- `--card-foreground`: 卡片文字
- `--popover`: 弹出层背景
- `--popover-foreground`: 弹出层文字

#### UI Elements
- `--border`: 边框
- `--input`: 输入框边框
- `--ring`: 焦点环
- `--muted`: 静音/禁用背景
- `--muted-foreground`: 次要文字

#### Effects
- `--glow`: 发光效果

#### Sidebar
- `--sidebar`: 侧边栏背景
- `--sidebar-foreground`: 侧边栏文字
- `--sidebar-primary`: 侧边栏主色
- `--sidebar-primary-foreground`: 侧边栏主色文字
- `--sidebar-accent`: 侧边栏强调
- `--sidebar-accent-foreground`: 侧边栏强调文字
- `--sidebar-border`: 侧边栏边框
- `--sidebar-ring`: 侧边栏焦点环

#### Chart Colors
- `--chart-1` 到 `--chart-5`: 图表颜色

#### Theme Info
- `--theme-name`: 主题名称
- `--theme-dot`: 主题指示点颜色

## REMOVED Requirements
无
