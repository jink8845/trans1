import sqlite3

# 连接到 SQLite 数据库
conn = sqlite3.connect('sap_request.db')
cursor = conn.cursor()

# 查询用户表
def query_users():
    print("=== 用户表 ===")
    cursor.execute('SELECT id, username, role, created_at FROM user')
    users = cursor.fetchall()
    for user in users:
        print(f"ID: {user[0]}, 用户名: {user[1]}, 角色: {user[2]}, 创建时间: {user[3]}")
    print(f"用户总数: {len(users)}")
    print()

# 查询请求表
def query_requests():
    print("=== 请求表 ===")
    cursor.execute('SELECT id, request_number, type, status, description, created_by, created_at FROM request')
    requests = cursor.fetchall()
    for req in requests:
        print(f"ID: {req[0]}, 请求号: {req[1]}, 类型: {req[2]}, 状态: {req[3]}, 描述: {req[4]}, 创建人: {req[5]}, 创建时间: {req[6]}")
    print(f"请求总数: {len(requests)}")
    print()

# 查询配置表
def query_configs():
    print("=== 配置表 ===")
    cursor.execute('SELECT id, key, value, description, updated_by, updated_at FROM config')
    configs = cursor.fetchall()
    for config in configs:
        print(f"ID: {config[0]}, 键: {config[1]}, 值: {config[2]}, 描述: {config[3]}, 更新人: {config[4]}, 更新时间: {config[5]}")
    print(f"配置总数: {len(configs)}")
    print()

# 执行查询
try:
    print("开始查询测试数据...\n")
    query_users()
    query_requests()
    query_configs()
    print("查询完成！")
except Exception as e:
    print(f"查询时出错: {e}")
finally:
    # 关闭数据库连接
    conn.close()
    print("数据库连接已关闭")