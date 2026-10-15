import pool from './db.js';

const ieltsQuestions = [
  {
    topic: 'Describe a person you admire',
    question: 'Describe a person you admire.',
    bulletPoints: [
      'Who this person is',
      'How you know this person',
      'What this person does',
      'And explain why you admire this person',
    ],
    category: 'person',
  },
  {
    topic: 'Describe a place you visited when you were a child',
    question: 'Describe a place you visited when you were a child.',
    bulletPoints: [
      'Where this place is',
      'When you went there',
      'What you did there',
      'And explain why you remember this place',
    ],
    category: 'place',
  },
  {
    topic: 'Describe a memorable event',
    question: 'Describe a memorable event you have attended.',
    bulletPoints: [
      'What event it was',
      'When and where it was held',
      'Who you went with',
      'And explain why it was memorable',
    ],
    category: 'event',
  },
  {
    topic: 'Describe an important object',
    question: 'Describe an object that is important to you.',
    bulletPoints: [
      'What the object is',
      'Where you got it',
      'How often you use it',
      'And explain why it is important to you',
    ],
    category: 'object',
  },
  {
    topic: 'Describe a skill you want to learn',
    question: 'Describe a skill you would like to learn in the future.',
    bulletPoints: [
      'What skill it is',
      'Why you want to learn it',
      'How you plan to learn it',
      'And explain how this skill will help you',
    ],
    category: 'object',
  },
];

async function seedIeltsDatabase() {
  try {
    console.log('🌱 开始导入雅思口语题库...');

    let insertedCount = 0;
    let skippedCount = 0;

    for (const q of ieltsQuestions) {
      const checkResult = await pool.query(
        'SELECT id FROM ielts_questions WHERE question = $1',
        [q.question]
      );

      if (checkResult.rowCount > 0) {
        skippedCount++;
        continue;
      }

      await pool.query(
        `INSERT INTO ielts_questions (topic, question, bullet_points, category)
         VALUES ($1, $2, $3, $4)`,
        [q.topic, q.question, q.bulletPoints, q.category]
      );
      insertedCount++;
      console.log(`✅ 已导入: ${q.topic}`);
    }

    console.log(`🎉 雅思口语题库导入完成：新增 ${insertedCount} 道，跳过 ${skippedCount} 道`);
  } catch (err) {
    console.error('❌ 导入失败:', err.message);
  } finally {
    await pool.end();
  }
}

seedIeltsDatabase();
