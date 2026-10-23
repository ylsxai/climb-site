#!/usr/bin/env node
/**
 * 把 knowledge/inbox/*.md 导入成站内教程。
 *
 * 用法：
 *   npm run import              # 只导入 inbox 里还没进过站的
 *   npm run import -- --dry     # 只打印会做什么，不写文件
 *   npm run import -- --force   # 覆盖已存在的同名文章
 *
 * 做的事：
 *   1. 读 ../knowledge/inbox 下的 .md
 *   2. 去掉 YAML 头（如果有）和 HTML 注释
 *   3. 从第一个 # 标题或第一行取标题，从文件名取 slug
 *   4. 补站内需要的 frontmatter（title/summary/date/level/tags）写进 content/posts/
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const INBOX = path.resolve(ROOT, '../knowledge/inbox');
const OUT = path.resolve(ROOT, 'content/posts');

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const FORCE = args.has('--force');

function stripBom(s) {
  return s.replace(/^\uFEFF/, '');
}

/** 去掉开头的 --- ... --- YAML 头，返回 { data, body }（不依赖 gray-matter，容忍坏 YAML） */
function splitFrontMatter(raw) {
  const text = stripBom(raw).replace(/\r\n/g, '\n');
  if (!text.startsWith('---\n')) return { data: {}, body: text };
  const end = text.indexOf('\n---', 3);
  if (end === -1) return { data: {}, body: text };
  const head = text.slice(4, end);
  const body = text.slice(end + 4).replace(/^\n+/, '');
  const data = {};
  for (const line of head.split('\n')) {
    const m = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (/^['"].*['"]$/.test(v)) v = v.slice(1, -1);
    data[m[1]] = v;
  }
  return { data, body };
}

/** 去掉 HTML 注释块（跨行） */
function stripHtmlComments(s) {
  return s.replace(/<!--[\s\S]*?-->/g, '');
}

/** 从正文里摘标题，并在有标题时把它从正文中去掉（页面自己会渲染 title） */
function takeTitle(body) {
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^#{1,2}\s+(.+?)\s*#*\s*$/);
    if (m) {
      const title = m[1].trim();
      const rest = [...lines.slice(0, i), ...lines.slice(i + 1)].join('\n').replace(/^\n+/, '');
      return { title, body: rest };
    }
  }
  const firstLine = (lines.find((l) => l.trim()) || '').trim();
  if (firstLine) {
    const idx = lines.findIndex((l) => l.trim());
    return { title: firstLine.slice(0, 40), body: [...lines.slice(0, idx), ...lines.slice(idx + 1)].join('\n').replace(/^\n+/, '') };
  }
  return { title: '', body };
}

/** 摘一段摘要：正文第一个非空、非标题段落，截断到 80 字 */
function takeSummary(body) {
  const para = body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/^[>\-\*\d\.\s]+/, '').trim())
    .find((p) => p && !p.startsWith('#') && !p.startsWith('|') && !p.startsWith('```'));
  if (!para) return '';
  const clean = para.replace(/[*_`\[\]]/g, '').replace(/\s+/g, ' ');
  return clean.length > 80 ? clean.slice(0, 78) + '…' : clean;
}

/** 文件名 → slug：去扩展名、空格转 -、去掉 URL 里不安全的字符，保留中文 */
function toSlug(filename) {
  return filename
    .replace(/\.md$/i, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[\\/:*?"<>|#%{}^~\[\]]/g, '')
    .replace(/-+/g, '-');
}

/** 让 YAML 里的字符串安全：含特殊字符就加引号 */
function yamlStr(v) {
  const s = String(v ?? '');
  if (s === '') return '""';
  if (/^[\w\u4e00-\u9fa5\u3000-\u303f，。、：；！？（）《》·\-\s]+$/.test(s) && !/^\s|\s$/.test(s)) return s;
  return JSON.stringify(s);
}

function quoteTags(tags) {
  if (!tags.length) return '[]';
  return '[' + tags.map((t) => JSON.stringify(String(t))).join(', ') + ']';
}

function main() {
  if (!fs.existsSync(INBOX)) {
    console.error(`找不到目录：${INBOX}`);
    console.error('先建好 knowledge/inbox，或从别处改 INBOX 路径。');
    process.exitCode = 1;
    return;
  }
  fs.mkdirSync(OUT, { recursive: true });

  const files = fs.readdirSync(INBOX).filter((f) => f.toLowerCase().endsWith('.md')).sort();
  if (!files.length) {
    console.log(`inbox 是空的（${INBOX}），没有要导入的。`);
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  let created = 0;
  let skipped = 0;
  let overwritten = 0;

  for (const file of files) {
    const src = path.join(INBOX, file);
    const raw = fs.readFileSync(src, 'utf8');
    const { data, body: afterFm } = splitFrontMatter(raw);
    const body = stripHtmlComments(afterFm).trim();
    if (!body) {
      console.log(`跳过（正文为空）：${file}`);
      skipped++;
      continue;
    }

    const { title, body: cleaned } = takeTitle(body);
    const slug = data.slug ? toSlug(data.slug) : toSlug(file);
    const dest = path.join(OUT, `${slug}.md`);

    if (fs.existsSync(dest) && !FORCE) {
      console.log(`跳过（已存在，加 --force 覆盖）：${slug}.md`);
      skipped++;
      continue;
    }

    const summary = data.summary || data.description || takeSummary(cleaned);
    const tags = data.tags
      ? String(data.tags).replace(/^\[|\]$/g, '').split(/[,，]/).map((t) => t.trim()).filter(Boolean)
      : ['导入'];

    const out = [
      '---',
      `title: ${yamlStr(title || slug)}`,
      `summary: ${yamlStr(summary)}`,
      `date: ${data.date || today}`,
      `level: ${data.level || '入门'}`,
      `tags: ${quoteTags(tags)}`,
      '---',
      '',
      cleaned,
      '',
    ].join('\n');

    if (DRY) {
      console.log(`会写入：content/posts/${slug}.md  （标题：${title || slug}）`);
      created++;
      continue;
    }

    const existed = fs.existsSync(dest);
    fs.writeFileSync(dest, out, 'utf8');
    if (existed) overwritten++;
    created++;
    console.log(`${existed ? '覆盖' : '新增'}：content/posts/${slug}.md`);
  }

  console.log(`\n完成：写入 ${created}，跳过 ${skipped}${overwritten ? `，覆盖 ${overwritten}` : ''}${DRY ? '（--dry，未落盘）' : ''}`);
  if (created && !DRY) console.log('提醒：检查一下导入文章的 frontmatter（date/level/tags），自动推断的未必准。');
}

main();
