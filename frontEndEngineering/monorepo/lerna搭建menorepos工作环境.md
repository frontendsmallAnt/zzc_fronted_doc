# 使用 Lerna 和 pnpm 搭建 Monorepo 工具环境

本教程将指导您如何使用 Lerna 和 pnpm 搭建一个 Monorepo 环境，以便于管理多个前端项目。

## 1. 安装 Lerna 和 pnpm

### 1.1 全局安装 pnpm
```bash
npm install -g pnpm
```

### 1.2 全局安装 Lerna
```bash
npm install -g lerna
```

## 2. 创建项目目录

### 2.1 创建根目录
```bash
mkdir my-monorepo
cd my-monorepo
```

### 2.2 初始化 Lerna
```bash
lerna init
```

这将创建以下目录结构：
```
my-monorepo/
├── packages/              # 存放子项目的目录
├── lerna.json             # Lerna 配置文件
└── package.json           # 根项目的 package.json
```

## 3. 配置 Lerna

### 3.1 修改 `lerna.json`
```json
{
  "packages": [
    "packages/*"
  ],
  "version": "0.0.0"
}
```

### 3.2 修改根目录的 `package.json`
```json
{
  "name": "my-monorepo",
  "private": true,
  "devDependencies": {
    "lerna": "^x.x.x"  // 使用最新版本
  }
}
```

## 4. 创建子项目

### 4.1 创建子项目目录
```bash
mkdir packages/project-a
mkdir packages/project-b
```

### 4.2 初始化子项目
```bash
cd packages/project-a
pnpm init
cd ../project-b
pnpm init
```

### 4.3 安装依赖
在每个子项目中安装所需的依赖，例如：
```bash
cd packages/project-a
pnpm add vue
```

## 5. 使用 pnpm 管理依赖

### 5.1 在根目录安装依赖
在根目录下运行以下命令以安装所有子项目的依赖：
```bash
pnpm install
```

### 5.2 使用工作区
在根目录的 `package.json` 中添加工作区配置：
```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

## 6. 脚本管理

### 6.1 在根目录的 `package.json` 中添加脚本
```json
{
  "scripts": {
    "bootstrap": "lerna bootstrap",
    "build": "lerna run build",
    "test": "lerna run test"
  }
}
```

### 6.2 在子项目中添加脚本
在每个子项目的 `package.json` 中添加构建和测试脚本：
```json
{
  "scripts": {
    "build": "echo 'Building project A'",
    "test": "echo 'Testing project A'"
  }
}
```

## 7. 使用 Lerna 管理版本

### 7.1 发布新版本
使用 Lerna 发布新版本：
```bash
lerna publish
```

### 7.2 更新版本
使用 Lerna 更新版本：
```bash
lerna version
```

## 8. 其他配置

### 8.1 配置 Git
确保在根目录下初始化 Git 仓库：
```bash
git init
```

### 8.2 配置 CI/CD
根据需要配置 CI/CD 工具（如 GitHub Actions、GitLab CI 等）以自动化构建和发布流程。

## 9. 注意事项

1. **依赖管理**：确保在根目录和子项目中正确管理依赖，避免重复安装。
2. **版本控制**：使用 Lerna 管理版本时，确保遵循语义化版本控制（SemVer）规范。
3. **文档维护**：为每个子项目编写文档，确保团队成员了解项目结构和使用方法。

## 10. 总结

通过使用 Lerna 和 pnpm，您可以轻松地管理多个前端项目，提升开发效率和团队协作能力。根据项目需求，您可以进一步扩展和自定义 Monorepo 环境。
