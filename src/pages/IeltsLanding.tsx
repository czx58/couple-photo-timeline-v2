import {
  ArrowRight,
  Check,
  Mic,
  Clock,
  FileText,
  BarChart3,
  ChevronDown,
  Star,
  Shield,
  Smartphone,
  Zap,
  Users,
  User,
  LogOut,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const stats = [
  { value: '当季题库', label: '持续更新' },
  { value: '60 秒', label: '模拟真实准备时间' },
  { value: '4 项', label: '雅思官方评分维度' },
  { value: '¥12/月', label: '无限练习' },
];

const steps = [
  {
    number: '01',
    title: '抽一道当季真题',
    description: '从雅思当季 Part 2 题库随机选题，覆盖人物、地点、事件、物品四大类。',
  },
  {
    number: '02',
    title: '准备 60 秒，开口说 2 分钟',
    description: '完整模拟真实考试流程，用手机就能练，不用预约、不用下载 App。',
  },
  {
    number: '03',
    title: '拿到评分报告',
    description: '按雅思四项标准打分，标出语法错误，给词汇升级建议，附参考优化版本。',
  },
];

const comparisonRows = [
  {
    before: '自己对着镜子练，不知道对错',
    after: '每次练习都有完整评分和纠错',
  },
  {
    before: '外教一节课几百块，练不了几次',
    after: '¥12/月无限练，反复说到顺口',
  },
  {
    before: '上了考场才发现流程不熟悉',
    after: '从准备到作答，完全模拟考试',
  },
];

const trustBadges = [
  { icon: Smartphone, label: '无需下载 App', desc: '浏览器直接打开' },
  { icon: Zap, label: '即时反馈', desc: '说完 5 秒出报告' },
  { icon: Shield, label: '隐私保护', desc: '练习记录仅你可见' },
  { icon: Users, label: '面向中国学生', desc: '针对常见弱项优化' },
];

const testimonials = [
  {
    name: 'Lily',
    target: '目标 6.5，申请英国硕士',
    content:
      '之前一直不敢开口，也不知道自己说得怎么样。这个可以反复练，还能标出语法错误，比我自己录音有效率多了。',
    score: 5,
  },
  {
    name: 'Jason',
    target: '目标 7.0，外企跳槽',
    content:
      'Part 2 卡片题一直是弱项，60 秒准备倒计时让我适应了考试节奏。练了 20 多道题后，明显流利很多。',
    score: 5,
  },
  {
    name: '小雨',
    target: '目标 6.0，首次考雅思',
    content:
      '免费试了 3 道题，觉得报告很详细，特别是词汇替换建议。¥12 一个月对学生很友好。',
    score: 5,
  },
];

const faqs = [
  {
    question: '这是 AI 评分吗？准确吗？',
    answer:
      '评分基于雅思官方四项标准，从流利度、词汇、语法、发音维度给出参考分数。它不是真实考官打分，但能帮你快速定位问题、反复打磨表达。',
  },
  {
    question: '题库是当季真题吗？',
    answer:
      '我们会根据雅思口语换题季持续更新题库，目前覆盖人物、地点、事件、物品四大类高频话题。',
  },
  {
    question: '免费版和付费版有什么区别？',
    answer:
      '新用户可以免费完整体验 3 道题，包括评分报告。订阅后 ¥12/月可无限练习，解锁全部题库和历史记录。',
  },
  {
    question: '手机能用吗？',
    answer: '可以。直接用浏览器打开，允许麦克风权限即可练习，无需下载 App。',
  },
  {
    question: '语音识别需要收费吗？',
    answer:
      '不需要。我们使用浏览器自带的语音识别功能，完全免费。你只需要为 DeepSeek 大模型调用支付少量费用。',
  },
  {
    question: '评分报告包含哪些内容？',
    answer:
      '每次练习你会得到：总分、四项维度分数、语法错误标红、词汇升级建议、词汇深度分析（高级词、重复词、搭配问题）以及一段参考优化回答。',
  },
  {
    question: '我可以只练某类题目吗？',
    answer:
      '可以。练习页面支持按人物、地点、事件、物品分类筛选，你可以集中突破自己薄弱的题型。',
  },
  {
    question: '数据会保存多久？',
    answer:
      '练习记录会保存在你的账号下。MVP 阶段采用匿名记录，后续会加入账号系统方便长期追踪进步曲线。',
  },
];

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px]">
      {/* Phone frame */}
      <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
        <div className="bg-white rounded-[2.5rem] overflow-hidden">
          {/* Notch */}
          <div className="h-7 bg-gray-900 mx-auto w-24 rounded-b-2xl"></div>

          {/* App content */}
          <div className="p-5 pt-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-medium text-gray-400">IELTS Speak</div>
              <div className="text-xs text-indigo-600 font-medium">Part 2</div>
            </div>

            {/* Question card */}
            <div className="bg-indigo-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-gray-900 leading-snug">
                Describe a person you admire.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
                <li>• Who this person is</li>
                <li>• How you know them</li>
                <li>• What they do</li>
                <li>• Why you admire them</li>
              </ul>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-100 flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-600">52</span>
              </div>
            </div>

            {/* Mic button */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Mic className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Transcript */}
            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <p className="text-xs text-gray-600 leading-relaxed">
                I want to talk about{' '}
                <span className="text-red-600 bg-red-50 rounded px-0.5">my mother</span>. She is
                very kind and{' '}
                <span className="text-red-600 bg-red-50 rounded px-0.5">help me a lot</span>...
              </p>
            </div>

            {/* Score preview */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'FC', value: '5.5' },
                { label: 'LR', value: '5.0' },
                { label: 'GRA', value: '4.5' },
                { label: 'PR', value: '5.5' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-bold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-100 rounded-full blur-2xl opacity-60"></div>
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-100 rounded-full blur-2xl opacity-60"></div>
    </div>
  );
}

function ScoreReportMockup() {
  return (
    <div className="bg-white rounded-2xl border shadow-lg p-6 max-w-sm">
      <div className="flex items-center justify-between mb-5">
        <h4 className="font-semibold text-gray-900">评分报告</h4>
        <span className="text-2xl font-bold text-indigo-600">5.0</span>
      </div>

      <div className="space-y-3 mb-5">
        {[
          { label: '流利度与连贯性', score: 80 },
          { label: '词汇资源', score: 65 },
          { label: '语法准确性', score: 55 },
          { label: '发音', score: 80 },
        ].map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{item.label}</span>
              <span className="text-gray-900 font-medium">{item.score}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${item.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-red-50 rounded-xl p-3 mb-3">
        <p className="text-xs text-red-700 line-through">help me a lot</p>
        <p className="text-xs text-green-700 font-medium mt-1">helps me a lot</p>
      </div>

      <div className="bg-green-50 rounded-xl p-3">
        <p className="text-xs text-green-700">词汇升级：very kind → incredibly kind</p>
      </div>
    </div>
  );
}

function AuthNav() {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          to="/ielts/history"
          className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
        >
          <User className="w-4 h-4" />
          {user.username}
        </Link>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
          title="退出登录"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">退出</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        to="/login"
        className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block"
      >
        登录
      </Link>
      <Link
        to="/register"
        className="text-sm font-medium px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        注册
      </Link>
    </div>
  );
}

export default function IeltsLanding() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-bold text-lg tracking-tight">
            IELTS Speak
          </a>
          <div className="flex items-center gap-8">
            <a href="#preview" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block">
              产品演示
            </a>
            <a href="#how" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block">
              怎么用
            </a>
            <a href="#compare" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block">
              对比
            </a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block">
              价格
            </a>
            <a
              href="/ielts"
              className="text-sm font-medium px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors hidden sm:block"
            >
              免费练 3 题
            </a>
            <AuthNav />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                雅思口语 Part 2 在线陪练
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
                练完就知道
                <br />
                自己能考几分
              </h1>

              <p className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                当季真题 · 60 秒准备 · 四项评分 · 逐句纠错
                <br />
                不用约外教，不用背模板，打开就能模拟真实考试流程。
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <a
                  href="/ielts"
                  className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white text-base font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  免费练 3 题
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#preview"
                  className="w-full sm:w-auto px-8 py-4 border border-gray-200 text-gray-700 text-base font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  先看演示
                </a>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-600" />
                  免费试 3 题
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-600" />
                  无需下载
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-600" />
                  即时出报告
                </span>
              </div>
            </div>

            {/* Right: phone mockup */}
            <div className="flex justify-center lg:justify-end">
              <PhoneMockup />
            </div>
          </div>

          {/* Stats */}
          <div className="max-w-4xl mx-auto mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden border">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 text-center">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-16 bg-gray-50 px-6 border-y">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{badge.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section id="preview" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-indigo-600 mb-3">产品演示</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              每次练习，都像真实考试
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              从抽题、准备、开口作答到拿到评分报告，完整还原雅思口语 Part 2 考试流程。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">60 秒准备倒计时</h3>
                  <p className="text-gray-500 text-sm">
                    屏幕显示倒计时，给你和真实考试一样的准备时间，提前适应紧张感。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mic className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">语音或文字作答</h3>
                  <p className="text-gray-500 text-sm">
                    可以直接开口说，也可以先写稿再朗读。基础弱的同学也能循序渐进。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">四项维度评分</h3>
                  <p className="text-gray-500 text-sm">
                    按雅思官方标准，从流利度、词汇、语法、发音分别打分，清楚知道弱项。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">原文标红 + 优化版本</h3>
                  <p className="text-gray-500 text-sm">
                    你的回答原文中标出语法和词汇问题，并给一段完整优化后的参考回答。
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center">
              <ScoreReportMockup />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-gray-50 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-indigo-600 mb-3">使用流程</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">三步开始练</h2>
            <p className="text-gray-500">像真实考试一样，但随时随地都能开始</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border">
                <span className="text-4xl font-bold text-indigo-100">{step.number}</span>
                <h3 className="text-xl font-semibold mt-4 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-indigo-600 mb-3">对比</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              自学口语，到底卡在哪？
            </h2>
            <p className="text-gray-500">我们帮你把最头疼的三个问题解决了</p>
          </div>

          <div className="border rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2 bg-gray-50 border-b">
              <div className="p-5 text-sm font-medium text-gray-500">传统的练法</div>
              <div className="p-5 text-sm font-medium text-indigo-600">在这里练</div>
            </div>
            {comparisonRows.map((row, index) => (
              <div key={index} className="grid grid-cols-2 border-b last:border-b-0">
                <div className="p-6 text-gray-600 border-r">{row.before}</div>
                <div className="p-6 text-gray-900 flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  {row.after}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-indigo-600 mb-3">核心功能</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              练一次，收获一份完整报告
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-5">
                <Mic className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">语音直接回答</h3>
              <p className="text-gray-500">点击麦克风，像考试一样开口说 1–2 分钟。</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-5">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">60 秒准备倒计时</h3>
              <p className="text-gray-500">完全还原雅思 Part 2 考试流程，提前适应节奏。</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-5">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">四项维度评分</h3>
              <p className="text-gray-500">按流利度、词汇、语法、发音分别打分，清楚知道弱项在哪。</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-5">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">逐句纠错 + 参考版本</h3>
              <p className="text-gray-500">语法错误标出，给更地道的表达，附完整优化回答。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-indigo-600 mb-3">用户反馈</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              他们已经开始练了
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border">
                <div className="flex gap-1 mb-4">
                  {[...Array(item.score)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-5 text-sm">"{item.content}"</p>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.target}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-50 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-indigo-600 mb-3">定价</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">简单定价</h2>
            <p className="text-gray-500">先免费体验，觉得有用再订阅</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border">
              <p className="text-sm font-medium text-gray-500 mb-2">免费体验</p>
              <p className="text-4xl font-bold text-gray-900 mb-6">¥0</p>
              <ul className="space-y-4 text-gray-600 text-sm">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  完整体验 3 道 Part 2 题目
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  含四项评分报告
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  含语法纠错和词汇升级
                </li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 text-white relative">
              <span className="absolute top-4 right-4 text-xs font-medium px-2 py-1 bg-indigo-600 rounded">
                推荐
              </span>
              <p className="text-sm font-medium text-gray-400 mb-2">无限练习</p>
              <p className="text-4xl font-bold mb-6">
                ¥12<span className="text-base font-normal text-gray-400">/月</span>
              </p>
              <ul className="space-y-4 text-gray-300 text-sm">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  无限 Part 2 练习
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  完整当季题库
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  历史练习记录和进步追踪
                </li>
              </ul>
              <a
                href="/ielts"
                className="block w-full mt-8 py-3 bg-white text-gray-900 text-center font-medium rounded-xl hover:bg-gray-100 transition-colors"
              >
                免费试 3 题
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-indigo-600 mb-3">常见问题</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">你可能想了解的</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-xl border overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-gray-600 leading-relaxed">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            今天就开口练一次
          </h2>
          <p className="text-gray-500 mb-10">无需下载，手机打开就能用。</p>
          <a
            href="/ielts"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-base font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            免费练 3 题
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 IELTS Speak. 个人练手项目。</p>
          <div className="flex gap-6">
            <a href="/ielts" className="hover:text-gray-900">
              开始练习
            </a>
            <a href="/ielts/history" className="hover:text-gray-900">
              练习记录
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
