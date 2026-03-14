# About 页面 — 重设计文档

> 参考：voidzero.dev/about 的内容结构和叙事节奏
> 风格：Terminal CLI 设计系统 + 开发者式幽默 + 克制密度感

---

## 设计参考分析

VoidZero About 页做对的三件事：
1. **大标语直接说人** — "We are a team of Javascript tooling experts"，不说产品说人
2. **使命宣言有背景故事** — 先说问题（JS 在 10 天内设计完），再说解法
3. **团队成员用代码注释展示身份** — `// Creator of Vue.js` 比 Title 更有说服力

AI-Era About 的翻译：
1. **大标语说使命** — "We are building the training ground developers actually need"
2. **使命宣言** — 先说 AI 时代的困境，再说 AI-Era 的答案
3. **创始人 + 团队** — 用终端 `.config` 格式，身份用代码注释

---

## 页面结构

```
1. HERO           大标语 + 一句话定位
2. MISSION        使命宣言（两段式：问题 → 答案）
3. FOUNDER        创始人签名区
4. TEAM           团队成员网格
5. OPEN_ROLES     招募（参考 VoidZero 的"open to exploring"）
6. STACK          技术栈（package.json 风格）
7. CONTACT        联系方式 + Newsletter
```

---

## 一、HERO

### 布局

全宽，`min-height: 50vh`，垂直居中。

### 内容

```
> cat ABOUT.md
──────────────────────────────────────────────────────────────────

We are building the training ground
developers actually need.

──────────────────────────────────────────────────────────────────

  Not another tutorial site.
  Not another bootcamp.
  A platform built by developers who got tired of the alternatives.
```

### 视觉

- 主标题两行，`font-size: clamp(28px, 5vw, 48px)`，`font-weight: 700`，`primary` 颜色
- 副标题三行，`font-size: 14px`，`muted-foreground`，`line-height: 2`
- 上下两条字符分隔线 `─` × 200，`overflow: hidden`
- 左对齐，不居中（更像终端输出）

### 动效

页面加载时主标题逐词淡入（`stagger: 80ms per word`），
副标题在主标题完成后 `400ms` 整体淡入。

---

## 二、MISSION

### 布局

参考 VoidZero：左侧窄列（标签 + 装饰），右侧宽列（正文）。

```
┌──────────────────┬─────────────────────────────────────────────┐
│                  │                                             │
│  ##              │  The way developers learn hasn't kept up   │
│  MISSION         │  with the way they work.                   │
│                  │                                             │
│  [ACTIVE]        │  AI tools didn't arrive with a manual.     │
│                  │  Neither did the new expectations placed    │
│  line: 001       │  on every developer who picks them up.     │
│                  │                                             │
│                  │  ──────────────────────────────────────    │
│                  │                                             │
│                  │  AI-Era was built to close that gap.       │
│                  │                                             │
│                  │  Real challenges. Real bugs. Real AI        │
│                  │  collaboration patterns. The kind of       │
│                  │  practice that actually prepares you       │
│                  │  for what's in the codebase on Monday.     │
│                  │                                             │
└──────────────────┴─────────────────────────────────────────────┘
```

### 左侧

```
## MISSION        → primary，11px，font-weight: 700
[ACTIVE]          → success，dashed border，10px，padding: 2px 6px
line: 001         → muted-foreground，10px
左侧宽度:          180px
border-right:     1px dashed var(--border)
padding-right:    32px
position: sticky  top: 120px（随正文滚动固定，桌面端）
```

### 右侧正文

- 段落间有字符分隔线 `──────────`
- 第一段（问题）：`foreground`，`15px`，`line-height: 1.9`
- 分隔线后第二段（答案）：`foreground`，字体稍大 `16px`
- 关键词加粗：`font-weight: 700`，颜色 `primary`

---

## 三、FOUNDER

### 布局

参考 VoidZero 的 Evan You 签名区：创始人大头照 + 签名 + 一句话 + 代码注释身份。

```
──────────────────────────────────────────────────────────────────

  ┌─────────────────────────────────────────────────────────────┐
  │                                                             │
  │   [头像]     YourName                                       │
  │              Founder & Developer                            │
  │                                                             │
  │              // Built this because I couldn't find         │
  │              // the platform I actually wanted to use.     │
  │                                                             │
  │              @yourhandle                                    │
  │                                                             │
  └─────────────────────────────────────────────────────────────┘

──────────────────────────────────────────────────────────────────
```

### 头像

```
尺寸: 64px × 64px
形状: 正方形（无圆角，设计系统规定）
边框: 2px solid var(--primary)
来源: GitHub 头像 URL（https://github.com/{handle}.png）
```

### 代码注释

```
// Built this because I couldn't find
// the platform I actually wanted to use.
```

颜色：`muted-foreground`，`italic`，`font-size: 13px`

### @handle

```
颜色: secondary（amber）
font-size: 12px
可点击: 跳转 GitHub profile
hover: 下划线
```

---

## 四、TEAM

### Section 标题

```
> cat TEAM.config

// Including contributors to open source projects
// and developers who care about how we learn.
```

### 成员卡片网格

```
桌面端: 4 列
平板:   3 列
移动端: 2 列
gap:    24px
```

每张成员卡片：

```
┌────────────────────────────┐
│                            │
│   [头像 48×48]             │
│                            │
│   Name                     │
│   Role                     │
│                            │
│   // code comment          │  ← 如果有的话
│                            │
│   @handle                  │
│                            │
└────────────────────────────┘
```

**卡片样式：**

```
border:     1px solid var(--border)
background: var(--card)
padding:    16px
```

**hover 效果：**

```
border-color: var(--primary)
translateY: -2px
transition: 120ms
```

**字段样式：**

| 字段 | 颜色 | 字号 |
|------|------|------|
| 名字 | `foreground`，`font-weight: 700` | 13px |
| Role | `muted-foreground` | 11px |
| `// comment` | `muted-foreground`，italic | 11px |
| `@handle` | `secondary`（amber） | 11px，可点击 |

**没有头像时的 fallback：**

```
显示名字首字母，背景 var(--muted)，颜色 var(--primary)
```

### 成员数据结构

在组件中以数组形式硬编码（不需要数据库）：

```typescript
const team = [
  {
    name:    'YourName',
    role:    'Founder & Developer',
    handle:  'yourhandle',
    comment: ['Built this because I needed it.'],
  },
  // 未来添加更多成员
]
```

---

## 五、OPEN_ROLES（招募）

参考 VoidZero 的克制写法：不是招聘广告，是一句话邀请。

### 内容

```
┌─── OPEN ROLES ───────────────────────────────────────────────┐
│                                                              │
│  We don't have formal openings right now.                   │
│  But we're always interested in people who care             │
│  about how developers learn.                                 │
│                                                              │
│  If that's you:                                              │
│                                                              │
│  needs = [ frontend, backend, content, devrel ]             │
│                                                              │
│  → open an issue on GitHub and say hello.                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 样式

```
整体: border: 1px dashed var(--border)，padding: 32px
正文: foreground，14px，line-height: 1.9
needs = [...]: primary 颜色（像代码）
"→ open an issue": secondary（amber），可点击，跳转 GitHub issues
```

---

## 六、STACK（技术栈）

### 内容：package.json 格式

```json
{
  "name": "ai-era",
  "version": "0.1.0",
  "description": "A training ground for developers in the AI era",

  "dependencies": {
    "next":           "15.x",    // The framework
    "react":          "19.x",    // The UI layer
    "typescript":     "5.x",     // Because we're not animals
    "drizzle-orm":    "latest",  // Type-safe queries
    "better-auth":    "latest",  // Auth without the pain
    "tailwindcss":    "4.x",     // Utility-first CSS
    "@xyflow/react":  "latest",  // The skill map
    "@google/genai":  "latest"   // The AI part of AI-Era
  },

  "devDependencies": {
    "bun":            "latest",  // Fast. Very fast.
    "postgresql":     "15.x",    // The database
    "docker":         "*"        // Ships anywhere
  },

  "scripts": {
    "dev":     "bun run dev",
    "build":   "bun run build",
    "learn":   "open https://ai-era.dev/challenges",
    "improve": "open https://github.com/your-org/ai-era/issues"
  }
}
```

### 语法高亮规则（纯 CSS + span，不用第三方库）

| 内容 | 颜色 |
|------|------|
| `{ }` 括号 | `muted-foreground` |
| key（带引号） | `primary` |
| string value | `secondary`（amber） |
| `// comment` | `muted-foreground`，`font-style: italic` |

实现：`JsonHighlight` 组件，正则逐行处理，返回带颜色 `<span>` 的 JSX。
整体放 `<pre>` 标签，`bg-card`，`border: 1px solid var(--border)`，`padding: 24px`，横向可滚动。

---

## 七、CONTACT + NEWSLETTER

### 布局

左右两栏，`gap: 48px`：

```
┌────────────────────────────┬────────────────────────────────┐
│  左：联系方式               │  右：Newsletter                │
└────────────────────────────┴────────────────────────────────┘
```

### 左：联系方式（shell 脚本风格）

```bash
#!/bin/bash

# GitHub (bugs, features, discussions)
open https://github.com/your-org/ai-era

# Twitter / X
open https://twitter.com/ai_era_dev

# Email (serious inquiries)
echo "hello@ai-era.dev"

echo "[OK] we read everything."
```

- `#!/bin/bash`：`muted-foreground`，italic
- `# 注释`：`muted-foreground`
- `open` 命令行：整行可点击，hover 背景 `bg-primary/5`，颜色 `success`
- URL：`secondary`（amber），可点击
- `echo "[OK]"`：`primary`，`font-weight: 700`

### 右：Newsletter

参考 VoidZero 的极简 Newsletter 区：

```
> subscribe --monthly

Stay updated on new challenges,
platform updates, and developer resources.

[ your@email.com                    ] [ SUBSCRIBE ]
```

- 标题行：`primary`，`font-weight: 700`
- 描述：`muted-foreground`，`13px`
- 输入框：终端风格（下边框 only，`border-bottom: 1px solid var(--border)`，无背景）
- 输入框前无前缀（这里不加 `>`，保持简洁）
- `[ SUBSCRIBE ]`：`default` 按钮样式

---

## 八、页面级动效

### 滚动触发（每个 Section）

```
触发: IntersectionObserver，threshold: 0.15，once: true
动效: opacity 0 → 1，translateY 12px → 0，duration: 400ms，ease-out
```

### Section 标题命令行打字效果

每个 Section 进入视口时，顶部命令行（`> cat MISSION.md` 等）触发一次打字动效：
- `charDelay: 18ms`
- 完成后保持
- `prefers-reduced-motion`：跳过，直接显示

### 成员卡片入场

团队成员网格进入视口时，卡片以 `stagger: 40ms` 依次淡入。

### HERO 主标题

逐词淡入，`stagger: 80ms per word`，页面加载即触发。

---

## 九、SEO

```html
<title>About — AI-Era | Developer Training Platform</title>
<meta name="description"
  content="AI-Era is a training ground built by developers for developers
           navigating the AI era. Learn our mission, team, and tech stack." />
```

语义标签：
- `<h1>`：HERO 主标题（可用 `sr-only` 隐藏视觉，终端版用 `<p>` 替代视觉）
- `<h2>`：每个 Section 标题（`sr-only` 可）
- `<p>`：所有正文段落
- `<a>`：所有外部链接，`target="_blank" rel="noopener"`

---

## 十、组件结构

```
app/[locale]/about/
├── page.tsx                    （Server Component）
└── components/
    ├── HeroSection.tsx
    ├── MissionSection.tsx
    ├── FounderSection.tsx
    ├── TeamSection.tsx
    │   └── MemberCard.tsx
    ├── OpenRolesSection.tsx
    ├── StackSection.tsx
    │   └── JsonHighlight.tsx   （语法高亮，纯 CSS）
    └── ContactSection.tsx
```

---

## 十一、验收标准

### 内容
```
□ 7 个 Section 全部渲染，顺序正确
□ HERO 主标题两行，副标题三行
□ MISSION 左侧 sticky 标签，右侧正文分两段
□ FOUNDER 区展示头像、姓名、代码注释、@handle
□ TEAM 成员网格，hover 效果正确
□ TEAM 无头像时显示首字母 fallback
□ OPEN_ROLES 使用 dashed 边框容器
□ STACK package.json 语法高亮正确
□ CONTACT shell 脚本风格，链接行可点击
□ Newsletter 输入框终端风格
```

### 动效
```
□ HERO 主标题逐词淡入
□ 各 Section 滚动触发淡入
□ 各 Section 命令行标题有打字效果
□ 团队卡片 stagger 入场
□ prefers-reduced-motion：所有动效关闭
```

### 响应式
```
□ MISSION 两栏在移动端变单列（左侧标签在上）
□ 移动端左侧 sticky 取消
□ TEAM 在移动端 2 列
□ CONTACT 两栏在移动端单列
□ 375px 无横向溢出
□ STACK pre 横向可滚动
```

### 细节
```
□ 所有外部链接 target="_blank" rel="noopener"
□ @handle 点击跳转正确的 GitHub profile
□ 字符分隔线 overflow: hidden，不造成横向滚动
□ 两套主题（深色/浅色）均正确
□ 全站字体 JetBrains Mono，无圆角
```
