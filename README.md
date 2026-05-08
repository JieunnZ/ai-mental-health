# 宁渡AI心理健康助手

## 项目简介

宁渡AI是一款面向高校学生的智能心理健康支持系统，采用Vue3+FastAPI前后端分离架构，为用户提供AI陪伴聊天、情绪日记记录、心理知识学习等功能。

## 核心功能

### 1. AI智能咨询

- 基于SSE实现流式对话，实时展示AI回复
- 支持Markdown渲染，包含代码高亮与图文混排
- 情绪分析结果可视化展示
- 会话历史管理与切换

### 2. 情绪日记

- 可视化情绪记录表单
- 情绪趋势图表展示
- 情绪分析与改善建议

### 3. 心理健康知识库

- 知识文章分类浏览

### 4. 用户认证系统

- 注册、登录、登出完整流程
- 路由权限控制

## 技术栈

- **框架**：Vue 3 (Composition API)
- **构建工具**：Vite
- **UI组件库**：Element Plus
- **路由管理**：Vue Router 4
- **状态管理**：Pinia
- **HTTP请求**：Axios + Fetch EventSource
- **样式技术**：SCSS
- **图表库**：ECharts
- **富文本编辑器**：WangEditor

## 快速开始

### 环境要求

- Node.js ^20.19.0 || >=22.12.0
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 开发环境运行

```bash
pnpm dev
```

项目将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
pnpm build
```

构建产物将输出到 `dist` 目录

## 项目结构

```
├── public/              # 静态资源
├── src/
│   ├── apis/           # API接口封装
│   ├── assets/          # 图片、样式等静态资源
│   ├── components/      # 通用组件
│   ├── config/          # 配置文件
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia状态管理
│   ├── untils/          # 工具函数
│   ├── views/           # 页面组件
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── .gitignore           # Git忽略配置
├── eslint.config.js     # ESLint配置
├── index.html           # HTML模板
├── package.json         # 项目配置
├── pnpm-lock.yaml       # 依赖锁定文件
├── README.md            # 项目说明
└── vite.config.js       # Vite配置
```

## 页面预览

### 首页
<img width="1279" height="625" alt="屏幕截图 2026-05-08 194017" src="https://github.com/user-attachments/assets/ba31a5aa-8685-4d93-a4f1-cff88bb94805" />

### 注册页
<img width="1279" height="616" alt="屏幕截图 2026-05-08 194046" src="https://github.com/user-attachments/assets/1064d9cf-1331-4355-8fe3-e897a315a4a5" />

### 登录页
<img width="1279" height="626" alt="屏幕截图 2026-05-08 194113" src="https://github.com/user-attachments/assets/d92622f1-c950-4254-9dd6-88f5145f834b" />

### 用户端——AI咨询页面
<img width="1279" height="623" alt="屏幕截图 2026-05-08 194214" src="https://github.com/user-attachments/assets/f3ba5c61-747c-407f-a056-3c5477cc06d1" />

### 用户端——情绪日记
<img width="1279" height="622" alt="屏幕截图 2026-05-08 194237" src="https://github.com/user-attachments/assets/2ed128f2-04a6-4bdd-8c93-73e2a04e1de1" />

### 用户端——知识库
<img width="1279" height="611" alt="屏幕截图 2026-05-08 194306" src="https://github.com/user-attachments/assets/9fb30cf4-2982-4b75-9780-c742860b9490" />

### 管理端——数据分析
<img width="1279" height="620" alt="屏幕截图 2026-05-08 194435" src="https://github.com/user-attachments/assets/5d347226-1f66-42ba-af47-ecad49a938f2" />

### 管理端——知识文章
<img width="1279" height="619" alt="屏幕截图 2026-05-08 194504" src="https://github.com/user-attachments/assets/aa0b3611-b747-4166-a3f7-a99e708ce2b3" />

### 管理端——咨询记录
<img width="1279" height="619" alt="屏幕截图 2026-05-08 194528" src="https://github.com/user-attachments/assets/85a4f5b6-02b2-48d5-875d-663ca3a30e6a" />

### 管理端——情绪日志
<img width="1279" height="614" alt="屏幕截图 2026-05-08 194550" src="https://github.com/user-attachments/assets/0c2bd668-e369-415e-96dc-6f84c11ee488" />

## 开发指南

### 代码规范

- 使用ESLint进行代码风格检查
- 遵循Vue 3 Composition API最佳实践
- 组件命名采用PascalCase格式
- 变量命名采用camelCase格式

### 提交规范

- 提交信息使用英文
- 遵循Conventional Commits规范
- 提交前运行 `pnpm lint` 确保代码质量

### 开发流程

1. 创建新分支：`git checkout -b feature/xxx`
2. 开发功能
3. 运行 `pnpm lint` 检查代码
4. 提交代码：`git commit -m "feat: xxx"`
5. 推送到远程：`git push origin feature/xxx`
6. 创建Pull Request

## 构建与部署

### 生产环境部署

1. 运行 `pnpm build` 构建生产版本
2. 将 `dist` 目录部署到静态文件服务器
3. 配置后端API地址

### 环境变量

项目使用 `.env` 文件管理环境变量：

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

***

**宁渡AI心理健康助手** - 让科技成为心灵的守护者
