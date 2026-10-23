#!/usr/bin/env node
/**
 * 本地预览 `out/` 里的静态站（不需要 python，也不需要 npx serve）。
 *
 *   npm run preview            # http://127.0.0.1:3101
 *   npm run preview -- 4000    # 换端口
 *
 * 只做一件事：把 /tutorials/foo/ 映射到 out/tutorials/foo/index.html，
 * 并带上正确的 Content-Type。生产环境不要用它，那是 Cloudflare Pages 干的活。
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'out');
const PORT = Number(process.argv[2] || process.env.PORT || 3101);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const target = path.join(ROOT, clean);

  // 防目录穿越
  if (!target.startsWith(ROOT)) return null;

  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    const index = path.join(target, 'index.html');
    return fs.existsSync(index) ? index : null;
  }
  if (fs.existsSync(target)) return target;
  // 无尾斜杠的目录也能访问
  const withIndex = path.join(target, 'index.html');
  if (fs.existsSync(withIndex)) return withIndex;
  return null;
}

if (!fs.existsSync(ROOT)) {
  console.error('没有 out/ 目录。先跑 npm run build。');
  process.exit(1);
}

http
  .createServer((req, res) => {
    const file = resolve(req.url || '/');
    if (!file) {
      const notFound = path.join(ROOT, '404.html');
      res.writeHead(404, { 'Content-Type': MIME['.html'] });
      res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : 'Not found');
      return;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, '127.0.0.1', () => {
    console.log(`预览：http://127.0.0.1:${PORT}`);
    console.log('Ctrl+C 停止。');
  });
