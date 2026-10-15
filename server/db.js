import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// 创建数据库连接池
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'sneakerlab',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// 连接测试
pool.on('connect', () => {
  console.log('✅ 已连接到 PostgreSQL 数据库');
});

pool.on('error', (err) => {
  console.error('❌ 数据库连接错误:', err.message);
});

export default pool;
