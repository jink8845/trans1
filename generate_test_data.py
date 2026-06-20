import sqlite3
import datetime

# 连接到 SQLite 数据库
conn = sqlite3.connect('sap_request.db')
cursor = conn.cursor()

# 生成测试数据
def generate_test_data():
    print("开始生成测试数据...")
    
    # 插入用户数据
    users = [
        ('admin', 'admin'),
        ('user1', 'user'),
        ('user2', 'user')
    ]
    
    for username, role in users:
        try:
            cursor.execute('''
                INSERT OR IGNORE INTO user (username, role, created_at)
                VALUES (?, ?, ?)
            ''', (username, role, datetime.datetime.now()))
        except Exception as e:
            print(f"插入用户 {username} 时出错: {e}")
    
    # 插入请求数据
    requests = [
        ('DEVK900001', 'development', 'completed', '测试开发请求', 'user1'),
        ('QASK900002', 'copy', 'completed', '测试副本请求', 'user2'),
        ('DEVK900003', 'development', 'created', '新开发请求', 'admin'),
        ('QASK900004', 'copy', 'created', '新副本请求', 'user1')
    ]
    
    for request_number, type, status, description, created_by in requests:
        try:
            cursor.execute('''
                INSERT OR IGNORE INTO request (request_number, type, status, description, created_by, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (request_number, type, status, description, created_by, datetime.datetime.now(), datetime.datetime.now()))
        except Exception as e:
            print(f"插入请求 {request_number} 时出错: {e}")
    
    # 插入配置数据
    configs = [
        ('sap.ashost', 'localhost', 'SAP 主机地址', 'admin'),
        ('sap.sysnr', '00', 'SAP 系统编号', 'admin'),
        ('sap.client', '100', 'SAP 客户端', 'admin'),
        ('sap.user', 'test', 'SAP 用户名', 'admin'),
        ('system.debug', 'true', '调试模式', 'admin')
    ]
    
    for key, value, description, updated_by in configs:
        try:
            cursor.execute('''
                INSERT OR IGNORE INTO config (key, value, description, updated_by, updated_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (key, value, description, updated_by, datetime.datetime.now()))
        except Exception as e:
            print(f"插入配置 {key} 时出错: {e}")
    
    # 提交事务
    conn.commit()
    print("测试数据生成完成！")

# 执行测试数据生成
try:
    generate_test_data()
except Exception as e:
    print(f"生成测试数据时出错: {e}")
finally:
    # 关闭数据库连接
    conn.close()
    print("数据库连接已关闭")