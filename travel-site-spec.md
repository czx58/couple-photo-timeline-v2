# Travel Website — Product Spec v0.2

## 1. 一句话定义

**一个让你探索世界、像拼拼图一样创造旅行，并用 AI 将它变成真实旅行计划的可视化旅游网站。**

英文：

> A visual travel tool where you explore the world, build your trip like a puzzle, and turn it into a real itinerary with AI.

核心不是：

> “AI 帮你生成旅游攻略。”

而是：

> “你先创造旅行，AI 再把你的想法变成现实可执行的旅行计划。”

---

## 2. 产品体验曲线

这是整个网站的产品骨架。所有功能都服务于这条曲线。

```
WEBSITE
  │
  ▼
"Where do you want to go?"
  │
  ▼
🌍 EXPLORE      ← 空白地图，自由探索
  │
  ▼
🧩 COLLECT      ← 点击地点，收集拼图
  │
  ▼
🧩 COMPOSE      ← 拖拽组合，建立关系
  │
  ▼
🧩 PLAY          ← 排列、删除、合并、调整
  │
  ▼
BUILD MY TRIP   ← 用户确认："就是它了"
  │
  ▼
🤖 AI            ← 把用户的创造翻译为现实
  │
  ▼
🗺️ + 📅 + 🤖    ← 地图 + 时间线 + AI 指南
  │
  ▼
YOUR TRIP       ← 可保存、可分享、可出发
```

### 每个阶段的核心任务

| 阶段 | 用户状态 | 产品任务 |
|---|---|---|
| EXPLORE | "我看看地图" | 提供空白画布，让用户自由 zoom / pan / click |
| COLLECT | "这个不错" | 把地点变成轻量 Puzzle Card，滑入 Trip Tray |
| COMPOSE | "它们应该在一起" | 在 Puzzle Board 上拖拽建立空间关系 |
| PLAY | "这样排对吗" | 排列、删除、合并，AI 只给轻提示 |
| BUILD | "帮我变成计划" | 触发 AI，把拼图翻译成现实行程 |
| YOUR TRIP | "我得到了我的旅行" | 输出 Map + Timeline + AI Guide |

---

## 3. 产品核心理念

### 3.1 Map is the Canvas

地图是整个网站的主角。

不是：

> 左边地图 + 右边功能栏

而是：

> 整个网站就是一张可以探索和操作的地图。

Search、Card、Trip Tray、AI 都应该服务于地图，不能抢走地图的视觉中心。

### 3.2 Everything is a Puzzle

旅行中的对象都可以成为 Puzzle：

```
Country
  ↓
Region
  ↓
City
  ↓
Attraction
  ↓
Experience
  ↓
Time Block
```

例如：

```
🇯🇵 Japan
  └── Kansai
       └── Kyoto
            ├── Kiyomizu-dera
            ├── Arashiyama
            └── Uji
```

这些对象可以：

- Explore
- Select
- Drag
- Combine
- Split
- Rearrange

Puzzle 不是视觉装饰，而是产品的交互语言。

### 3.3 User owns the dream. AI owns the constraints.

用户拥有：

> “我想去哪里。”

AI 负责告诉用户：

> “现实世界是否允许这样做。”

例如用户说：

> “我就是想去富士山。”

AI 不应该：

> ❌ “我认为富士山不值得去。”

但是 AI 必须说：

> ⚠️ “当天交通中断。”
> ⚠️ “景点当天关闭。”
> ⚠️ “按照目前时间无法完成。”

### 3.4 用户的“不选择”同样重要

用户删除 Osaka，本身就是一种表达：

- 太拥挤
- 太贵
- 不感兴趣
- 太远
- 去过了
- 临时改变想法

这不是强制问卷。用户行为本身就是信息。

所以：

> “喜欢什么”是信息。
> “不要什么”同样是信息。

### 3.5 AI should assist, not interrupt.

AI 是旅行伙伴，不是旅行老板。

在 Puzzle 阶段，AI 可以：

- 发现明显问题
- 提供轻提示
- 提供事实信息

例如：

> 💡 Fuji → Kyoto takes around 2h 30m.
> ⚠️ This route may be a little tight.

AI 不应该：

- ❌ 自动移动用户的地点
- ❌ 强迫删除景点
- ❌ 不断弹窗
- ❌ 一开始就告诉用户“最佳路线”

---

## 4. 用户真正做的事情

用户不是：

> “填写旅游需求 → AI 给我攻略。”

而是：

```
Explore → Discover → Collect → Compose → Arrange → Build
```

也就是：

1. **Explore**：在地图上探索世界
2. **Discover**：发现自己可能感兴趣的地方
3. **Collect**：把地点变成 Puzzle Piece
4. **Compose**：把 Puzzle Pieces 组合起来
5. **Arrange**：排列自己的旅行
6. **Build**：让 AI 把这个旅行想法变成现实计划

---

## 5. 核心体验：Explore → Play → Plan

我们已经确定：

> ✅ Explore → Play → Plan

而不是：

> ❌ Search → Form → Generate

这是产品最重要的区别。

---

## 6. 首页

首页应该极简。

不是大量介绍：

> Features / Pricing / AI / Weather / Maps …

而是非常直接地告诉用户：

> This is a travel tool.
> Where do you want to go?

或者类似：

> Build your trip like a puzzle.

整个屏幕非常干净。中间只有一句主标题，下面可能只有一句很小的辅助文字，例如：

> Explore. Build. Go.

或：

> Build your trip like a puzzle.

甚至可以什么都没有。

背景可以是一张非常淡、非常抽象的世界地图纹理，但不要真的出现一个完整地图。

用户点击标题、搜索框或页面任意主要区域，即可进入地图。

首页的任务只有两个：

1. 让用户 3 秒理解这是干什么的
2. 让用户想进入地图玩

而不是在首页完成复杂规划。

---

## 7. 地图体验

进入以后，是一张巨大的空白地图。

这是非常重要的决定。

我们没有选择：

> AI 立刻给你推荐 5 个地方。

也没有选择：

> 首页输入 Japan → 自动生成攻略。

而是：

> 给用户一张空白画布，让用户自己开始探索。

地图上初始状态没有推荐城市、没有景点标记、没有 AI 提示。

用户会产生：

> “好，我可以开始探索了。”

---

## 8. 搜索

Search 存在，但它不是主角。

我们定义成：

> Map-first, Search-assisted

顶部可以有一个很小的 Search Bar：

> 🔍 Search a place…

但它只占很小空间。

视觉权重应该：

> Map >>> Search

用户主要应该：

> Zoom → Pan → Click → Explore

而不是：

> Search → Search → Search

---

## 9. 地点交互与 Puzzle Card

用户点击 Kyoto，不会离开地图。

而是在地图上出现一个：

> 🧩 Puzzle Card

例如：

```
┌──────────────────┐
│      🧩 Kyoto    │
│                  │
│      Japan       │
│      2–3 Days    │
│                  │
│   [Add to Trip]  │
└──────────────────┘
```

关键设计：

- 这个 Card 本身就是一个 Puzzle
- 用户可以把它拖向一侧，展开成 Detail Panel
- 地图仍然在那里，用户可以一边看详情一边继续探索

交互路径：

> Puzzle Card → Drag → Detail Panel

不是两个完全独立的组件。

---

## 10. Explore Mode

这是网站默认状态。

用户可以：

- 移动地图
- 缩放
- 点击区域
- 点击城市
- 点击景点
- 查看 Puzzle Card
- 展开 Detail
- 收集地点

此时 AI 不应该不断打扰用户。用户主要是在 Explore。

---

## 11. Trip Tray

用户点击 Add / Collect 以后，地点进入 My Trip。

但不是一个占据屏幕一半的 Sidebar，而是底部一个很小的 Trip Tray：

```
┌──────────────────────────────────────────┐
│ My Trip                                  │
│ 🧩 Tokyo   🧩 Fuji   🧩 Kyoto   +2       │
└──────────────────────────────────────────┘
```

默认情况下，Map 仍然占绝大多数空间。

用户不会一添加第二个地点就被迫进入路线规划。用户自己决定什么时候开始规划。

---

## 12. Explore → Plan

用户把 Trip Tray 向上展开，进入 Plan Mode。

这解决了一个核心问题：

> 探索和规划不应该互相打扰。

---

## 13. Plan Mode 与 Puzzle Board

Plan Mode 首先不是传统 Timeline，而是：

> 🧩 Puzzle Board

例如：

```
          🧩 Tokyo
  🧩 Fuji          🧩 Kyoto
          🧩 Nara
              🧩 Osaka
```

用户可以：

- 拖动
- 排列
- 连接
- 删除
- 拆分
- 合并

核心感受应该是：

> “我正在创造一趟旅行。”

而不是：

> “我正在填写行程表。”

### 时间不是第一阶段的核心

Timeline 不应该一开始就出现。

因为用户首先应该：

> 创造旅行

而不是：

> “Day 1 去哪？”

所以：

> Puzzle Stage：Place → Relationship → Route

用户觉得：

> “好了，我拼完了。”

再进入：

> Build My Trip

---

## 14. Build My Trip

这是整个网站最重要的转折点。

用户完成 Puzzle：

```
Tokyo
  ↓
Fuji
  ↓
Kyoto
  ↓
Nara
  ↓
Osaka
```

然后点击：

> Build My Trip

AI 开始工作。

注意：

> AI 不是创造用户的旅行。
> AI 是把用户创造出来的旅行翻译成现实世界可执行的旅行。

AI 开始计算：

- 地理关系
- 路线
- 交通
- 时间
- 停留时间
- 景点安排
- 天气
- 用户偏好
- 行程强度

---

## 15. 最终结果

最终不是一篇普通 AI 攻略，而是：

> Your Trip

包含三个核心层：

### 🗺️ Map

现实空间。

```
Tokyo → Fuji → Kyoto → Nara → Osaka
```

### 📅 Timeline

现实时间。

```
Day 1: Tokyo
Day 2: Tokyo → Fuji
Day 3: Kyoto
Day 4: Kyoto + Nara
Day 5: Osaka
```

### 🤖 AI Guide

旅行解释和建议。

- Why this route works
- What to wear
- Weather
- Transportation
- Things to watch out for
- Recommended duration

---

## 16. Save / Share / Export

最终页面三个动作都可以存在：

- Save
- Share
- Export

但核心动作应该是：

> Save My Trip

因为这个 Trip 不是一次生成、看完就结束的网页。它可以：

> 创建 → 修改 → 重新生成 → 出发前查看

---

## 17. 技术方案

产品体验优先，技术方案沿用之前讨论的结果：

- **框架**：Next.js + React 全栈
- **样式**：Tailwind CSS
- **地图**：高德地图 JS API
- **天气**：和风天气 API
- **AI**：DeepSeek API

### 17.1 地图相关

- 使用高德地图作为地图底层
- 地图主题是视觉核心
- 根据当前时间切换浅色/深色主题（白天浅色，晚上深色）
- 地图初始状态为空，不预置景点标记

### 17.2 数据相关

- 接入高德/百度地图 POI API 获取基础地理数据
- 内置部分热门城市种子数据
- 允许用户提交和纠错（UGC 长期维护）
- 天气数据来自和风天气 API

### 17.3 AI 相关

- 使用 DeepSeek API 生成攻略、路线建议、穿衣建议等
- AI 主要在 Build My Trip 阶段工作
- Puzzle 阶段 AI 只提供轻提示

### 17.4 认证与保存

- MVP 阶段不强制登录，数据可暂存浏览器本地
- 登录/云端同步放到后续版本

---

## 18. MVP 范围建议

第一版先实现最核心的体验曲线：

1. 极简首页：Where do you want to go?
2. 空白地图探索
3. 点击城市出现 Puzzle Card
4. Add 到 Trip Tray
5. Trip Tray 上滑进入 Puzzle Board
6. 在 Puzzle Board 上拖拽排列
7. Build My Trip 调用 AI 生成结果
8. 结果页：Map + Timeline + AI Guide
9. Save / Share / Export 基础功能

后续版本再扩展：

- 多层 Puzzle（国家 → 地区 → 城市 → 景点）
- AI 轻提示系统
- 用户登录与云端同步
- 天气与穿衣建议
- 多人协作规划
- 导出 PDF / 日历文件

---

## 19. 成本与风险

- 高德地图 API 需要开发者认证，个人开发者额度有限
- 和风天气免费订阅约 1,000 次/天，适合 MVP 阶段
- DeepSeek API 按调用量计费，需控制生成频率
- MVP 阶段应以本地缓存为主，减少 API 调用
- 大规模商用可能需要企业认证或购买服务

---

## 20. 部署方案

### 20.1 服务器信息

- **服务商**：腾讯云 Lighthouse
- **地域**：东京
- **公网 IP**：43.167.238.222
- **配置**：2核 2G
- **操作系统**：OpenCloudOS 9.4
- **域名**：暂无，先使用 IP 访问

### 20.2 部署架构

沿用之前项目的成功经验：

> **Nginx + PM2**，不使用宝塔面板。

原因：OpenCloudOS 9.4 与宝塔面板安装脚本存在兼容性问题（缺少 `/etc/redhat-release` 文件），因此采用手动部署方式。

### 20.3 端口配置

服务器防火墙需要开放以下 TCP 端口：

- `22`：SSH 远程连接
- `80`：HTTP
- `443`：HTTPS
- `3000`：Next.js 应用开发/测试端口（或 PM2 运行端口）

### 20.4 部署流程概要

1. 本地开发完成后，将代码推送到 GitHub
2. 通过 SSH 登录服务器
3. 安装 Node.js、PM2、Nginx
4. 拉取代码并安装依赖
5. 配置环境变量（API Key 等）
6. 使用 PM2 启动 Next.js 服务
7. 使用 Nginx 反向代理到本地端口
8. 配置防火墙和安全组

### 20.5 环境变量

服务器上需要配置的环境变量：

- `NEXT_PUBLIC_GAODE_KEY`：高德地图 Web 端 Key
- `DEEPSEEK_API_KEY`：DeepSeek API Key
- `QWEATHER_KEY`：和风天气 Key
- `SESSION_SECRET`：用户会话密钥（如后续加入登录功能）

---

## 21. 产品定位总结

如果把这些讨论压缩成一句放在 spec 首页的话：

> A visual travel tool that lets you explore the world, build your trip like a puzzle, and turn it into a real itinerary with AI.

中文：

> 一个让你探索世界、像拼拼图一样创造旅行，并用 AI 将它变成真实旅行计划的可视化旅游网站。
