# Tasks

- [x] Task 1: Create HeroSection component with terminal-style layout and word-by-word fade animation
  - [x] SubTask 1.1: Create HeroSection.tsx with command line header and main title
  - [x] SubTask 1.2: Implement useWordFade hook for staggered word animation (80ms)
  - [x] SubTask 1.3: Add character divider lines with overflow hidden
  - [x] SubTask 1.4: Style with primary color for title, muted-foreground for subtitle

- [x] Task 2: Create MissionSection component with two-column sticky layout
  - [x] SubTask 2.1: Create MissionSection.tsx with left sticky column (labels)
  - [x] SubTask 2.2: Add [ACTIVE] badge with dashed border and success color
  - [x] SubTask 2.3: Implement right column with two paragraphs and character divider
  - [x] SubTask 2.4: Add responsive styles (single column on mobile, sticky disabled)

- [x] Task 3: Create FounderSection component with signature-style layout
  - [x] SubTask 3.1: Create FounderSection.tsx with 64x64 avatar (square, primary border)
  - [x] SubTask 3.2: Add name, role, code comment identity display
  - [x] SubTask 3.3: Implement @handle link to GitHub profile
  - [x] SubTask 3.4: Style with muted-foreground italic for comments, secondary for handle

- [x] Task 4: Create TeamSection component with member grid
  - [x] SubTask 4.1: Create MemberCard.tsx with 48x48 avatar, name, role, comment, handle
  - [x] SubTask 4.2: Implement avatar fallback with initials
  - [x] SubTask 4.3: Add hover effect (border-color change, translateY -2px)
  - [x] SubTask 4.4: Create TeamSection.tsx with responsive grid (4/3/2 columns)
  - [x] SubTask 4.5: Define team member data structure (hardcoded array)

- [x] Task 5: Create OpenRolesSection component with dashed border container
  - [x] SubTask 5.1: Create OpenRolesSection.tsx with invitation text
  - [x] SubTask 5.2: Style needs = [...] in primary color
  - [x] SubTask 5.3: Add clickable GitHub issues link in secondary color
  - [x] SubTask 5.4: Apply dashed border container style

- [x] Task 6: Create StackSection component with package.json syntax highlighting
  - [x] SubTask 6.1: Create JsonHighlight.tsx with regex-based syntax highlighting
  - [x] SubTask 6.2: Implement color rules: braces (muted), keys (primary), values (secondary), comments (muted italic)
  - [x] SubTask 6.3: Create StackSection.tsx with package.json content
  - [x] SubTask 6.4: Add horizontal scroll for small screens

- [x] Task 7: Create ContactSection component with shell script and newsletter
  - [x] SubTask 7.1: Create shell script style contact info (left column)
  - [x] SubTask 7.2: Add clickable open command lines with hover background
  - [x] SubTask 7.3: Create newsletter section (right column) with terminal-style input
  - [x] SubTask 7.4: Implement two-column responsive layout

- [x] Task 8: Create shared animation hooks and components
  - [x] SubTask 8.1: Create useInView hook for scroll-triggered animations
  - [x] SubTask 8.2: Create TypewriterText component for command line typing effect (18ms char delay)
  - [x] SubTask 8.3: Create FadeInSection wrapper for section entrance animations
  - [x] SubTask 8.4: Add prefers-reduced-motion support

- [x] Task 9: Update main About page and add metadata
  - [x] SubTask 9.1: Refactor page.tsx to import and compose all sections
  - [x] SubTask 9.2: Add SEO metadata (title, description)
  - [x] SubTask 9.3: Ensure all external links have target="_blank" rel="noopener"
  - [x] SubTask 9.4: Add semantic HTML tags (h1, h2, etc.)

- [x] Task 10: Add internationalization support
  - [x] SubTask 10.1: Add about page translations to en.json
  - [x] SubTask 10.2: Add about page translations to zh.json
  - [x] SubTask 10.3: Update components to use next-intl translations

# Task Dependencies
- Task 8 (shared animation hooks) should be completed before Tasks 1-7
- Task 9 (main page) depends on Tasks 1-7
- Task 10 (i18n) can be done in parallel with Task 9
