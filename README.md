# 岩点 · 攀岩教学笔记

**线上地址：<https://climb-site.pages.dev>** ｜ 仓库：<https://github.com/ylsxai/climb-site>

一个纯静态的攀岩教学站。内容全部是 Markdown 文件，`npm run build` 出来是一堆 HTML，扔到任何静态托管上就能跑（Cloudflare Pages / Vercel / GitHub Pages 都行）。

push 到 `main` 后 Cloudflare 自动重新构建上线，不用手动部署。

**为什么是静态的**：没有数据库、没有服务器要维护，也不会因为本机断电掉线。后面要加登录、打卡、会员，再单独接 Supabase（见文末路线图），不需要推倒重来。

---

## 本地跑起来

```bash
cd climb-site
npm install
npm run dev        # http://localhost:3100
```

改文件会热更新，不用重启。

想看看"真正发出去长什么样"，先构建再预览静态产物（和线上完全一致）：

```bash
npm run build
npm run preview    # http://127.0.0.1:3101
```

## 目录结构

```
climb-site/
├── app/                 # 页面
│   ├── page.jsx            首页
│   ├── tutorials/          教程列表 + [slug] 详情
│   ├── routes/             线路库
│   ├── videos/             视频
│   ├── about/              关于
│   └── globals.css         全站配色与排版（改颜色只改这里）
├── components/          # 页头页脚
├── lib/content.js       # 读 Markdown 的唯一入口
├── content/
│   ├── posts/           # 教程文章（.md）
│   ├── routes/          # 线路笔记（.md）
│   └── videos.json      # 视频列表
├── scripts/
│   ├── import-knowledge.mjs   # 把 knowledge/inbox 批量导成教程
│   └── optimize-images.mjs    # 图片转 webp
└── public/images/       # 图片放这里
```

---

## 加一篇教程

在 `content/posts/` 新建一个 `.md`，文件名就是网址（`重心与脚法.md` → `/tutorials/重心与脚法/`）。

```markdown
---
title: 标题
summary: 一句话摘要，会出现在列表和搜索描述里
date: 2026-10-20
level: 入门          # 入门 / 进阶 / 高级
tags: [基础, 脚法]
---

正文从 H2 开始写，标题不用再重复一遍。
```

**要注意的**：正文里**不要再写一遍 H1 标题**，页面自己会渲染 `title`。

## 加一条线路

`content/routes/` 新建 `.md`，多了 `grade` 和 `location`：

```markdown
---
title: 内角平衡
grade: V3                # 线路库按 V0–V7 自动排序
location: 岩馆 B 区 · 内角
date: 2026-10-14
---

**动作要点**
- ...
```

## 加一个视频

编辑 `content/videos.json`，把 `bvid` 填上（B 站链接里 `BV` 后面那一串）：

```json
{ "id": "ep03", "title": "第三期 · 三种踩法", "summary": "...", "date": "2026-11-01", "bvid": "BV1xx411c7mD" }
```

`bvid` 留空会显示占位框，填上就自动嵌播放器。

---

## 从老笔记批量导入

站外写的笔记放在 `../knowledge/inbox/`（工作区里已有的那个目录），然后：

```bash
npm run import            # 导入还没导过的
npm run import -- --dry   # 先看会写哪些文件，不动手
npm run import -- --force # 覆盖同名
```

脚本会剥掉 YAML 头和 HTML 注释，从第一个标题取标题，自动补一段摘要。**导入后建议自己过一遍 frontmatter**：`date` 会用当天日期，`level` 默认"入门"，这两项自动推断不准。

## 图片

图片放 `public/images/`，然后：

```bash
npm run images            # 转 webp（宽≤1600）+ 生成 @640 缩略图
```

需要本机装 ImageMagick（`winget install ImageMagick.ImageMagick`）。没装脚本会提示，不会坏。

---

## 部署到 Cloudflare Pages

1. 把这个 `climb-site` 目录推到一个 GitHub 仓库
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → 连仓库
3. 构建配置：
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
   - 环境变量：`NODE_VERSION=24`
4. 保存，等第一次构建完就有域名了

Vercel 也一样：导入仓库，它会自己识别 Next.js，静态导出直接生效。

**自己有服务器**就不用管这些，`npm run build` 后把 `out/` 整个目录丢上去即可。

---

## 上线前必须改的 3 个地方

| 位置 | 改什么 |
|---|---|
| `app/layout.jsx` | `metadata` 里的标题和描述 |
| `app/about/page.jsx` | 邮箱 `hello@example.com` |
| `content/videos.json` | 填真实的 `bvid` |

另外 `app/page.jsx` 首页那段立场引言是示例文案，换成你自己的话。

---

## 路线图

现在这版是 **M0：内容展示**，能看能分享，没有用户系统。

- [ ] **M1 上线** — 部署 + 接 Umami 统计（免费，看哪些文章真有人看）
- [ ] **M2 用户** — Supabase 登录、文章收藏、训练打卡日历
- [ ] **M3 变现与社区** — 会员内容、评论、作品投稿

M2 开始需要网络请求，做法是把 `next.config.mjs` 的 `output: 'export'` 去掉，改成 Vercel/Cloudflare 的 SSR 部署。数据表先设计好、只开有用的两张，别一次全开。

## 已知限制

- 没有搜索（内容多了再加，简单的客户端全文搜索就够）
- 没有评论（M3 再说，先别引第三方评论系统）
- 中文路径在部分老托管平台上可能变成乱码，遇到就换成英文文件名
