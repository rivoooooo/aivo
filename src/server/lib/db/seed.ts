import { db } from './index';
import { categories, challenges, challengeResources } from './schema';

const seedData = async () => {
  console.log('Seeding database...');

  await db.delete(challengeResources);
  await db.delete(challenges);
  await db.delete(categories);

  const categoryData = [
    { name: 'HTML', description: 'HTML 基础挑战', icon: 'html', displayOrder: 1 },
    { name: 'React', description: 'React 组件挑战', icon: 'react', displayOrder: 2 },
    { name: 'Vue', description: 'Vue 组件挑战', icon: 'vue', displayOrder: 3 },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .returning();
  
  console.log(`Inserted ${insertedCategories.length} categories`);

  const categoryMap = new Map(
    insertedCategories.map((c) => [c.name, c.id])
  );

  const challengeData = [
    {
      categoryId: categoryMap.get('HTML')!,
      slug: 'html-form-validation',
      name: 'HTML 表单验证',
      description: '创建一个带有客户端验证的注册表单，包括用户名、邮箱和密码字段',
      difficulty: 'easy',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('HTML')!,
      slug: 'html-form-validation',
      name: 'HTML Form Validation',
      description: 'Create a registration form with client-side validation, including username, email and password fields',
      difficulty: 'easy',
      language: 'en',
    },
    {
      categoryId: categoryMap.get('React')!,
      slug: 'react-todo-list',
      name: 'React 待办事项列表',
      description: '构建一个功能完整的待办事项应用，支持添加、删除、标记完成和筛选',
      difficulty: 'medium',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('React')!,
      slug: 'react-todo-list',
      name: 'React Todo List',
      description: 'Build a fully functional todo application with add, delete, complete and filter features',
      difficulty: 'medium',
      language: 'en',
    },
    {
      categoryId: categoryMap.get('Vue')!,
      slug: 'vue-shopping-cart',
      name: 'Vue 购物车',
      description: '实现一个购物车功能，包括商品列表、数量增减、总价计算和结账流程',
      difficulty: 'hard',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('Vue')!,
      slug: 'vue-shopping-cart',
      name: 'Vue Shopping Cart',
      description: 'Implement a shopping cart with product list, quantity adjustment, total calculation and checkout flow',
      difficulty: 'hard',
      language: 'en',
    },
  ];

  const insertedChallenges = await db
    .insert(challenges)
    .values(challengeData)
    .returning();

  console.log(`Inserted ${insertedChallenges.length} challenges`);

  const challengeMap = new Map(
    insertedChallenges.map((c) => [`${c.slug}-${c.language}`, c.id])
  );

  const resourceData = [
    {
      challengeId: challengeMap.get('html-form-validation-zh')!,
      type: 'html',
      importSource: '',
      initCode: [
        {
          filename: 'index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>注册表单</title>
</head>
<body>
  <!-- 在此创建你的表单 -->
</body>
</html>`
        }
      ],
      codeSource: [
        {
          filename: 'index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>注册表单</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 400px; margin: 50px auto; padding: 20px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    .error { border-color: red; }
    .error-message { color: red; font-size: 12px; display: none; }
    button { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #45a049; }
  </style>
</head>
<body>
  <form id="registerForm">
    <div class="form-group">
      <label for="username">用户名</label>
      <input type="text" id="username" name="username" required minlength="3">
      <span class="error-message" id="usernameError">用户名至少需要3个字符</span>
    </div>
    <div class="form-group">
      <label for="email">邮箱</label>
      <input type="email" id="email" name="email" required>
      <span class="error-message" id="emailError">请输入有效的邮箱地址</span>
    </div>
    <div class="form-group">
      <label for="password">密码</label>
      <input type="password" id="password" name="password" required minlength="6">
      <span class="error-message" id="passwordError">密码至少需要6个字符</span>
    </div>
    <div class="form-group">
      <label for="confirmPassword">确认密码</label>
      <input type="password" id="confirmPassword" name="confirmPassword" required>
      <span class="error-message" id="confirmError">两次密码输入不一致</span>
    </div>
    <button type="submit">注册</button>
  </form>

  <script>
    const form = document.getElementById('registerForm');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      let isValid = true;
      
      const username = document.getElementById('username');
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const confirmPassword = document.getElementById('confirmPassword');
      
      if (username.value.length < 3) {
        username.classList.add('error');
        document.getElementById('usernameError').style.display = 'block';
        isValid = false;
      } else {
        username.classList.remove('error');
        document.getElementById('usernameError').style.display = 'none';
      }
      
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(email.value)) {
        email.classList.add('error');
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
      } else {
        email.classList.remove('error');
        document.getElementById('emailError').style.display = 'none';
      }
      
      if (password.value.length < 6) {
        password.classList.add('error');
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
      } else {
        password.classList.remove('error');
        document.getElementById('passwordError').style.display = 'none';
      }
      
      if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add('error');
        document.getElementById('confirmError').style.display = 'block';
        isValid = false;
      } else {
        confirmPassword.classList.remove('error');
        document.getElementById('confirmError').style.display = 'none';
      }
      
      if (isValid) {
        alert('注册成功！');
        form.reset();
      }
    });
  </script>
</body>
</html>`
        }
      ],
    },
    {
      challengeId: challengeMap.get('react-todo-list-zh')!,
      type: 'react',
      importSource: `import React from "https://esm.sh/react@19";
import ReactDOM from "https://esm.sh/react-dom@19/client";`,
      initCode: [
        {
          filename: 'App.jsx',
          language: 'javascript',
          content: `function App() {
  // 在此实现你的待办事项应用
  return (
    <div>
      <h1>待办事项</h1>
    </div>
  );
}`
        },
        {
          filename: 'index.html',
          language: 'html',
          content: `<div id="root"></div>`
        }
      ],
      codeSource: [
        {
          filename: 'App.jsx',
          language: 'javascript',
          content: `import React, { useState } from "https://esm.sh/react@19";
import ReactDOM from "https://esm.sh/react-dom@19/client";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React', completed: false },
    { id: 2, text: '完成项目', completed: true },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  const addTodo = () => {
    if (!inputValue.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: inputValue, completed: false }
    ]);
    setInputValue('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h1>待办事项列表</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="添加新任务..."
          style={{ flex: 1, padding: '8px', fontSize: '16px' }}
        />
        <button
          onClick={addTodo}
          style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          添加
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{ marginRight: '10px', padding: '6px 12px', background: filter === 'all' ? '#2196F3' : '#ddd', color: filter === 'all' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('active')}
          style={{ marginRight: '10px', padding: '6px 12px', background: filter === 'active' ? '#2196F3' : '#ddd', color: filter === 'active' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          进行中
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{ padding: '6px 12px', background: filter === 'completed' ? '#2196F3' : '#ddd', color: filter === 'completed' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          已完成
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.map(todo => (
          <li
            key={todo.id}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', background: todo.completed ? '#f9f9f9' : 'white' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{ marginRight: '10px' }}
              />
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#999' : 'black' }}>
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ padding: '4px 8px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              删除
            </button>
          </li>
        ))}
      </ul>

      <p style={{ color: '#666', marginTop: '20px' }}>
        剩余 {todos.filter(t => !t.completed).length} 项任务
      </p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`
        },
        {
          filename: 'index.html',
          language: 'html',
          content: `<div id="root"></div>`
        }
      ],
    },
    {
      challengeId: challengeMap.get('vue-shopping-cart-zh')!,
      type: 'vue',
      importSource: `import { createApp } from "https://esm.sh/vue@3";`,
      initCode: [
        {
          filename: 'App.vue',
          language: 'vue',
          content: `<template>
  <div id="app">
    <h1>购物车</h1>
  </div>
</template>

<script>
export default {
  // 在此实现你的购物车应用
};
</script>`
        },
        {
          filename: 'index.html',
          language: 'html',
          content: `<div id="app"></div>`
        }
      ],
      codeSource: [
        {
          filename: 'App.vue',
          language: 'vue',
          content: `<template>
  <div style="max-width: 800px; margin: 50px auto; padding: 20px;">
    <h1>🛒 购物车</h1>
    
    <div v-if="cart.length === 0" style="text-align: center; padding: 40px; color: #666;">
      购物车是空的，快去添加商品吧！
    </div>
    
    <div v-else>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="border-bottom: 2px solid #eee;">
            <th style="text-align: left; padding: 10px;">商品</th>
            <th style="text-align: center; padding: 10px; width: 120px;">单价</th>
            <th style="text-align: center; padding: 10px; width: 150px;">数量</th>
            <th style="text-align: right; padding: 10px;">小计</th>
            <th style="width: 50px;"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item.id" style="border-bottom: 1px solid #eee;">
            <td style="padding: 15px 10px;">
              <div style="font-weight: bold;">{{ item.name }}</div>
              <div style="font-size: 12px; color: #666;">{{ item.description }}</div>
            </td>
            <td style="text-align: center; padding: 10px;">¥{{ item.price }}</td>
            <td style="text-align: center; padding: 10px;">
              <button @click="decreaseQuantity(item.id)" style="padding: 4px 10px; cursor: pointer;">-</button>
              <span style="display: inline-block; width: 40px;">{{ item.quantity }}</span>
              <button @click="increaseQuantity(item.id)" style="padding: 4px 10px; cursor: pointer;">+</button>
            </td>
            <td style="text-align: right; padding: 10px; font-weight: bold;">¥{{ (item.price * item.quantity).toFixed(2) }}</td>
            <td style="text-align: center; padding: 10px;">
              <button @click="removeFromCart(item.id)" style="background: #f44336; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">×</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: right;">
        <div style="margin-bottom: 10px;">
          <span style="color: #666;">商品总数：</span>
          <strong>{{ totalQuantity }}</strong>
        </div>
        <div style="font-size: 24px; margin-bottom: 15px;">
          <span style="color: #666;">总计：</span>
          <span style="color: #f44336;">¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <button @click="checkout" style="background: #4CAF50; color: white; border: none; padding: 12px 30px; font-size: 16px; border-radius: 4px; cursor: pointer;">
          🛍️ 结账
        </button>
      </div>
    </div>
    
    <div style="margin-top: 40px;">
      <h2>推荐商品</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
        <div v-for="product in availableProducts" :key="product.id" style="border: 1px solid #ddd; border-radius: 8px; padding: 15px;">
          <div style="font-weight: bold; margin-bottom: 5px;">{{ product.name }}</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 10px;">{{ product.description }}</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #f44336; font-weight: bold;">¥{{ product.price }}</span>
            <button @click="addToCart(product)" style="background: #2196F3; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">加入购物车</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { createApp, ref, computed } = Vue;

const App = {
  setup() {
    const availableProducts = ref([
      { id: 1, name: 'iPhone 15', description: '最新款苹果手机', price: 6999, quantity: 1 },
      { id: 2, name: 'MacBook Pro', description: '专业级笔记本', price: 12999, quantity: 1 },
      { id: 3, name: 'AirPods Pro', description: '主动降噪耳机', price: 1999, quantity: 1 },
      { id: 4, name: 'iPad Air', description: '轻薄平板电脑', price: 4599, quantity: 1 },
    ]);
    
    const cart = ref([]);
    
    const addToCart = (product) => {
      const existing = cart.value.find(item => item.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        cart.value.push({ ...product });
      }
    };
    
    const removeFromCart = (id) => {
      cart.value = cart.value.filter(item => item.id !== id);
    };
    
    const increaseQuantity = (id) => {
      const item = cart.value.find(item => item.id === id);
      if (item) item.quantity++;
    };
    
    const decreaseQuantity = (id) => {
      const item = cart.value.find(item => item.id === id);
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    };
    
    const totalQuantity = computed(() => {
      return cart.value.reduce((sum, item) => sum + item.quantity, 0);
    });
    
    const totalPrice = computed(() => {
      return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });
    
    const checkout = () => {
      if (cart.value.length === 0) {
        alert('购物车是空的！');
        return;
      }
      alert(\`订单确认！总金额：¥\${totalPrice.value.toFixed(2)}\`);
      cart.value = [];
    };
    
    return {
      cart,
      availableProducts,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      totalQuantity,
      totalPrice,
      checkout
    };
  }
};

createApp(App).mount('#app');
</script>`
        },
        {
          filename: 'index.html',
          language: 'html',
          content: `<script src="https://esm.sh/vue@3"></script>
<div id="app"></div>`
        }
      ],
    },
  ];

  const insertedResources = await db
    .insert(challengeResources)
    .values(resourceData)
    .returning();

  console.log(`Inserted ${insertedResources.length} challenge resources`);
  console.log('Seeding completed!');
};

seedData()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
