import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const root = process.cwd();
const postsDir = path.join(root, 'content', 'posts');
const routesDir = path.join(root, 'content', 'routes');

marked.setOptions({ gfm: true, breaks: false });

function readMarkdownDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      const slug = file.replace(/\.md$/, '');
      return {
        slug,
        ...data,
        content,
        html: marked.parse(content),
      };
    });
}

export function getAllPosts() {
  return readMarkdownDir(postsDir).sort(
    (a, b) => new Date(b.date ?? 0) - new Date(a.date ?? 0)
  );
}

function safeDecode(value) {
  const raw = String(value ?? '');
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function getPost(slug) {
  const posts = getAllPosts();
  const raw = String(slug ?? '');
  // 静态导出时，含中文的分段传到 params 里是 percent-encoded 的，这里两种都试
  return (
    posts.find((p) => p.slug === raw) ??
    posts.find((p) => p.slug === safeDecode(raw)) ??
    null
  );
}

export function getAllRoutes() {
  const order = { V0: 0, V1: 1, V2: 2, V3: 3, V4: 4, V5: 5, V6: 6, V7: 7 };
  return readMarkdownDir(routesDir).sort(
    (a, b) => (order[a.grade] ?? 99) - (order[b.grade] ?? 99)
  );
}

export function getVideos() {
  const file = path.join(root, 'content', 'videos.json');
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}
