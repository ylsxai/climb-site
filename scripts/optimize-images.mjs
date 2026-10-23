#!/usr/bin/env node
/**
 * 把 public/images 里的图片批量转成 webp，并生成缩略图。
 *
 * 用法：
 *   npm run images              # 只处理还没有对应 webp 的图
 *   npm run images -- --force   # 全部重新生成
 *   npm run images -- --dry     # 只列出要做什么
 *
 * 依赖本机装好的 ImageMagick（命令 magick 或 convert）。
 * 没装的话脚本会打印安装方法后退出，不会改任何文件。
 *
 * 输出规则：
 *   public/images/a/b.png        → public/images/a/b.webp        （宽 ≤1600，质量 82）
 *                                → public/images/a/b@640.webp    （宽 ≤640，列表/卡片用）
 *   原图保留，不删。
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGES = path.resolve(ROOT, 'public/images');

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const DRY = args.has('--dry');

const SRC_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff', '.heic']);
const FULL_WIDTH = 1600;
const THUMB_WIDTH = 640;
const QUALITY = 82;

function findBinary() {
  for (const bin of ['magick', 'convert']) {
    try {
      execFileSync(bin, ['-version'], { stdio: 'ignore' });
      return bin;
    } catch {
      /* 试下一个 */
    }
  }
  return null;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (SRC_EXT.has(path.extname(entry.name).toLowerCase())) out.push(p);
  }
  return out;
}

function convert(bin, src, dest, width) {
  const ops = [
    '-auto-orient',
    '-strip',
    '-resize', `${width}x${width}>`,
    '-quality', String(QUALITY),
  ];
  const argv = bin === 'magick' ? ['convert', src, ...ops, dest] : [src, ...ops, dest];
  execFileSync(bin, argv, { stdio: 'ignore' });
}

function main() {
  if (!fs.existsSync(IMAGES)) {
    console.log(`没有 public/images 目录（${IMAGES}），没图可处理。`);
    console.log('放图进去再跑：npm run images');
    return;
  }

  const bin = findBinary();
  if (!bin) {
    console.error('没找到 ImageMagick。');
    console.error('Windows 安装：winget install ImageMagick.ImageMagick');
    console.error('         或：choco install imagemagick');
    console.error('装完重开终端，确认 `magick -version` 有输出。');
    process.exitCode = 1;
    return;
  }

  // 只处理非 webp 的源图；已经生成的 webp 不当输入，避免二次压缩
  const sources = walk(IMAGES).filter((f) => path.extname(f).toLowerCase() !== '.webp');

  if (!sources.length) {
    console.log('public/images 里没有需要转换的源图（png/jpg 等）。');
    return;
  }

  let done = 0;
  let skipped = 0;

  for (const src of sources) {
    const dir = path.dirname(src);
    const base = path.basename(src, path.extname(src));
    const full = path.join(dir, `${base}.webp`);
    const thumb = path.join(dir, `${base}@${THUMB_WIDTH}.webp`);

    for (const [dest, width] of [[full, FULL_WIDTH], [thumb, THUMB_WIDTH]]) {
      const need = FORCE || !fs.existsSync(dest) || fs.statSync(src).mtimeMs > fs.statSync(dest).mtimeMs;
      const rel = path.relative(ROOT, dest).replace(/\\/g, '/');
      if (!need) {
        skipped++;
        continue;
      }
      if (DRY) {
        console.log(`会生成：${rel}  (≤${width}px)`);
        done++;
        continue;
      }
      try {
        convert(bin, src, dest, width);
        const kb = (fs.statSync(dest).size / 1024).toFixed(0);
        console.log(`生成：${rel}  ${kb}KB`);
        done++;
      } catch (e) {
        console.error(`失败：${rel} — ${e.message}`);
      }
    }
  }

  console.log(`\n完成：生成 ${done} 个，跳过 ${skipped} 个${DRY ? '（--dry，未落盘）' : ''}`);
  if (done && !DRY) console.log('提示：文章里引用 webp 路径即可，例如 ![线路照片](/images/routes/v3.jpg → .webp)');
}

main();
