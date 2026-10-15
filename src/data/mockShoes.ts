import type { Shoe } from '../types/shoe';

const kobeImage = '/kobe4-lakers-side..jpg';

export const mockShoes: Shoe[] = [
  {
    id: 'kobe-4-undefeated-lakers',
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
    images: [
      {
        id: 'side',
        url: kobeImage,
        alt: 'Nike x UNDEFEATED Zoom Kobe 4 Protro 侧面',
        angle: 'side',
      },
    ],
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
  },
  {
    id: 'placeholder-1',
    name: 'Air Jordan 1 High',
    brand: 'Jordan',
    colorway: "'Chicago' 芝加哥",
    nickname: '芝加哥元年',
    price: 1999,
    originalPrice: 1499,
    rating: 9.6,
    reviewCount: 1204,
    releaseDate: '1985-04-01',
    styleCode: '555088-101',
    images: [
      {
        id: 'side',
        url: kobeImage,
        alt: 'Air Jordan 1 High Chicago 侧面',
        angle: 'side',
      },
    ],
    description:
      'Air Jordan 1 "Chicago" 是篮球鞋历史上最具标志性的配色之一，红白黑三色组合开启了 Jordan Brand 的传奇篇章。',
    story:
      'Air Jordan 1 "Chicago" 于 1985 年首次发布，是迈克尔·乔丹 rookie 赛季穿着的元年配色。这款鞋因其违反 NBA 统一着装规定而引发的争议，以及随后 Nike 为此支付的罚款，成为了球鞋文化中最著名的故事之一。\n\n红白黑三色设计灵感来源于芝加哥公牛队，简洁而富有力量感。作为 Jordan Brand 的开山之作，Chicago 配色在每次复刻时都会引发抢购热潮，堪称球鞋收藏者的必修课。',
    specs: [
      { label: '鞋面材质', value: '全粒面皮革', icon: 'layers' },
      { label: '中底科技', value: 'Air Sole', icon: 'zap' },
      { label: '外底类型', value: '橡胶外底', icon: 'hexagon' },
      { label: '适合场地', value: '休闲/室内', icon: 'map-pin' },
      { label: '鞋帮高度', value: '高帮', icon: 'move-vertical' },
      { label: '闭合方式', value: '系带', icon: 'link' },
    ],
    tags: ['元年配色', 'Jordan 1', '芝加哥', '经典复刻'],
  },
  {
    id: 'placeholder-2',
    name: 'Dunk Low',
    brand: 'Nike',
    colorway: "'Syracuse' 雪城大学",
    nickname: '雪城 Dunk',
    price: 1299,
    originalPrice: 799,
    rating: 9.0,
    reviewCount: 892,
    releaseDate: '2020-03-14',
    styleCode: 'CU1726-101',
    images: [
      {
        id: 'side',
        url: kobeImage,
        alt: 'Nike Dunk Low Syracuse 侧面',
        angle: 'side',
      },
    ],
    description:
      'Nike Dunk Low "Syracuse" 复刻了 1985 年 NCAA 大学配色企划中的经典雪城大学配色。',
    story:
      '1985 年，Nike 为 NCAA 七所名校推出专属配色的 Dunk High，其中包括雪城大学的橙白配色。2020 年，这双经典配色以 Dunk Low 形式回归，迅速成为球鞋市场的焦点。\n\n橙白相间的配色方案简洁明快，既保留了浓厚的复古校园气息，又具备现代街头穿搭的强烈辨识度，是近年来最受欢迎的 Dunk 配色之一。',
    specs: [
      { label: '鞋面材质', value: '皮革', icon: 'layers' },
      { label: '中底科技', value: '泡棉', icon: 'zap' },
      { label: '外底类型', value: '橡胶外底', icon: 'hexagon' },
      { label: '适合场地', value: '休闲', icon: 'map-pin' },
      { label: '鞋帮高度', value: '低帮', icon: 'move-vertical' },
      { label: '闭合方式', value: '系带', icon: 'link' },
    ],
    tags: ['Dunk', '大学配色', '复古', '热门款'],
  },
];
