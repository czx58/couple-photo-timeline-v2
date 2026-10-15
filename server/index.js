import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '后端服务运行中' });
});

// 用户认证相关接口

// 注册
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: '用户名长度需在 3–30 个字符之间' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '密码长度至少为 6 位' });
    }

    // 检查用户名是否已存在
    const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existingUser.rowCount > 0) {
      return res.status(409).json({ error: '用户名已被注册' });
    }

    // 密码哈希加密
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 创建用户
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, passwordHash]
    );

    const user = result.rows[0];
    res.status(201).json({
      message: '注册成功',
      user: { id: user.id, username: user.username, createdAt: user.created_at },
    });
  } catch (err) {
    console.error('注册失败:', err.message);
    res.status(500).json({ error: '注册失败，请稍后重试' });
  }
});

// 登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    // 查询用户
    const result = await pool.query(
      'SELECT id, username, password_hash, created_at FROM users WHERE username = $1',
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const user = result.rows[0];

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    res.json({
      message: '登录成功',
      user: { id: user.id, username: user.username, createdAt: user.created_at },
    });
  } catch (err) {
    console.error('登录失败:', err.message);
    res.status(500).json({ error: '登录失败，请稍后重试' });
  }
});

// 雅思口语相关接口

// 获取所有活跃题目
app.get('/api/ielts/questions', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT id, topic, question, bullet_points, category, created_at FROM ielts_questions WHERE is_active = true';
    const params = [];

    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('获取雅思题库失败:', err.message);
    res.status(500).json({ error: '获取题库失败' });
  }
});

// 随机获取一道活跃题目
app.get('/api/ielts/questions/random', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT id, topic, question, bullet_points, category, created_at FROM ielts_questions WHERE is_active = true';
    const params = [];

    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }

    query += ' ORDER BY RANDOM() LIMIT 1';

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '题库为空' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('获取随机题目失败:', err.message);
    res.status(500).json({ error: '获取随机题目失败' });
  }
});

// 获取练习记录（最近 20 条）
app.get('/api/ielts/records', async (req, res) => {
  try {
    const { userId } = req.query;

    let query = `
      SELECT pr.*, iq.topic AS question_topic, iq.question AS question_text
      FROM practice_records pr
      LEFT JOIN ielts_questions iq ON pr.question_id = iq.id
    `;
    const params = [];

    if (userId) {
      query += ' WHERE pr.user_id = $1';
      params.push(userId);
    }

    query += ' ORDER BY pr.created_at DESC LIMIT 20';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('获取练习记录失败:', err.message);
    res.status(500).json({ error: '获取练习记录失败' });
  }
});

// 雅思口语 Part 2 AI 评分
app.post('/api/ielts/evaluate', async (req, res) => {
  try {
    const { questionId, question, bulletPoints, transcript, userId } = req.body;

    if (!question || !transcript || transcript.trim().length === 0) {
      return res.status(400).json({ error: '缺少题目或回答内容' });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === 'your-deepseek-api-key-here') {
      return res.status(500).json({ error: '未配置 DeepSeek API Key，请在 .env 文件中设置' });
    }

    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

    const systemPrompt = `你是一位经验丰富的雅思口语考官。请根据雅思官方评分标准，对考生的 Part 2 回答进行评分和反馈。

评分标准（1-9分）：
1. Fluency and Coherence（流利度与连贯性）
2. Lexical Resource（词汇资源）- 重点评估词汇多样性、高级词汇使用、地道搭配、同义替换能力
3. Grammatical Range and Accuracy（语法多样性与准确性）
4. Pronunciation（发音）- 由于我们只有文字转录稿，请根据用词、句式结构和可推测的发音清晰度来评估，并在反馈中说明这是基于文本的估计。

请以严格但鼓励的态度评分。考生的目标分数段是 5.5-7.0，请给出符合中国考生实际水平的分数。

所有解释、反馈、优点、待改进、语法纠错说明、词汇分析请使用中文。改进后的参考回答用英文。`;

    const userPrompt = `题目：${question}

提示要点：
${(bulletPoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}

考生回答：
${transcript}

请对以上回答进行全面评分，并返回以下 JSON 格式（不要包含 markdown 代码块标记）：
{
  "overallScore": 总分（1-9 的数字，保留一位小数）,
  "scores": {
    "fluencyCoherence": 数字,
    "lexicalResource": 数字,
    "grammaticalRangeAccuracy": 数字,
    "pronunciation": 数字
  },
  "feedback": {
    "strengths": ["优点1", "优点2"],
    "weaknesses": ["待改进1", "待改进2"],
    "grammarErrors": [
      {"original": "错误原句/单词，必须是从考生回答中摘出的原样文本", "correction": "正确表达", "explanation": "中文解释"}
    ],
    "vocabularySuggestions": [
      {"original": "原词/原短语，必须是从考生回答中摘出的原样文本", "suggestion": "更好的表达", "reason": "中文解释"}
    ],
    "improvedAnswer": "用英文写一段改进后的参考回答，长度和考生回答相近"
  },
  "vocabularyAnalysis": {
    "diversityScore": 词汇多样性分数（1-9）,
    "advancedWordCount": 高级词汇数量,
    "totalWordCount": 总词数,
    "comment": "对考生词汇使用情况的总体中文评价",
    "advancedWords": [
      {"word": "考生使用的高级词汇，必须是从回答中摘出的原样文本", "cefr": "C1/B2等", "meaning": "中文释义"}
    ],
    "repeatedWords": [
      {"word": "重复过多的词，必须是从回答中摘出的原样文本", "count": 出现次数, "suggestions": ["替换建议1", "替换建议2"]}
    ],
    "collocationIssues": [
      {"original": "不地道的搭配，必须是从回答中摘出的原样文本", "suggestion": "更地道的表达", "explanation": "中文解释"}
    ]
  }
}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API 错误:', errorData);
      return res.status(500).json({ error: 'AI 评分服务暂时不可用，请稍后重试' });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'AI 返回内容为空' });
    }

    let result;
    try {
      result = JSON.parse(content);
    } catch (parseErr) {
      console.error('解析 AI 返回 JSON 失败:', content);
      return res.status(500).json({ error: 'AI 评分结果解析失败' });
    }

    // 简单校验返回结构
    if (!result.overallScore || !result.scores || !result.feedback) {
      console.error('AI 返回结构不完整:', result);
      return res.status(500).json({ error: 'AI 评分结果结构不完整' });
    }

    // 保存练习记录到数据库
    try {
      await pool.query(
        `INSERT INTO practice_records (
          user_id, question_id, transcript, overall_score,
          fluency_coherence, lexical_resource, grammatical_range_accuracy, pronunciation,
          feedback_json
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          userId || null,
          questionId || null,
          transcript.trim(),
          result.overallScore,
          result.scores.fluencyCoherence,
          result.scores.lexicalResource,
          result.scores.grammaticalRangeAccuracy,
          result.scores.pronunciation,
          JSON.stringify(result.feedback),
        ]
      );
    } catch (dbErr) {
      console.error('保存练习记录失败:', dbErr.message);
      // 保存失败不影响返回评分结果
    }

    res.json(result);
  } catch (err) {
    console.error('雅思评分接口错误:', err.message);
    res.status(500).json({ error: '评分请求处理失败' });
  }
});

// 获取所有鞋子
app.get('/api/shoes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM shoes ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('获取鞋列表失败:', err.message);
    res.status(500).json({ error: '获取鞋列表失败' });
  }
});

// 获取单双鞋详情
app.get('/api/shoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM shoes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到该鞋款' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('获取鞋详情失败:', err.message);
    res.status(500).json({ error: '获取鞋详情失败' });
  }
});

// 添加新鞋
app.post('/api/shoes', async (req, res) => {
  try {
    const {
      name,
      brand,
      collab,
      colorway,
      nickname,
      price,
      original_price,
      rating,
      review_count,
      release_date,
      style_code,
      image_url,
      description,
      story,
      specs,
      tags,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO shoes (
        name, brand, collab, colorway, nickname, price, original_price,
        rating, review_count, release_date, style_code, image_url,
        description, story, specs, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        name,
        brand,
        collab || null,
        colorway,
        nickname || null,
        price,
        original_price || null,
        rating || 0,
        review_count || 0,
        release_date || null,
        style_code || null,
        image_url || null,
        description || null,
        story || null,
        JSON.stringify(specs || []),
        tags || [],
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('添加鞋款失败:', err.message);
    res.status(500).json({ error: '添加鞋款失败' });
  }
});

// 修改鞋款
app.put('/api/shoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      collab,
      colorway,
      nickname,
      price,
      original_price,
      rating,
      review_count,
      release_date,
      style_code,
      image_url,
      description,
      story,
      specs,
      tags,
    } = req.body;

    const result = await pool.query(
      `UPDATE shoes SET
        name = $1, brand = $2, collab = $3, colorway = $4, nickname = $5,
        price = $6, original_price = $7, rating = $8, review_count = $9,
        release_date = $10, style_code = $11, image_url = $12,
        description = $13, story = $14, specs = $15, tags = $16,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $17
      RETURNING *`,
      [
        name,
        brand,
        collab || null,
        colorway,
        nickname || null,
        price,
        original_price || null,
        rating || 0,
        review_count || 0,
        release_date || null,
        style_code || null,
        image_url || null,
        description || null,
        story || null,
        JSON.stringify(specs || []),
        tags || [],
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到该鞋款' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('修改鞋款失败:', err.message);
    res.status(500).json({ error: '修改鞋款失败' });
  }
});

// 删除鞋款
app.delete('/api/shoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM shoes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到该鞋款' });
    }

    res.json({ message: '删除成功', deleted: result.rows[0] });
  } catch (err) {
    console.error('删除鞋款失败:', err.message);
    res.status(500).json({ error: '删除鞋款失败' });
  }
});

// ───────────────────────────────────────────────────────────────
// 情侣照片站 — 3 个路由
// 照片存 public/photos/{me,ta}/ ，通过静态文件服务直接访问
// ───────────────────────────────────────────────────────────────
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import multer from 'multer';
import sharp from 'sharp';
import exifr from 'exifr';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PHOTO_ROOT = path.join(__dirname, '..', 'public', 'photos');
const PERSON_DIRS = { me: path.join(PHOTO_ROOT, 'me'), ta: path.join(PHOTO_ROOT, 'ta') };

// 确保目录存在（首次启动）
for (const d of Object.values(PERSON_DIRS)) {
  if (!fsSync.existsSync(d)) fsSync.mkdirSync(d, { recursive: true });
}

// 静态服务照片目录（让 express 直接能访问 /photos/me/xxx.jpg）
app.use('/photos', express.static(path.join(__dirname, '..', 'public', 'photos')));

// multer：接收原始文件到内存，后续 sharp 处理后存磁盘
const storage = multer.memoryStorage();
const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024, files: 300 }, // 20MB/张，最多 300 张
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpe?g|png|webp|heic|gif)$/i.test(file.mimetype)) cb(null, true);
    else cb(new Error(`不支持的格式: ${file.mimetype}`));
  },
});

// 前端压缩到 1920px/q=0.82 是 500KB 左右，但后端还是再压一次（双保险）
async function saveImage(buf, person, exifDate) {
  // 从 EXIF 拿日期，否则用 lastModified，再否则今天
  let dateStr;
  if (exifDate instanceof Date && !isNaN(exifDate)) {
    dateStr = exifDate.toISOString().slice(0, 10);
  } else {
    dateStr = new Date().toISOString().slice(0, 10);
  }
  const dir = PERSON_DIRS[person] ?? PERSON_DIRS.me;
  const hash = crypto.createHash('md5').update(buf).digest('hex').slice(0, 10);
  const fname = `${dateStr}_${hash}.jpg`;
  const fpath = path.join(dir, fname);

  // sharp 压到 1920px, q=0.82, JPEG 渐进
  const out = await sharp(buf)
    .rotate() // 根据 EXIF Orientation 自动摆正
    .resize(1920, null, { withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(fpath);

  return {
    date: dateStr,
    url: `/photos/${person}/${fname}`,
    size: out.size,
  };
}

// POST /api/photos/upload — 批量上传
// form-data: person = "me" | "ta"，files = 多个文件
app.post('/api/photos/upload', uploadMiddleware.array('files', 300), async (req, res) => {
  try {
    const person = req.body.person === 'ta' ? 'ta' : 'me';
    const files = req.files || [];

    if (files.length === 0) return res.status(400).json({ error: '没有文件' });

    const results = [];
    const errors = [];

    // 并发上限 5（Promise pool）
    const concurrency = 5;
    let idx = 0;
    const workers = Array.from({ length: concurrency }, async () => {
      while (idx < files.length) {
        const i = idx++;
        const file = files[i];
        try {
          const exif = await exifr.parse(file.buffer, ['DateTimeOriginal']).catch(() => null);
          const info = await saveImage(file.buffer, person, exif?.DateTimeOriginal ?? null);
          results.push(info);
        } catch (e) {
          errors.push({ name: file.originalname, error: e.message });
        }
      }
    });
    await Promise.all(workers);

    // 按日期聚合这次上传的 count，返回给前端直接更新热力图
    const dateCounts = {};
    for (const r of results) dateCounts[r.date] = (dateCounts[r.date] || 0) + 1;

    res.json({
      person,
      uploaded: results.length,
      errors: errors.length,
      dateCounts,
      files: results,
    });
  } catch (err) {
    console.error('上传失败:', err.message);
    res.status(500).json({ error: '上传失败', detail: err.message });
  }
});

// GET /api/photos/aggregate — 按天聚合两个人的照片数
// 返回 [{ date: "2026-01-24", count: 3 }, ...] — 直接喂给 ContributionSkyline
app.get('/api/photos/aggregate', async (req, res) => {
  try {
    const counts = {}; // { "2026-01-24": 3 }

    for (const [person, dir] of Object.entries(PERSON_DIRS)) {
      if (!fsSync.existsSync(dir)) continue;
      const files = await fs.readdir(dir);
      for (const f of files) {
        // 文件名格式: 2026-01-24_a1b2c3d4e5.jpg
        const m = /^(\d{4}-\d{2}-\d{2})/.exec(f);
        if (m) counts[m[1]] = (counts[m[1]] || 0) + 1;
      }
    }

    const data = Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    res.json({
      total: data.reduce((s, d) => s + d.count, 0),
      days: data.length,
      data,
    });
  } catch (err) {
    console.error('聚合失败:', err.message);
    res.status(500).json({ error: '聚合失败' });
  }
});

// GET /api/photos/:date — 某天的所有照片 URL（分 me/ta）
app.get('/api/photos/day/:date', async (req, res) => {
  try {
    const { date } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: '日期格式 YYYY-MM-DD' });

    const photos = {};
    for (const [person, dir] of Object.entries(PERSON_DIRS)) {
      if (!fsSync.existsSync(dir)) continue;
      const files = await fs.readdir(dir);
      photos[person] = files
        .filter((f) => f.startsWith(date))
        .sort()
        .map((f) => `/photos/${person}/${f}`);
    }

    res.json({ date, photos });
  } catch (err) {
    console.error('按天查询失败:', err.message);
    res.status(500).json({ error: '按天查询失败' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 后端服务器运行在 http://localhost:${PORT}`);
});
