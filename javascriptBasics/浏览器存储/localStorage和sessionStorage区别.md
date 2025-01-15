
# localStorage 和 sessionStorage 的区别

Web Storage 提供了两种存储机制：localStorage 和 sessionStorage。虽然它们的 API 完全相同，但在存储的生命周期和作用域上有很大的区别。

## 主要区别

### 1. 生命周期

**localStorage:**
- 永久性存储
- 除非手动清除（代码删除或浏览器设置中清除），否则数据永远不会过期
- 关闭浏览器后数据依然存在

**sessionStorage:**
- 临时性存储
- 仅在当前会话下有效
- 关闭浏览器窗口或标签页后数据会被清除

### 2. 作用域

**localStorage:**
- 在同一个浏览器中，同源的所有窗口和标签页之间共享数据
- 可以在不同的标签页之间通信

**sessionStorage:**
- 仅限于当前浏览器窗口或标签页
- 即使是同一个页面，不同标签页也是独立的
- 刷新页面后数据仍然存在

## 基本用法

```javascript
// localStorage 使用示例
localStorage.setItem('user', 'John');
localStorage.getItem('user'); // 'John'
localStorage.removeItem('user');
localStorage.clear(); // 清除所有数据

// sessionStorage 使用示例
sessionStorage.setItem('token', '123456');
sessionStorage.getItem('token'); // '123456'
sessionStorage.removeItem('token');
sessionStorage.clear(); // 清除所有数据
```

## 存储限制

两者都有相同的存储限制：
- 一般为 5MB 到 10MB（具体取决于浏览器）
- 仅支持字符串数据（需要用 JSON.stringify 转换对象）

```javascript
// 存储对象
const user = {
  name: 'John',
  age: 30
};

// 存储
localStorage.setItem('user', JSON.stringify(user));

// 读取
const savedUser = JSON.parse(localStorage.getItem('user'));
```

## 应用场景

### localStorage 适用于：
1. 用户偏好设置
2. 主题配置
3. 长期有效的令牌（Token）
4. 购物车数据

```javascript
// 主题设置示例
const saveTheme = (theme) => {
  localStorage.setItem('theme', theme);
};

const getTheme = () => {
  return localStorage.getItem('theme') || 'light'; // 默认主题
};
```

### sessionStorage 适用于：
1. 表单数据临时保存
2. 一次性登录信息
3. 临时的用户操作记录
4. 单页面应用的路由状态

```javascript
// 表单数据临时保存示例
const saveFormData = (formData) => {
  sessionStorage.setItem('formData', JSON.stringify(formData));
};

const getFormData = () => {
  const data = sessionStorage.getItem('formData');
  return data ? JSON.parse(data) : null;
};
```

## 注意事项

1. **安全性考虑**
```javascript
// 不要存储敏感信息
// 错误示例
localStorage.setItem('password', '123456'); // 不安全！

// 正确示例
sessionStorage.setItem('temporaryToken', 'xyz789'); // 临时令牌可以
```

2. **性能影响**
```javascript
// 避免存储过大的数据
const hugeData = new Array(1000000).join('x');
try {
  localStorage.setItem('hugeData', hugeData); // 可能会导致性能问题
} catch (e) {
  console.error('存储空间不足');
}
```

3. **数据同步**
```javascript
// localStorage 数据变化监听
window.addEventListener('storage', (e) => {
  console.log('数据变化:', {
    key: e.key,
    oldValue: e.oldValue,
    newValue: e.newValue
  });
});
```

## 最佳实践

1. **封装存储操作**
```javascript
const Storage = {
  set(key, value, useSession = false) {
    const storage = useSession ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(value));
  },
  
  get(key, useSession = false) {
    const storage = useSession ? sessionStorage : localStorage;
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  
  remove(key, useSession = false) {
    const storage = useSession ? sessionStorage : localStorage;
    storage.removeItem(key);
  },
  
  clear(useSession = false) {
    const storage = useSession ? sessionStorage : localStorage;
    storage.clear();
  }
};
```

2. **错误处理**
```javascript
const safeStorage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('存储失败:', e);
      return false;
    }
  }
};
``` 