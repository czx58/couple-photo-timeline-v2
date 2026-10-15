import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool, Client } = pg;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

const dbName = process.env.DB_NAME || 'sneakerlab';

async function initDatabase() {
  // 第一步：连接到默认的 postgres 数据库，检查并创建目标数据库
  const client = new Client({ ...dbConfig, database: 'postgres' });

  try {
    await client.connect();
    console.log('🔗 已连接到 postgres 数据库');

    const checkResult = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (checkResult.rowCount === 0) {
      console.log(`🗄️ 数据库 ${dbName} 不存在，正在创建...`);
      // 避免 SQL 注入，数据库名不能用参数，这里做了简单处理
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ 数据库 ${dbName} 创建成功`);
    } else {
      console.log(`✅ 数据库 ${dbName} 已存在`);
    }
  } catch (err) {
    console.error('❌ 创建数据库失败:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }

  // 第二步：连接到目标数据库，创建表
  const pool = new Pool({ ...dbConfig, database: dbName });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS shoes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        collab VARCHAR(100),
        colorway VARCHAR(255) NOT NULL,
        nickname VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2),
        rating DECIMAL(2, 1) DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        release_date DATE,
        style_code VARCHAR(50),
        image_url TEXT,
        description TEXT,
        story TEXT,
        specs JSONB DEFAULT '[]',
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ shoes 表创建成功或已存在');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ielts_questions (
        id SERIAL PRIMARY KEY,
        topic VARCHAR(255) NOT NULL,
        question TEXT NOT NULL,
        bullet_points TEXT[] NOT NULL,
        category VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ ielts_questions 表创建成功或已存在');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ users 表创建成功或已存在');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS practice_records (
        id SERIAL PRIMARY KEY,
        question_id INTEGER REFERENCES ielts_questions(id) ON DELETE SET NULL,
        transcript TEXT NOT NULL,
        overall_score DECIMAL(3, 1) NOT NULL,
        fluency_coherence DECIMAL(3, 1) NOT NULL,
        lexical_resource DECIMAL(3, 1) NOT NULL,
        grammatical_range_accuracy DECIMAL(3, 1) NOT NULL,
        pronunciation DECIMAL(3, 1) NOT NULL,
        feedback_json JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ practice_records 表创建成功或已存在');

    // 为已存在的 practice_records 表添加 user_id 列（如果不存在）
    await pool.query(`
      ALTER TABLE practice_records
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
    `);
    console.log('✅ practice_records.user_id 列已添加或已存在');
  } catch (err) {
    console.error('❌ 创建表失败:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }

  console.log('🎉 数据库初始化完成');
}

initDatabase();
