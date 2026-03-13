# Header Auth — 登录 / 注册 / 用户菜单

> 在 Header 导航栏最右侧新增认证区域。
> 本文档只描述 Header 中认证相关的 UI 和交互，不涉及认证后端实现。

---

## 位置

```
┌──────────────────────────────────────────────────────────────────┐
│  AI-Era_█    HOME  CHALLENGES  DOCS  ABOUT    [登录][注册]  ☀/☾  │
│                                              ↑ 新增区域           │
└──────────────────────────────────────────────────────────────────┘

登录后:
┌──────────────────────────────────────────────────────────────────┐
│  AI-Era_█    HOME  CHALLENGES  DOCS  ABOUT    [dev_kai ▾]   ☀/☾  │
└──────────────────────────────────────────────────────────────────┘
```

认证区域在导航链接右侧、主题切换按钮左侧，`gap: 12px`。

---

## 一、未登录状态

显示两个按钮：

| 按钮 | 样式 | 行为 |
|------|------|------|
| `[ Login ]` | outline（描边） | 打开登录 Modal |
| `[ Register ]` | default（实心） | 打开注册 Modal |

---

## 二、已登录状态 — 用户菜单触发器

登录后两个按钮替换为一个用户菜单触发器：

```
[ dev_kai ▾ ]
```

- `dev_kai` = 当前用户名（从 session / user 对象读取）
- `▾` = 下拉箭头，展开时旋转 180°（`transition: 200ms`）
- 样式：outline 按钮

点击触发器：展开 / 收起用户菜单下拉面板。

---

## 三、用户菜单下拉面板

### 位置

```
触发器下方，右对齐，距离触发器 8px
min-width: 200px
z-index: 高于其他内容
```

### 外观

终端窗口风格，带标题栏：

```
+─── USER ──────────────────+
│                           │
│  dev_kai                  │
│  dev@example.com          │
│                           │
│ ─────────────────────     │
│                           │
│  > Profile                │
│  > My Challenges          │
│  > Settings               │
│                           │
│ ─────────────────────     │
│                           │
│  > Logout                 │
│                           │
+───────────────────────────+
```

### 菜单项

| 文字 | 行为 |
|------|------|
| `> Profile` | 跳转 `/{locale}/profile` |
| `> My Challenges` | 跳转 `/{locale}/challenge` |
| `> Settings` | 跳转 `/{locale}/settings` |
| `> Logout` | 执行登出，颜色用 `destructive` |

### 交互细节

```
打开:  opacity 0 → 1，translateY -4px → 0，duration 150ms ease-out
关闭:  反向，duration 100ms
点击菜单项外区域: 关闭面板（点击遮罩或 onBlur）
键盘 Esc: 关闭面板
```

---

## 四、组件结构

```
components/
└── layout/
    └── Header.tsx
        └── AuthSection.tsx        ← 认证区域入口（判断登录状态）
            ├── GuestButtons.tsx   ← 未登录：Login + Register 按钮
            └── UserMenu.tsx       ← 已登录：触发器 + 下拉面板
```

---

## 五、AuthSection 核心逻辑

```tsx
// components/layout/AuthSection.tsx
'use client'

// 用 props 或 context 接收认证状态
// 初始渲染时避免 hydration mismatch：
//   - 服务端渲染时不渲染认证区域（或渲染骨架占位）
//   - 客户端 mount 后再根据 session 决定显示内容

interface AuthSectionProps {
  user?: {
    name: string
    email: string
  } | null
}

export function AuthSection({ user }: AuthSectionProps) {
  if (user) {
    return <UserMenu user={user} />
  }
  return <GuestButtons />
}
```

**Hydration 处理：**

```tsx
// 避免服务端和客户端渲染不一致导致的 hydration warning
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return <div className="w-[140px]" />  // 占位，防止布局跳动
```

---

## 六、Modal（登录 / 注册）

Login 和 Register 按钮点击后打开 Modal，不跳转页面。

### Modal 外观

终端窗口风格，居中显示，背景遮罩：

```
遮罩: bg-background/80 + backdrop-blur(4px)，覆盖全屏
面板: min-width 360px，max-width 440px，居中
关闭: 右上角 [ × ] 按钮，或点击遮罩，或 Esc 键
```

### 登录 Modal

```
+─── LOGIN ─────────────────────────+
│                                   │
│  username or email                │
│  > _                              │
│  ─────────────────────────────    │
│                                   │
│  password                         │
│  > _                              │
│  ─────────────────────────────    │
│                                   │
│  [ LOGIN ]                        │
│                                   │
│  no account? [ Register ]         │
│                                   │
+───────────────────────────────────+
```

### 注册 Modal

```
+─── REGISTER ──────────────────────+
│                                   │
│  username                         │
│  > _                              │
│  ─────────────────────────────    │
│                                   │
│  email                            │
│  > _                              │
│  ─────────────────────────────    │
│                                   │
│  password                         │
│  > _                              │
│  ─────────────────────────────    │
│                                   │
│  [ REGISTER ]                     │
│                                   │
│  have account? [ Login ]          │
│                                   │
+───────────────────────────────────+
```

### 两个 Modal 可互相切换

Login Modal 底部点击 `[ Register ]` → 切换为 Register Modal（不关闭再打开，直接切换内容）。

### 表单输入框样式

终端风格，与普通 input 区分：

```
标签:     muted-foreground，font-size: 12px，uppercase，margin-bottom: 4px
输入框:   bg-transparent，border-bottom: 1px solid border（只有下边框）
          前缀 "> " 固定显示（用 flex 行实现，不是 placeholder）
          focus 时 border-bottom-color → primary
          font: JetBrains Mono，font-size: 14px
```

### 错误状态

```
输入框下方显示: [ERR] {错误信息}
颜色: destructive
font-size: 12px
```

示例：
```
[ERR] invalid username or password
[ERR] username already taken
[ERR] password must be at least 8 characters
```

---

## 七、i18n Key 补充

在 `en.json` 和 `zh.json` 中新增以下 key：

```json
// en.json 新增
"auth": {
  "login": "Login",
  "register": "Register",
  "logout": "Logout",
  "profile": "Profile",
  "myChallenges": "My Challenges",
  "settings": "Settings",
  "modal": {
    "loginTitle": "LOGIN",
    "registerTitle": "REGISTER",
    "usernameOrEmail": "username or email",
    "username": "username",
    "email": "email",
    "password": "password",
    "noAccount": "no account?",
    "haveAccount": "have account?",
    "errors": {
      "invalidCredentials": "invalid username or password",
      "usernameTaken": "username already taken",
      "passwordTooShort": "password must be at least 8 characters",
      "emailInvalid": "invalid email address"
    }
  }
}
```

```json
// zh.json 新增
"auth": {
  "login": "登录",
  "register": "注册",
  "logout": "退出登录",
  "profile": "个人主页",
  "myChallenges": "我的挑战",
  "settings": "设置",
  "modal": {
    "loginTitle": "LOGIN",
    "registerTitle": "REGISTER",
    "usernameOrEmail": "用户名或邮箱",
    "username": "用户名",
    "email": "邮箱",
    "password": "密码",
    "noAccount": "没有账号？",
    "haveAccount": "已有账号？",
    "errors": {
      "invalidCredentials": "用户名或密码错误",
      "usernameTaken": "用户名已被占用",
      "passwordTooShort": "密码至少需要 8 位字符",
      "emailInvalid": "邮箱格式不正确"
    }
  }
}
```

---

## 八、暂时不实现的部分（占位即可）

以下功能本次 **不需要实现**，按钮 / 菜单项存在但点击无实际逻辑：

```
- 实际的登录 / 注册 API 请求
- Session 管理 / JWT
- Profile 页面
- Settings 页面
- 第三方登录（GitHub / Google）
```

本次目标：UI 完整、交互流畅、状态可通过 mock 数据切换验证。

mock 用户数据（用于开发阶段验证已登录状态）：

```typescript
// 在 AuthSection 中临时使用，后续替换为真实 session
const MOCK_USER = {
  name: 'dev_kai',
  email: 'dev@example.com',
}
// 通过 useState 模拟登录状态切换，方便 UI 调试
```

---

## 九、验收标准

```
□ 未登录：导航右侧显示 [ Login ] [ Register ] 两个按钮
□ 点击 Login 打开登录 Modal，样式正确
□ 点击 Register 打开注册 Modal，样式正确
□ 两个 Modal 可互相切换，不重新打开
□ Modal 点击遮罩 / 右上角 × / Esc 键关闭
□ 表单输入框为终端风格（下边框、> 前缀、focus 高亮）
□ 错误状态显示 [ERR] 格式提示
□ 已登录：导航右侧显示 [ dev_kai ▾ ]
□ 点击触发器展开用户菜单，再次点击收起
□ 用户菜单包含 Profile / My Challenges / Settings / Logout 四项
□ Logout 颜色为 destructive
□ 点击菜单外区域关闭下拉
□ 下拉展开 / 收起有过渡动效
□ Hydration 无 warning（初始渲染占位处理正确）
□ 两套主题下视觉均正确
□ 移动端：按钮可见，Modal 不超出视口
□ i18n：所有文字通过 t() 调用，切换语言后正确变化
```
