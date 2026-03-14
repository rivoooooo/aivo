# Checklist

## 内容验收

- [x] 7 个 Section 全部渲染，顺序正确
- [x] HERO 主标题两行，副标题三行
- [x] MISSION 左侧 sticky 标签，右侧正文分两段
- [x] FOUNDER 区展示头像、姓名、代码注释、@handle
- [x] TEAM 成员网格，hover 效果正确
- [x] TEAM 无头像时显示首字母 fallback
- [x] OPEN_ROLES 使用 dashed 边框容器
- [x] STACK package.json 语法高亮正确
- [x] CONTACT shell 脚本风格，链接行可点击
- [x] Newsletter 输入框终端风格

## 动效验收

- [x] HERO 主标题逐词淡入 (80ms stagger)
- [x] 各 Section 滚动触发淡入 (threshold: 0.15)
- [x] 各 Section 命令行标题有打字效果 (18ms char delay)
- [x] 团队卡片 stagger 入场 (40ms)
- [x] prefers-reduced-motion: 所有动效关闭

## 响应式验收

- [x] MISSION 两栏在移动端变单列（左侧标签在上）
- [x] 移动端左侧 sticky 取消
- [x] TEAM 在移动端 2 列
- [x] CONTACT 两栏在移动端单列
- [x] 375px 无横向溢出
- [x] STACK pre 横向可滚动

## 细节验收

- [x] 所有外部链接 target="_blank" rel="noopener"
- [x] @handle 点击跳转正确的 GitHub profile
- [x] 字符分隔线 overflow: hidden，不造成横向滚动
- [x] 两套主题（深色/浅色）均正确
- [x] 全站字体 JetBrains Mono，无圆角

## 代码质量

- [x] TypeScript 类型检查通过
- [x] ESLint 检查通过
- [x] 组件文件结构符合设计文档
- [x] 国际化文本全部提取到 messages 文件
