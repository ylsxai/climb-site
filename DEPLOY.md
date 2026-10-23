# 部署到 Cloudflare Pages

前置：`main` 分支已推到 GitHub 仓库 `ylsxai/climb-site`。

## 一次性配置（约 3 分钟）

1. 打开 <https://dash.cloudflare.com/> → 左侧 **Workers & Pages** → **Create**
2. 选 **Pages** 标签 → **Connect to Git**
3. 授权 GitHub，选中 `climb-site` 仓库 → **Begin setup**
4. 构建配置照抄：

   | 字段 | 值 |
   |---|---|
   | Project name | `climb-site`（决定默认域名 `climb-site.pages.dev`） |
   | Production branch | `main` |
   | Framework preset | **Next.js (Static HTML Export)** |
   | Build command | `npm run build` |
   | Build output directory | `out` |
   | 环境变量 | `NODE_VERSION` = `24` |

5. **Save and Deploy**，等 1–2 分钟出结果

构建成功的标志：日志里出现 `Exporting (2/2)` 和 `Compiled successfully`，然后给你一个 `https://climb-site.pages.dev` 的地址。

## 之后每次改内容

```bash
cd climb-site
# 改 content/posts/*.md 之类
git add -A && git commit -m "新增教程：xxx"
git push
```

Cloudflare 会在 push 后自动重新构建，约 1 分钟生效。**不需要本地跑 build。**

## 自定义域名

1. Pages 项目 → **Custom domains** → **Set up a domain**
2. 填你的域名（如 `climb.yourdomain.com`）
3. 域名若也在 Cloudflare 托管，会自动加 CNAME 记录；否则按提示去域名商加 CNAME 指向 `climb-site.pages.dev`
4. 等证书签发（几分钟）

## 改错了怎么回滚

Pages 项目 → **Deployments** → 找到上一个正常版本 → 右侧 `...` → **Rollback**。秒级生效，不用改代码。

## 常见故障

| 现象 | 原因 / 处理 |
|---|---|
| 构建失败 `npm ERR! engine` | 没设 `NODE_VERSION`，默认 Node 版本过老；加环境变量 `NODE_VERSION=24` 后 Retry |
| 页面 404，但构建成功 | Build output directory 填错，必须是 `out`（不是 `.next`、不是 `dist`） |
| 样式全丢、控制台 404 `/_next/...` | 用了 SSR 部署方式但又开了静态导出；把 `next.config.mjs` 的 `output: 'export'` 保持，且不要设 `basePath` |
| 详情页空白/404 | 中文 slug 未解码。`lib/content.js` 的 `getPost` 已处理，若改过该函数注意保留 decode 兜底 |
| 部署成功但内容是旧的 | 浏览器/Cloudflare 缓存；强制刷新，或看 Deployments 是否是最新 commit |

## 备选：命令行直接发（不接 Git）

```bash
cd climb-site
npm run build
npx wrangler pages deploy out --project-name climb-site
```

首次会弹浏览器让你登录 Cloudflare。适合临时预览，长期还是接 Git 更省事。

## 现在这个站的规模

- 静态页 10 个（首页 / 教程列表 / 3 篇教程 / 线路库 / 视频 / 关于 / 404）
- 首次加载 JS 约 103 kB，无后端、无数据库
- 免费额度：Pages 无限请求、每月 500 次构建，这个站远远用不完
