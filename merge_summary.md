此次合并引入了完整的 SAP 需求管理系统，包括后端 FastAPI 服务和前端 React 应用，实现了 SAP 接口调用、请求管理、配置管理和用户认证等功能。系统采用 SQLite 作为数据库，支持 SAP 开发机请求号获取、请求副本创建和测试机传输等核心功能。
| 文件 | 变更 |
|------|---------|
| .trae/documents/technical_architecture.md | - 新增技术架构文档，包含系统架构设计、技术栈描述、路由定义、API 定义、服务器架构图和数据模型 |
| README.md | - 新增项目说明文档，包含系统功能特性、技术栈、目录结构、快速开始指南、API 文档和注意事项 |
| main.py | - 新增后端主文件，配置 FastAPI 应用、CORS 中间件和路由注册 |
| app/api/sap.py | - 新增 SAP 接口路由，实现获取 SAP 开发机请求号、创建请求副本和传输到测试机的功能 |
| app/api/auth.py | - 新增认证接口，实现用户登录、获取当前用户信息和用户管理功能 |
| app/api/config.py | - 新增配置管理接口，实现配置的增删改查功能 |
| app/api/requests.py | - 新增请求管理接口，实现请求记录的增删改查功能 |
| app/services/sap_service.py | - 新增 SAP 服务，实现与 SAP 系统的交互逻辑 |
| app/utils/sap_client.py | - 新增 SAP 客户端工具，封装与 SAP 系统的连接和操作 |
| app/models/user.py | - 新增用户数据模型 |
| app/models/request.py | - 新增请求数据模型 |
| app/models/config.py | - 新增配置数据模型 |
| app/repositories/user_repository.py | - 新增用户数据访问层 |
| app/repositories/request_repository.py | - 新增请求数据访问层 |
| app/repositories/config_repository.py | - 新增配置数据访问层 |
| app/schemas/auth.py | - 新增认证相关的数据验证模式 |
| app/schemas/sap.py | - 新增 SAP 相关的数据验证模式 |
| app/schemas/request.py | - 新增请求相关的数据验证模式 |
| app/schemas/config.py | - 新增配置相关的数据验证模式 |
| app/config/database.py | - 新增数据库配置，设置 SQLite 连接 |
| frontend/src/App.tsx | - 新增前端应用入口，配置路由和登录保护 |
| frontend/src/pages/Login.tsx | - 新增登录页面 |
| frontend/src/pages/Dashboard.tsx | - 新增仪表盘页面 |
| frontend/src/pages/SAPOperations.tsx | - 新增 SAP 操作页面，实现 SAP 相关功能的前端界面 |
| frontend/src/pages/Requests.tsx | - 新增请求管理页面 |
| frontend/src/pages/Config.tsx | - 新增配置管理页面 |
| frontend/src/services/api.ts | - 新增前端 API 服务，封装与后端的交互 |
| frontend/package.json | - 新增前端项目配置，定义依赖和脚本 |
| requirements.txt | - 新增后端依赖配置 |
| generate_test_data.py | - 新增测试数据生成脚本 |
| query_test_data.py | - 新增测试数据查询脚本