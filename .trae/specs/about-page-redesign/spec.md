# About 页面重设计 Spec

## Why
当前 About 页面仅展示简单的项目信息，缺乏品牌故事和团队介绍。参考 voidzero.dev/about 的成功设计，我们需要一个能够传达使命、展示团队、并体现 Terminal CLI 设计系统风格的 About 页面。

## What Changes
- 完全重构 About 页面，从简单信息展示升级为 7 个 Section 的完整叙事页面
- 新增 Hero、Mission、Founder、Team、OpenRoles、Stack、Contact 七大区块
- 实现 Terminal CLI 风格的视觉设计（代码注释展示身份、package.json 技术栈、shell 脚本联系方式）
- 添加丰富的动效：逐词淡入、打字效果、滚动触发、stagger 入场
- 响应式布局适配移动端

## Impact
- 受影响文件：
  - `src/app/[locale]/(main)/about/page.tsx` - 主页面重构
  - 新增 `src/app/[locale]/(main)/about/components/` 目录及 7+ 个组件
- 设计风格：与现有 Terminal CLI 设计系统保持一致
- 国际化：所有文本内容需支持 next-intl

## ADDED Requirements

### Requirement: Hero Section
The system SHALL provide a Hero section with terminal-style layout.

#### Scenario: Page load animation
- **WHEN** the About page loads
- **THEN** the main title fades in word by word with 80ms stagger
- **AND** the subtitle fades in 400ms after title completes

#### Scenario: Visual style
- **WHEN** viewing the Hero section
- **THEN** it displays `> cat ABOUT.md` command line
- **AND** shows two-line main title with character divider lines
- **AND** shows three-line subtitle with muted color

### Requirement: Mission Section
The system SHALL provide a Mission section with two-column layout.

#### Scenario: Desktop layout
- **WHEN** viewing on desktop
- **THEN** left column shows sticky labels (## MISSION, [ACTIVE], line: 001)
- **AND** right column shows two paragraphs separated by character divider
- **AND** left column has dashed right border

#### Scenario: Mobile layout
- **WHEN** viewing on mobile
- **THEN** layout becomes single column with labels on top
- **AND** sticky positioning is disabled

### Requirement: Founder Section
The system SHALL provide a Founder section with signature-style layout.

#### Scenario: Visual presentation
- **WHEN** viewing the Founder section
- **THEN** it displays 64x64px square avatar with primary border
- **AND** shows name, role, code comment identity, and @handle
- **AND** @handle links to GitHub profile

### Requirement: Team Section
The system SHALL provide a Team section with member grid.

#### Scenario: Grid layout
- **WHEN** viewing on desktop
- **THEN** it shows 4-column grid of member cards
- **WHEN** viewing on tablet
- **THEN** it shows 3-column grid
- **WHEN** viewing on mobile
- **THEN** it shows 2-column grid

#### Scenario: Member card
- **WHEN** viewing a member card
- **THEN** it shows 48x48px avatar, name, role, optional code comment, @handle
- **AND** has hover effect (border color change, translateY -2px)
- **AND** cards fade in with 40ms stagger when section enters viewport

#### Scenario: Avatar fallback
- **WHEN** a member has no avatar
- **THEN** display initials with muted background and primary text

### Requirement: Open Roles Section
The system SHALL provide an Open Roles section with dashed border container.

#### Scenario: Content display
- **WHEN** viewing the section
- **THEN** it shows invitation text (not formal job posting)
- **AND** displays `needs = [...]` in primary color
- **AND** shows clickable link to GitHub issues in secondary color

### Requirement: Stack Section
The system SHALL provide a Stack section with package.json style display.

#### Scenario: Syntax highlighting
- **WHEN** viewing the Stack section
- **THEN** it displays package.json content with syntax highlighting
- **AND** braces use muted-foreground color
- **AND** keys use primary color
- **AND** string values use secondary (amber) color
- **AND** comments use muted-foreground italic

#### Scenario: Layout
- **WHEN** viewing on small screens
- **THEN** the pre block is horizontally scrollable

### Requirement: Contact Section
The system SHALL provide a Contact section with two-column layout.

#### Scenario: Left column - Shell script style
- **WHEN** viewing the left column
- **THEN** it displays shell script format contact info
- **AND** `open` command lines are clickable with hover background
- **AND** URLs are in secondary color

#### Scenario: Right column - Newsletter
- **WHEN** viewing the right column
- **THEN** it shows `> subscribe --monthly` header
- **AND** has terminal-style input (bottom border only)
- **AND** has SUBSCRIBE button

### Requirement: Animations
The system SHALL provide scroll-triggered animations.

#### Scenario: Section entrance
- **WHEN** each section enters viewport (threshold: 0.15)
- **THEN** it fades in with opacity 0→1 and translateY 12px→0
- **AND** animation duration is 400ms with ease-out

#### Scenario: Command line typewriter
- **WHEN** section enters viewport
- **THEN** the command line (`> cat MISSION.md`) types out with 18ms char delay

#### Scenario: Reduced motion
- **WHEN** user prefers reduced motion
- **THEN** all animations are disabled

### Requirement: SEO
The system SHALL provide proper SEO metadata.

#### Scenario: Meta tags
- **WHEN** viewing the page
- **THEN** title is "About — AI-Era | Developer Training Platform"
- **AND** description explains the mission and platform
- **AND** semantic HTML tags are used (h1, h2, p, a with proper attributes)

## MODIFIED Requirements

### Requirement: About Page Route
The existing About page SHALL be completely redesigned.

**Previous**: Simple page with SyncedTypewriter showing project info
**New**: Full narrative page with 7 sections, rich content, and animations

## REMOVED Requirements

None - this is a pure addition/redesign, no features removed.
