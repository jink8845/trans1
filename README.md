# SAP 需求管理系统

基于 FastAPI + SQLite + React 的 SAP 需求管理系统，用于管理 SAP 系统的开发和测试流程。

## 功能特性

- **SAP 接口调用**：获取 SAP 开发机请求号、创建 SAP 请求副本、传输副本到测试机
- **请求管理**：查看、编辑、删除请求记录
- **配置管理**：管理系统配置和 SAP 连接参数
- **用户认证**：基于 JWT 的用户认证和权限管理
- **前端界面**：基于 React + TailwindCSS 的现代化管理界面

## 技术栈

- **后端**：FastAPI + SQLite + SQLAlchemy
- **前端**：React + TypeScript + TailwindCSS
- **认证**：JWT (JSON Web Tokens)
- **SAP 集成**：Python SAP RFC Connector (pyrfc)

## 目录结构

```
├── app/                 # 后端应用
│   ├── api/             # API 路由
│   ├── services/        # 业务逻辑
│   ├── repositories/    # 数据访问层
│   ├── models/          # 数据库模型
│   ├── schemas/         # 数据验证模式
│   ├── config/          # 配置
│   └── utils/           # 工具函数
├── frontend/            # 前端应用
│   ├── src/             # 前端源代码
│   │   ├── components/  # 组件
│   │   ├── pages/       # 页面
│   │   ├── services/    # API 服务
│   │   └── App.tsx      # 应用入口
│   └── public/          # 静态资源
├── main.py              # 后端入口
├── requirements.txt     # 后端依赖
└── .env                 # 环境变量
```

## 快速开始

### 1. 安装依赖

```bash
# 安装后端依赖
pip install -r requirements.txt

# 安装前端依赖
cd frontend
npm install
```

### 2. 配置环境变量

编辑 `.env` 文件，配置以下参数：

```env
# 数据库配置
DATABASE_URL=sqlite:///./sap_request.db

# JWT 配置
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# SAP 配置
SAP_ASHOST=your-sap-host
SAP_SYSNR=00
SAP_CLIENT=100
SAP_USER=your-sap-user
SAP_PASSWD=your-sap-password
```

### 3. 启动后端服务

```bash
uvicorn main:app --reload
```

后端服务将在 `http://localhost:8000` 运行。

### 4. 启动前端服务

```bash
cd frontend
npm run dev
```

前端服务将在 `http://localhost:5173` 运行。

### 5. 访问系统

打开浏览器，访问 `http://localhost:5173`，使用任意用户名和密码登录系统。

## API 文档

后端服务启动后，可以通过以下地址访问 API 文档：

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 主要 API 端点

### SAP 相关
- `POST /api/sap/get-request` - 获取 SAP 开发机请求号
- `POST /api/sap/create-copy` - 创建 SAP 请求副本
- `POST /api/sap/transport-test` - 传输副本到测试机

### 请求管理
- `GET /api/requests` - 获取请求列表
- `GET /api/requests/{id}` - 获取单个请求
- `POST /api/requests` - 创建请求
- `PUT /api/requests/{id}` - 更新请求
- `DELETE /api/requests/{id}` - 删除请求

### 配置管理
- `GET /api/config` - 获取配置列表
- `GET /api/config/{id}` - 获取单个配置
- `POST /api/config` - 创建配置
- `PUT /api/config/{id}` - 更新配置
- `DELETE /api/config/{id}` - 删除配置

### 认证
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `GET /api/auth/users` - 获取用户列表（需要管理员权限）
- `POST /api/auth/users` - 创建用户（需要管理员权限）

## 注意事项

1. 本系统使用 SQLite 作为数据库，适合小规模部署
2. SAP 接口调用功能需要安装 `pyrfc` 库并配置正确的 SAP 连接参数
3. 本系统仅作为示例，实际生产环境需要根据具体情况进行调整

## 许可证

MIT