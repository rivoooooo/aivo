# 主题切换系统

> 位置：页脚 system.status 左下角
> 实现：只切换 CSS 变量，不改任何组件代码
> 主题数：5 套（默认绿 + 蓝 + 橙 + 红 + 紫）

---

## 一、主题定义

每套主题只覆盖颜色相关的 CSS 变量，字体/圆角/间距不变。

### Theme 0：PHOSPHOR（默认，现有绿色）

```css
[data-theme="phosphor"] .dark,
.dark {
  --primary:              #33ff00;
  --primary-foreground:   #0a0a0a;
  --secondary:            #ffb000;
  --secondary-foreground: #0a0a0a;
  --background:           #0a0a0a;
  --foreground:           #33ff00;
  --card:                 #0f0f0f;
  --border:               #1f521f;
  --muted:                #1a3d1a;
  --muted-foreground:     #66ff66;
  --success:              #33ff00;
  --warning:              #ffb000;
  --destructive:          #ff3333;
  --glow-color:           rgba(51, 255, 0, 0.5);
  --glow-strength:        0 0 5px var(--glow-color);
  --theme-name:           "PHOSPHOR";
  --theme-dot:            #33ff00;
}

[data-theme="phosphor"] :root,
:root {
  --primary:              #2d8a2d;
  --primary-foreground:   #ffffff;
  --secondary:            #cc8800;
  --secondary-foreground: #0a0a0a;
  --background:           #f5f5f0;
  --foreground:           #1a3d1a;
  --card:                 #ffffff;
  --border:               #c4d4c4;
  --muted:                #e8e8e0;
  --muted-foreground:     #5a7a5a;
  --success:              #2d8a2d;
  --warning:              #cc8800;
  --destructive:          #cc3333;
  --glow-color:           rgba(45, 138, 45, 0.3);
  --glow-strength:        0 0 3px var(--glow-color);
  --theme-name:           "PHOSPHOR";
  --theme-dot:            #2d8a2d;
}
```

---

### Theme 1：WINDOWS（蓝色，复古 Windows 风）

灵感：Windows 98/XP 的蓝色系，CRT 蓝光显示器。

```css
[data-theme="windows"] .dark {
  --primary:              #00aaff;
  --primary-foreground:   #000814;
  --secondary:            #ffcc00;
  --secondary-foreground: #000814;
  --background:           #000814;
  --foreground:           #00aaff;
  --card:                 #001428;
  --border:               #003366;
  --muted:                #001f3f;
  --muted-foreground:     #4dc3ff;
  --success:              #00ff88;
  --warning:              #ffcc00;
  --destructive:          #ff4444;
  --glow-color:           rgba(0, 170, 255, 0.5);
  --glow-strength:        0 0 6px var(--glow-color);
  --theme-name:           "WINDOWS";
  --theme-dot:            #00aaff;
}

[data-theme="windows"] :root {
  --primary:              #0066cc;
  --primary-foreground:   #ffffff;
  --secondary:            #cc8800;
  --secondary-foreground: #ffffff;
  --background:           #f0f4ff;
  --foreground:           #003380;
  --card:                 #ffffff;
  --border:               #99bbdd;
  --muted:                #dde8f5;
  --muted-foreground:     #4466aa;
  --success:              #006600;
  --warning:              #cc6600;
  --destructive:          #cc0000;
  --glow-color:           rgba(0, 102, 204, 0.2);
  --glow-strength:        0 0 3px var(--glow-color);
  --theme-name:           "WINDOWS";
  --theme-dot:            #0066cc;
}
```

---

### Theme 2：EMBER（橙色，复古琥珀显示器）

灵感：1980 年代的 Amber 磷光 CRT 终端。

```css
[data-theme="ember"] .dark {
  --primary:              #ff8800;
  --primary-foreground:   #0d0800;
  --secondary:            #ffcc44;
  --secondary-foreground: #0d0800;
  --background:           #0d0800;
  --foreground:           #ff8800;
  --card:                 #1a0f00;
  --border:               #4d2800;
  --muted:                #2b1800;
  --muted-foreground:     #ffaa44;
  --success:              #88cc00;
  --warning:              #ffcc44;
  --destructive:          #ff3333;
  --glow-color:           rgba(255, 136, 0, 0.5);
  --glow-strength:        0 0 6px var(--glow-color);
  --theme-name:           "EMBER";
  --theme-dot:            #ff8800;
}

[data-theme="ember"] :root {
  --primary:              #cc5500;
  --primary-foreground:   #ffffff;
  --secondary:            #886600;
  --secondary-foreground: #ffffff;
  --background:           #fdf6ee;
  --foreground:           #4d2200;
  --card:                 #ffffff;
  --border:               #e8c9a0;
  --muted:                #f5e8d5;
  --muted-foreground:     #885522;
  --success:              #446600;
  --warning:              #885500;
  --destructive:          #cc2200;
  --glow-color:           rgba(204, 85, 0, 0.2);
  --glow-strength:        0 0 3px var(--glow-color);
  --theme-name:           "EMBER";
  --theme-dot:            #cc5500;
}
```

---

### Theme 3：ALARM（红色，紧急系统警报）

灵感：核电站控制台，紧急状态显示屏。

```css
[data-theme="alarm"] .dark {
  --primary:              #ff2244;
  --primary-foreground:   #0d0005;
  --secondary:            #ff8800;
  --secondary-foreground: #0d0005;
  --background:           #0d0005;
  --foreground:           #ff2244;
  --card:                 #1a0008;
  --border:               #4d0015;
  --muted:                #2b000c;
  --muted-foreground:     #ff6688;
  --success:              #00ff88;
  --warning:              #ff8800;
  --destructive:          #ff0000;
  --glow-color:           rgba(255, 34, 68, 0.5);
  --glow-strength:        0 0 6px var(--glow-color);
  --theme-name:           "ALARM";
  --theme-dot:            #ff2244;
}

[data-theme="alarm"] :root {
  --primary:              #cc0022;
  --primary-foreground:   #ffffff;
  --secondary:            #cc5500;
  --secondary-foreground: #ffffff;
  --background:           #fff5f7;
  --foreground:           #4d0011;
  --card:                 #ffffff;
  --border:               #f5b8c4;
  --muted:                #fde8ec;
  --muted-foreground:     #993344;
  --success:              #006644;
  --warning:              #aa4400;
  --destructive:          #cc0000;
  --glow-color:           rgba(204, 0, 34, 0.2);
  --glow-strength:        0 0 3px var(--glow-color);
  --theme-name:           "ALARM";
  --theme-dot:            #cc0022;
}
```

---

### Theme 4：VOID（紫色，赛博朋克暗夜）

灵感：深空、合成波、赛博朋克霓虹紫。

```css
[data-theme="void"] .dark {
  --primary:              #cc44ff;
  --primary-foreground:   #08000d;
  --secondary:            #ff44aa;
  --secondary-foreground: #08000d;
  --background:           #08000d;
  --foreground:           #cc44ff;
  --card:                 #10001a;
  --border:               #3d0066;
  --muted:                #1f0033;
  --muted-foreground:     #dd88ff;
  --success:              #44ffaa;
  --warning:              #ffaa00;
  --destructive:          #ff3366;
  --glow-color:           rgba(204, 68, 255, 0.5);
  --glow-strength:        0 0 8px var(--glow-color);
  --theme-name:           "VOID";
  --theme-dot:            #cc44ff;
}

[data-theme="void"] :root {
  --primary:              #8800cc;
  --primary-foreground:   #ffffff;
  --secondary:            #cc0077;
  --secondary-foreground: #ffffff;
  --background:           #faf5ff;
  --foreground:           #2d0044;
  --card:                 #ffffff;
  --border:               #ddb8f5;
  --muted:                #f0e0ff;
  --muted-foreground:     #7733aa;
  --success:              #006644;
  --warning:              #885500;
  --destructive:          #cc0033;
  --glow-color:           rgba(136, 0, 204, 0.2);
  --glow-strength:        0 0 3px var(--glow-color);
  --theme-name:           "VOID";
  --theme-dot:            #8800cc;
}
```

---

## 二、ThemeSwitcher 组件

### 位置

页脚左下角，`> system.status` 信息块的下方：

```
> system.status
version:     v0.1.0
modules:     6
challenges:  180
status:      [OK] operational

──────────────────────────
> theme.config           ← 点击展开主题选择器
  ● PHOSPHOR             ← 当前主题名
```

### 触发器样式

```
> theme.config
  ● {当前主题名}
```

```
"> theme.config": primary，font-size: 12px，font-weight: 700
"  ● {NAME}":     当前主题的 --theme-dot 颜色，font-size: 11px
整行: cursor: pointer，hover: muted-foreground
```

### 弹出面板

点击触发器后，在触发器上方弹出（`bottom: 100%`，向上展开）：

```
┌─── THEME.CONFIG ──────────────────────────────────┐
│                                                   │
│  Select color scheme:                             │
│                                                   │
│  ● PHOSPHOR    // default green CRT               │
│  ● WINDOWS     // retro blue monitor              │
│  ● EMBER       // amber terminal 1980s            │
│  ● ALARM       // emergency system red            │
│  ● VOID        // cyberpunk neon purple           │
│                                                   │
│  [ CLOSE ]                                        │
│                                                   │
└───────────────────────────────────────────────────┘
```

### 面板样式

```
position: absolute
bottom: calc(100% + 8px)
left: 0
width: 280px
z-index: 200

border: 1px solid var(--border)
background: var(--card)
font-family: JetBrains Mono，monospace

标题栏:
  "+─── THEME.CONFIG ───+" 格式
  background: var(--primary)
  color: var(--primary-foreground)
  padding: 5px 12px，font-size: 10px，font-weight: 700

内容区:
  padding: 16px

"Select color scheme:": muted-foreground，font-size: 10px，margin-bottom: 12px

主题选项行:
  display: flex，align-items: center，gap: 10px
  padding: 6px 8px
  cursor: pointer
  font-size: 12px

  "●": 对应主题的硬编码颜色（不用 CSS 变量，保证在任何主题下都显示正确颜色）
       width: 8px，height: 8px，display: inline-block

  主题名: foreground，font-weight: 700
  注释: muted-foreground，italic，font-size: 10px

  当前激活的主题:
    background: color-mix(in srgb, var(--primary) 10%, transparent)
    "●" 有 animate-blink 效果

  hover:
    background: var(--muted)
    主题名变 primary

[ CLOSE ] 按钮:
  margin-top: 12px，border-top: 1px dashed var(--border)，padding-top: 10px
  outline 样式，font-size: 10px，width: 100%
```

### 弹出动效

```
进入: opacity 0 → 1，translateY 8px → 0，duration: 150ms，ease-out
退出: opacity 1 → 0，translateY 0 → 8px，duration: 100ms，ease-in
```

点击面板外区域关闭（`useClickOutside` hook）。

---

## 三、主题切换逻辑

### 实现方式

只在 `<html>` 元素上切换 `data-theme` 属性，CSS 变量由选择器自动接管：

```typescript
// lib/theme.ts

export type ThemeId = 'phosphor' | 'windows' | 'ember' | 'alarm' | 'void'

export const THEMES: {
  id: ThemeId
  name: string
  comment: string
  dot: { dark: string; light: string }
}[] = [
  { id: 'phosphor', name: 'PHOSPHOR', comment: 'default green CRT',      dot: { dark: '#33ff00', light: '#2d8a2d' } },
  { id: 'windows',  name: 'WINDOWS',  comment: 'retro blue monitor',     dot: { dark: '#00aaff', light: '#0066cc' } },
  { id: 'ember',    name: 'EMBER',    comment: 'amber terminal 1980s',   dot: { dark: '#ff8800', light: '#cc5500' } },
  { id: 'alarm',    name: 'ALARM',    comment: 'emergency system red',   dot: { dark: '#ff2244', light: '#cc0022' } },
  { id: 'void',     name: 'VOID',     comment: 'cyberpunk neon purple',  dot: { dark: '#cc44ff', light: '#8800cc' } },
]

export function applyTheme(themeId: ThemeId) {
  document.documentElement.setAttribute('data-theme', themeId)
  localStorage.setItem('color-theme', themeId)
}

export function getStoredTheme(): ThemeId {
  return (localStorage.getItem('color-theme') as ThemeId) ?? 'phosphor'
}
```

### 防闪烁脚本（在 layout.tsx 的 head 中）

```html
<script dangerouslySetInnerHTML={{ __html: `
  (function() {
    // 暗色/亮色
    var dark = localStorage.getItem('theme');
    if (dark === 'dark' || (!dark && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
    // 颜色主题
    var color = localStorage.getItem('color-theme');
    if (color) {
      document.documentElement.setAttribute('data-theme', color);
    }
  })();
` }} />
```

### ThemeSwitcher 组件

```tsx
// components/ui/ThemeSwitcher.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { THEMES, applyTheme, getStoredTheme, type ThemeId } from '@/lib/theme'
import { useTheme } from '@/hooks/useTheme'  // 已有的暗色主题 hook

export function ThemeSwitcher() {
  const [open, setOpen]           = useState(false)
  const [current, setCurrent]     = useState<ThemeId>('phosphor')
  const { theme: darkMode }       = useTheme()
  const ref                       = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrent(getStoredTheme())
  }, [])

  // 点击外部关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (id: ThemeId) => {
    applyTheme(id)
    setCurrent(id)
    setOpen(false)
  }

  const currentTheme = THEMES.find(t => t.id === current)!
  const dotColor = darkMode === 'dark'
    ? currentTheme.dot.dark
    : currentTheme.dot.light

  return (
    <div ref={ref} style={{ position: 'relative', marginTop: '12px' }}>

      {/* 触发器 */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          background:  'transparent',
          border:      'none',
          cursor:      'pointer',
          padding:     0,
          textAlign:   'left',
          fontFamily:  'JetBrains Mono, monospace',
        }}
      >
        <div style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 700 }}>
          {'> theme.config'}
        </div>
        <div style={{ fontSize: 11, marginTop: 2, color: 'var(--muted-foreground)' }}>
          {'  '}
          <span style={{ color: dotColor }}>●</span>
          {' '}
          {currentTheme.name}
        </div>
      </button>

      {/* 弹出面板 */}
      {open && (
        <div
          style={{
            position:   'absolute',
            bottom:     'calc(100% + 8px)',
            left:       0,
            width:      280,
            zIndex:     200,
            border:     '1px solid var(--border)',
            background: 'var(--card)',
            fontFamily: 'JetBrains Mono, monospace',
            animation:  'themePopIn 150ms ease-out',
          }}
        >
          {/* 标题栏 */}
          <div style={{
            background:  'var(--primary)',
            color:       'var(--primary-foreground)',
            padding:     '5px 12px',
            fontSize:    10,
            fontWeight:  700,
          }}>
            +─── THEME.CONFIG ───+
          </div>

          {/* 选项列表 */}
          <div style={{ padding: '12px 16px' }}>
            <div style={{ color: 'var(--muted-foreground)', fontSize: 10, marginBottom: 10 }}>
              Select color scheme:
            </div>

            {THEMES.map(theme => {
              const isActive  = theme.id === current
              const dot       = darkMode === 'dark' ? theme.dot.dark : theme.dot.light

              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelect(theme.id)}
                  style={{
                    display:     'flex',
                    alignItems:  'center',
                    gap:         10,
                    width:       '100%',
                    padding:     '6px 8px',
                    cursor:      'pointer',
                    background:  isActive
                      ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                      : 'transparent',
                    border:      'none',
                    textAlign:   'left',
                    fontFamily:  'JetBrains Mono, monospace',
                  }}
                >
                  {/* 颜色点：硬编码颜色，不受当前主题影响 */}
                  <span style={{
                    display:    'inline-block',
                    width:      8,
                    height:     8,
                    background: dot,
                    flexShrink: 0,
                    // 当前激活：闪烁
                    animation:  isActive ? 'blink 1s step-end infinite' : 'none',
                  }} />

                  <span style={{
                    color:      'var(--foreground)',
                    fontSize:   12,
                    fontWeight: 700,
                    flex:       1,
                  }}>
                    {theme.name}
                  </span>

                  <span style={{
                    color:      'var(--muted-foreground)',
                    fontSize:   10,
                    fontStyle:  'italic',
                  }}>
                    {'// ' + theme.comment}
                  </span>
                </button>
              )
            })}

            {/* 关闭按钮 */}
            <button
              onClick={() => setOpen(false)}
              style={{
                width:       '100%',
                marginTop:   10,
                paddingTop:  10,
                borderTop:   '1px dashed var(--border)',
                background:  'transparent',
                border:      'none',
                borderTop:   '1px dashed var(--border)',
                color:       'var(--muted-foreground)',
                fontSize:    10,
                cursor:      'pointer',
                fontFamily:  'JetBrains Mono, monospace',
                textAlign:   'center',
              }}
            >
              [ CLOSE ]
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

### 动效（在 globals.css 追加）

```css
@keyframes themePopIn {
  from {
    opacity:   0;
    transform: translateY(8px);
  }
  to {
    opacity:   1;
    transform: translateY(0);
  }
}
```

---

## 四、CSS 变量整合到 globals.css

把五套主题的 CSS 变量全部追加到 `globals.css` 末尾。

**变量覆盖顺序说明：**

```
:root                          → 浅色默认（phosphor）
.dark                          → 深色默认（phosphor）
[data-theme="windows"] :root   → 浅色 windows
[data-theme="windows"] .dark   → 深色 windows
...（其余主题同理）
```

`data-theme` 选择器优先级高于 `:root` / `.dark`，
所以切换 `data-theme` 后对应主题变量自动覆盖。

---

## 五、页脚集成

在 `Footer.tsx` 的 system.status 区块末尾加入 `<ThemeSwitcher />`：

```tsx
// Footer.tsx 的 system.status 列

<div>
  <div className="text-primary font-bold text-sm">{`> system.status`}</div>
  <div className="mt-2 space-y-1 text-xs font-mono text-muted-foreground">
    <div>version:     <span className="text-foreground">v0.1.0</span></div>
    <div>modules:     <span className="text-foreground">6</span></div>
    <div>challenges:  <span className="text-foreground">180</span></div>
    <div>status:      <span className="text-success">[OK]</span> operational</div>
  </div>

  {/* 主题切换器 */}
  <ThemeSwitcher />
</div>
```

---

## 六、验收标准

### 主题变量
```
□ 5 套主题 CSS 变量全部写入 globals.css
□ 每套主题有深色 + 浅色两组变量
□ data-theme 选择器优先级高于默认变量
□ 切换主题后页面所有颜色（primary/border/card/background等）同步变化
```

### ThemeSwitcher 组件
```
□ 触发器显示 "> theme.config" + 当前主题名
□ 颜色点使用当前主题色
□ 点击触发器，面板向上弹出
□ 面板列出 5 个主题选项
□ 每个选项的颜色点使用该主题的硬编码颜色（不受当前主题影响）
□ 当前激活主题的颜色点 animate-blink
□ hover 选项背景变 muted
□ 点击选项后主题立刻切换，面板关闭
□ 点击面板外区域关闭
□ [ CLOSE ] 按钮正常关闭
□ 弹出/关闭有动效（150ms fadeIn + translateY）
```

### 持久化
```
□ 刷新页面后主题保持（localStorage）
□ 防闪烁脚本在 hydration 前执行
□ 切换暗色/亮色模式时，颜色主题保持不变
□ 暗色 + 非默认主题组合正确（如 dark + windows = 深蓝）
```

### 视觉
```
□ phosphor：绿色磷光 CRT
□ windows：蓝色，复古 Windows 感
□ ember：橙色，琥珀终端感
□ alarm：红色，紧急警报感
□ void：紫色，赛博朋克感
□ 每套主题两套亮色/暗色均视觉协调
□ 主题切换不影响 Header / Footer 布局
```