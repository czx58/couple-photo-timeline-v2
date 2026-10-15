import pool from './db.js';

const kobeShoe = {
  name: 'Zoom Kobe 4 Protro',
  brand: 'Nike',
  collab: 'UNDEFEATED',
  colorway: "'Lakers' 湖人配色",
  nickname: '湖人联名',
  price: 2799,
  originalPrice: 1399,
  rating: 9.4,
  reviewCount: 566,
  releaseDate: '2024-05-15',
  styleCode: 'FQ3545-500',
  images: [{ url: '/kobe4-lakers-side.jpg' }],
  description:
    '这双 UNDEFEATED x Nike Zoom Kobe 4 Protro "Lakers" 联名鞋款是 UNDEFEATED 与 Nike 为致敬科比·布莱恩特及其辉煌的洛杉矶湖人队生涯而打造的诚意之作。',
  story:
    '这双 UNDEFEATED x Nike Zoom Kobe 4 Protro "Lakers" 联名鞋款是 UNDEFEATED 与 Nike 为致敬科比·布莱恩特及其辉煌的洛杉矶湖人队生涯而打造的诚意之作。鞋款采用了经典的紫金湖人队配色，细节处蕴含了 UNDEFEATED 标志性的军事美学与街头风格。\n\n此次联名旨在纪念科比在球场上的卓越成就与精神遗产，将篮球文化与街头潮流深度融合，为球迷与鞋迷提供了一款兼具纪念意义与实战性能的特别单品。\n\nKobe 4 是科比签名鞋系列中的经典之作，以其轻量化设计和出色的赛场性能著称。Protro 版本在保留原版设计精髓的同时，对中底科技和鞋面材质进行了现代化升级。',
  specs: [
    { label: '鞋面材质', value: '合成革 + 织物', icon: 'layers' },
    { label: '中底科技', value: '全掌 Zoom Air', icon: 'zap' },
    { label: '外底类型', value: '橡胶耐磨外底', icon: 'hexagon' },
    { label: '适合场地', value: '室内/室外', icon: 'map-pin' },
    { label: '鞋帮高度', value: '低帮', icon: 'move-vertical' },
    { label: '闭合方式', value: '系带', icon: 'link' },
  ],
  tags: ['联名款', '科比系列', '湖人配色', '实战篮球鞋', '限量发售'],
};

async function seedDatabase() {
  try {
    console.log('🌱 开始导入种子数据...');

    // 清空旧数据，确保只保留当前档案条目
    await pool.query('TRUNCATE TABLE shoes RESTART IDENTITY');
    console.log('🧹 已清空旧数据');

    const result = await pool.query(
      `INSERT INTO shoes (
        name, brand, collab, colorway, nickname, price, original_price,
        rating, review_count, release_date, style_code, image_url,
        description, story, specs, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id`,
      [
        kobeShoe.name,
        kobeShoe.brand,
        kobeShoe.collab || null,
        kobeShoe.colorway,
        kobeShoe.nickname || null,
        kobeShoe.price,
        kobeShoe.originalPrice || null,
        kobeShoe.rating,
        kobeShoe.reviewCount,
        kobeShoe.releaseDate,
        kobeShoe.styleCode,
        kobeShoe.images[0]?.url || null,
        kobeShoe.description,
        kobeShoe.story,
        JSON.stringify(kobeShoe.specs),
        kobeShoe.tags,
      ]
    );

    if (result.rows.length > 0) {
      console.log(`✅ 已导入: ${kobeShoe.brand} ${kobeShoe.name} ${kobeShoe.colorway}`);
    }

    console.log('🎉 种子数据导入完成');
  } catch (err) {
    console.error('❌ 导入失败:', err.message);
  } finally {
    await pool.end();
  }
}

seedDatabase();
