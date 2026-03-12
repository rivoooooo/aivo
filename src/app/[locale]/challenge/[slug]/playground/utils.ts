export interface ChallengeCode {
  html: string;
  css: string;
  js: string;
}

export interface ChallengeConfig {
  id: string;
  title: string;
  description: string;
  defaultCode: ChallengeCode;
  dependencies?: string[];
  modules?: string[];
}

const challengesData: Record<string, ChallengeConfig> = {
  "html-basics": {
    id: "html-basics",
    title: "HTML 基础训练",
    description: "学习 HTML 基础标签和结构",
    defaultCode: {
      html: `<div class="container">
  <h1>你好，世界！</h1>
  <p>欢迎来到 HTML 训练场</p>
  <button id="btn">点击我</button>
  <div id="output"></div>
</div>`,
      css: `.container { padding: 20px; font-family: monospace; }
h1 { color: #33ff00; }
button { padding: 10px 20px; background: #33ff00; color: #0a0a0a; border: none; cursor: pointer; }
button:hover { opacity: 0.8; }
#output { margin-top: 20px; padding: 10px; border: 1px dashed #33ff00; min-height: 50px; }`,
      js: `document.getElementById('btn').addEventListener('click', () => {
  const output = document.getElementById('output');
  output.innerHTML = '<p>按钮被点击了！</p>';
  console.log('Button clicked!');
});`
    }
  },
  "css-flexbox": {
    id: "css-flexbox",
    title: "Flexbox 布局训练",
    description: "学习 CSS Flexbox 布局",
    defaultCode: {
      html: `<div class="container">
  <div class="box box1">1</div>
  <div class="box box2">2</div>
  <div class="box box3">3</div>
</div>`,
      css: `.container { display: flex; gap: 10px; padding: 20px; height: 200px; background: #1a1a1a; }
.box { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; border: 2px solid; }
.box1 { background: #ff6b6b; border-color: #ff4757; }
.box2 { background: #4ecdc4; border-color: #45b7aa; }
.box3 { background: #ffe66d; border-color: #ffd93d; }`,
      js: `console.log('Flexbox 布局演示');`
    }
  },
  "css-grid": {
    id: "css-grid",
    title: "Grid 布局训练",
    description: "学习 CSS Grid 布局",
    defaultCode: {
      html: `<div class="grid-container">
  <div class="header">Header</div>
  <div class="sidebar">Sidebar</div>
  <div class="main">Main Content</div>
  <div class="footer">Footer</div>
</div>`,
      css: `.grid-container { display: grid; grid-template-columns: 200px 1fr; grid-template-rows: 60px 1fr 60px; grid-template-areas: "header header" "sidebar main" "footer footer"; height: 300px; gap: 5px; }
.header { grid-area: header; background: #33ff00; color: #0a0a0a; }
.sidebar { grid-area: sidebar; background: #1a3d1a; color: #33ff00; }
.main { grid-area: main; background: #0f0f0f; color: #33ff00; }
.footer { grid-area: footer; background: #33ff00; color: #0a0a0a; }
.header, .sidebar, .main, .footer { display: flex; align-items: center; justify-content: center; font-family: monospace; font-weight: bold; }`,
      js: `console.log('Grid 布局演示');`
    }
  },
  "react-basics": {
    id: "react-basics",
    title: "React 计数器",
    description: "学习 React 基础状态管理",
    defaultCode: {
      html: `<div id="root"></div>`,
      css: `body { margin: 0; font-family: monospace; }
.app { padding: 20px; text-align: center; }
h1 { color: #33ff00; }
button { padding: 10px 20px; margin: 5px; background: #33ff00; color: #0a0a0a; border: none; cursor: pointer; font-weight: bold; }
.counter { font-size: 48px; margin: 20px 0; color: #33ff00; }`,
      js: `import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [count, setCount] = useState(0);
  return \`<div class="app">
    <h1>React Counter</h1>
    <div class="counter">\${count}</div>
    <button onclick="this.parentNode.__ctx.setCount(c => c + 1)">+1</button>
    <button onclick="this.parentNode.__ctx.setCount(c => c - 1)">-1</button>
    <button onclick="this.parentNode.__ctx.setCount(0)">Reset</button>
  </div>\`;
}
App.setCount = setCount;

const root = document.getElementById('root');
const wrapper = { setCount: () => {} };
root.__ctx = wrapper;
const app = App();
root.innerHTML = app;
wrapper.setCount = (fn) => {
  const newCount = fn(count);
  root.__ctx = { setCount: wrapper.setCount };
  root.innerHTML = app;
};`
    },
    dependencies: ["react@18", "react-dom@18"]
  },
  "react-todo": {
    id: "react-todo",
    title: "React Todo List",
    description: "构建一个简单的 Todo 列表应用",
    defaultCode: {
      html: `<div id="root"></div>`,
      css: `body { margin: 0; font-family: monospace; background: #0a0a0a; color: #33ff00; }
.app { max-width: 500px; margin: 50px auto; padding: 20px; }
h1 { text-align: center; color: #33ff00; }
.input-group { display: flex; gap: 10px; margin-bottom: 20px; }
input { flex: 1; padding: 10px; background: #1a1a1a; border: 1px solid #33ff00; color: #33ff00; }
button.add-btn { padding: 10px 20px; background: #33ff00; color: #0a0a0a; border: none; cursor: pointer; font-weight: bold; }
ul { list-style: none; padding: 0; }
li { display: flex; justify-content: space-between; padding: 10px; margin: 5px 0; background: #1a1a1a; border: 1px solid #33ff00; }
.delete-btn { background: #ff3333; color: white; border: none; padding: 5px 10px; cursor: pointer; }`,
      js: `const todos = [
  { id: 1, text: '学习 React', completed: false },
  { id: 2, text: '完成作业', completed: true }
];

function render() {
  const root = document.getElementById('root');
  root.innerHTML = \`
    <div class="app">
      <h1>Todo List</h1>
      <div class="input-group">
        <input id="todoInput" placeholder="添加新任务..." />
        <button class="add-btn" id="addBtn">Add</button>
      </div>
      <ul>
        \${todos.map(t => \`
          <li>
            <span onclick="toggleTodo(\${t.id})" style="cursor:pointer">\${t.text}</span>
            <button class="delete-btn" onclick="deleteTodo(\${t.id})">X</button>
          </li>
        \`).join('')}
      </ul>
      <p>完成: \${todos.filter(t => t.completed).length} / \${todos.length}</p>
    </div>
  \`;
  
  document.getElementById('addBtn').onclick = () => {
    const input = document.getElementById('todoInput');
    if (!input.value.trim()) return;
    todos.push({ id: Date.now(), text: input.value, completed: false });
    input.value = '';
    render();
  };
}

window.toggleTodo = (id) => {
  const todo = todos.find(t => t.id === id);
  if (todo) todo.completed = !todo.completed;
  render();
};

window.deleteTodo = (id) => {
  const idx = todos.findIndex(t => t.id === id);
  if (idx > -1) { todos.splice(idx, 1); render(); }
};

render();`
    }
  },
  "canvas-animation": {
    id: "canvas-animation",
    title: "Canvas 动画",
    description: "创建动态 Canvas 动画",
    defaultCode: {
      html: `<canvas id="canvas" width="600" height="400"></canvas>`,
      css: `body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #0a0a0a; }
canvas { border: 2px solid #33ff00; }`,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const balls = [];
const colors = ['#33ff00', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a29bfe'];

for (let i = 0; i < 10; i++) {
  balls.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    radius: 10 + Math.random() * 20,
    color: colors[Math.floor(Math.random() * colors.length)]
  });
}

function animate() {
  ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  balls.forEach(ball => {
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) ball.vx *= -1;
    if (ball.y < ball.radius || ball.y > canvas.height - ball.radius) ball.vy *= -1;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  requestAnimationFrame(animate);
}
animate();`
    }
  },
  "canvas-demo": {
    id: "canvas-demo",
    title: "Canvas 绘图训练",
    description: "学习 HTML5 Canvas 基础绘图",
    defaultCode: {
      html: `<canvas id="canvas" width="400" height="400"></canvas>`,
      css: `body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #0a0a0a; }
canvas { border: 1px solid #33ff00; }`,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#0a0a0a';
ctx.fillRect(0, 0, 400, 400);
ctx.strokeStyle = '#33ff00';
ctx.lineWidth = 2;
for (let i = 0; i < 10; i++) {
  ctx.beginPath();
  ctx.arc(200, 200, i * 20, 0, Math.PI * 2);
  ctx.stroke();
}
ctx.fillStyle = '#33ff00';
ctx.font = '24px monospace';
ctx.fillText('Canvas Demo', 120, 380);`
    }
  },
  "fetch-api": {
    id: "fetch-api",
    title: "Fetch API 数据获取",
    description: "学习使用 Fetch API 获取数据",
    defaultCode: {
      html: `<div class="container">
  <h1>GitHub 用户查询</h1>
  <div class="search-box">
    <input type="text" id="username" placeholder="输入 GitHub 用户名" value="facebook">
    <button id="search">搜索</button>
  </div>
  <div id="result"></div>
</div>`,
      css: `.container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: monospace; }
h1 { color: #33ff00; text-align: center; }
.search-box { display: flex; gap: 10px; margin-bottom: 20px; }
input { flex: 1; padding: 10px; background: #1a1a1a; border: 1px solid #33ff00; color: #33ff00; }
button { padding: 10px 20px; background: #33ff00; color: #0a0a0a; border: none; cursor: pointer; font-weight: bold; }
#result { padding: 20px; background: #1a1a1a; border: 1px solid #33ff00; min-height: 100px; }
.user-card { display: flex; gap: 20px; align-items: center; }
.avatar { width: 80px; height: 80px; border-radius: 50%; border: 2px solid #33ff00; }
.info h2 { margin: 0; color: #33ff00; }
.stats { display: flex; gap: 20px; margin-top: 10px; }`,
      js: `const searchBtn = document.getElementById('search');
const resultDiv = document.getElementById('result');

async function fetchUser() {
  const username = document.getElementById('username').value;
  if (!username) return;
  resultDiv.innerHTML = '<div style="text-align:center">Loading...</div>';
  try {
    const response = await fetch(\`https://api.github.com/users/\${username}\`);
    if (!response.ok) throw new Error('User not found');
    const user = await response.json();
    resultDiv.innerHTML = \`
      <div class="user-card">
        <img src="\${user.avatar_url}" alt="\${user.login}" class="avatar">
        <div class="info">
          <h2>\${user.name || user.login}</h2>
          <p>\${user.bio || 'No bio'}</p>
          <div class="stats">
            <span>Followers: \${user.followers}</span>
            <span>Following: \${user.following}</span>
            <span>Repos: \${user.public_repos}</span>
          </div>
        </div>
      </div>\`;
  } catch (error) {
    resultDiv.innerHTML = \`<p style="color:#ff3333">Error: \${error.message}</p>\`;
  }
}
searchBtn.addEventListener('click', fetchUser);
document.getElementById('username').addEventListener('keypress', (e) => { if (e.key === 'Enter') fetchUser(); });`
    }
  },
  "dom-manipulation": {
    id: "dom-manipulation",
    title: "DOM 操作练习",
    description: "学习 DOM 创建、插入、删除",
    defaultCode: {
      html: `<div class="container">
  <h1>DOM 操作演示</h1>
  <div class="controls">
    <button id="addBtn">添加元素</button>
    <button id="clearBtn">清空</button>
  </div>
  <div id="box" class="box"></div>
</div>`,
      css: `.container { padding: 20px; font-family: monospace; }
h1 { color: #33ff00; }
.controls { display: flex; gap: 10px; margin-bottom: 20px; }
button { padding: 10px 20px; background: #33ff00; color: #0a0a0a; border: none; cursor: pointer; font-weight: bold; }
.box { min-height: 200px; background: #1a1a1a; border: 2px solid #33ff00; padding: 10px; }
.item { padding: 10px; margin: 5px 0; background: #2a2a2a; border-left: 4px solid #33ff00; color: #33ff00; cursor: pointer; transition: all 0.2s; }
.item:hover { background: #3a3a3a; padding-left: 15px; }`,
      js: `const box = document.getElementById('box');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
let counter = 0;

function createItem() {
  counter++;
  const item = document.createElement('div');
  item.className = 'item';
  item.textContent = \`元素 \${counter} - 点击删除\`;
  item.addEventListener('click', () => { item.remove(); });
  box.appendChild(item);
}
addBtn.addEventListener('click', createItem);
clearBtn.addEventListener('click', () => { box.innerHTML = ''; counter = 0; });`
    }
  },
  "animation-css": {
    id: "animation-css",
    title: "CSS 动画",
    description: "学习 CSS 过渡和动画",
    defaultCode: {
      html: `<div class="container">
  <h1>CSS 动画演示</h1>
  <div class="demo-area">
    <div class="box box1">Hover</div>
    <div class="box box2">Click</div>
    <div class="box box3">Pulse</div>
    <div class="box box4">Spin</div>
  </div>
</div>`,
      css: `.container { padding: 20px; font-family: monospace; }
h1 { color: #33ff00; text-align: center; }
.demo-area { display: flex; gap: 30px; justify-content: center; flex-wrap: wrap; padding: 40px; }
.box { width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer; }
.box1 { background: #33ff00; color: #0a0a0a; transition: all 0.3s ease; }
.box1:hover { transform: scale(1.2) rotate(10deg); box-shadow: 0 0 20px #33ff00; }
.box2 { background: #ff6b6b; color: white; transition: background 0.5s, transform 0.3s; }
.box2:active { background: #ffd93d; transform: scale(0.9); }
.box3 { background: #4ecdc4; color: #0a0a0a; animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); box-shadow: 0 0 20px #4ecdc4; } }
.box4 { background: #a29bfe; color: white; animation: spin 3s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,
      js: `console.log('CSS 动画演示');`
    }
  }
};

export async function getChallengeConfig(slug: string): Promise<ChallengeConfig | null> {
  return challengesData[slug] || null;
}

export function getAllChallenges(): ChallengeConfig[] {
  return Object.values(challengesData);
}
