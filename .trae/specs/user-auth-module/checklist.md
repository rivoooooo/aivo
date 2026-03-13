# 用户认证模块验收检查清单

## UI验收

### 未登录状态
- [ ] 导航右侧显示 [ Login ] [ Register ] 两个按钮
- [ ] Login 按钮样式为 outline（描边）
- [ ] Register 按钮样式为 default（实心）
- [ ] 两个按钮之间有 12px gap

### 登录 Modal
- [ ] 点击 Login 打开登录 Modal
- [ ] Modal 居中显示，有背景遮罩
- [ ] 标题显示 "LOGIN"
- [ ] 用户名/邮箱输入框有 "> " 前缀
- [ ] 密码输入框有 "> " 前缀，只有下边框
- [ ] 输入框 focus 时 border-bottom-color 变为 primary
- [ ] 提交按钮显示 "LOGIN"
- [ ] 底部显示 "no account? [ Register ]" 链接
- [ ] 点击 × 按钮关闭 Modal
- [ ] 点击遮罩关闭 Modal
- [ ] 按 Esc 键关闭 Modal

### 注册 Modal
- [ ] 点击 Register 打开注册 Modal
- [ ] 标题显示 "REGISTER"
- [ ] 包含用户名、邮箱、密码三个输入框
- [ ] 每个输入框都有 "> " 前缀
- [ ] 提交按钮显示 "REGISTER"
- [ ] 底部显示 "have account? [ Login ]" 链接

### Modal 切换
- [ ] Login Modal 底部点击 Register 切换到注册表单
- [ ] Register Modal 底部点击 Login 切换到登录表单
- [ ] 切换时不关闭 Modal

### 错误处理
- [ ] 登录失败显示 "[ERR] invalid username or password"
- [ ] 用户名已占用显示 "[ERR] username already taken"
- [ ] 密码太短显示 "[ERR] password must be at least 8 characters"
- [ ] 错误信息颜色为 destructive
- [ ] 错误信息 font-size 为 12px

### 已登录状态
- [ ] 显示用户菜单触发器 [ username ▾ ]
- [ ] 用户名正确显示
- [ ] 箭头默认向下，展开时旋转 180°
- [ ] 触发器样式为 outline

### 用户菜单下拉
- [ ] 点击触发器展开下拉面板
- [ ] 再次点击收起下拉面板
- [ ] 面板右对齐，距离触发器 8px
- [ ] 面板 min-width: 200px
- [ ] 面板标题显示 "USER"
- [ ] 显示用户名和邮箱
- [ ] 菜单项显示 "> Profile"
- [ ] 菜单项显示 "> My Challenges"
- [ ] 菜单项显示 "> Settings"
- [ ] 菜单项显示 "> Logout"
- [ ] Logout 颜色为 destructive
- [ ] 点击菜单外区域关闭下拉
- [ ] 按 Esc 键关闭下拉
- [ ] 打开动画: opacity 0→1, translateY -4px→0, 150ms
- [ ] 关闭动画: 100ms

### 响应式和主题
- [ ] 移动端按钮可见
- [ ] 移动端 Modal 不超出视口
- [ ] 浅色主题下视觉正确
- [ ] 深色主题下视觉正确

### Hydration
- [ ] 初始渲染有占位符（防止布局跳动）
- [ ] 客户端 mount 后根据 session 决定显示内容
- [ ] 无 hydration mismatch warning

### 国际化
- [ ] 所有按钮文字通过 t() 调用
- [ ] 所有标签文字通过 t() 调用
- [ ] 所有错误信息通过 t() 调用
- [ ] 切换到中文后所有文字正确显示

## 功能验收

### 注册功能
- [ ] 可以成功注册新用户
- [ ] 用户名唯一性检查
- [ ] 邮箱唯一性检查
- [ ] 密码长度验证（至少8位）

### 登录功能
- [ ] 可以使用邮箱登录
- [ ] 可以使用用户名登录
- [ ] 凭证错误时提示正确错误

### 登出功能
- [ ] 点击 Logout 成功清除 session
- [ ] 登出后 UI 更新为未登录状态

### Session 管理
- [ ] 页面刷新后 session 保持
- [ ] 关闭浏览器后 session 保持（如果选择了记住登录）

## 安全验收

- [ ] 密码不以明文存储在数据库
- [ ] Session 使用 HttpOnly Cookie
- [ ] 错误信息不泄露敏感信息（如不提示是邮箱还是密码错误）

## 代码质量

- [ ] 通过 ESLint 检查
- [ ] 无 TypeScript 类型错误
- [ ] 组件正确使用 "use client" 指令
- [ ] 遵循项目代码风格
