import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost, formatDate } from '../../../lib/content';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: '未找到 · 岩点' };
  return {
    title: `${post.title} · 岩点`,
    description: post.summary ?? '',
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <Link
        href="/tutorials/"
        className="text-[13px] text-rock transition hover:text-ember"
      >
        ← 回到教程
      </Link>

      <header className="mt-6 border-b border-line pb-7">
        <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-rock">
          <time className="tabular-nums">{formatDate(post.date)}</time>
          {post.level && (
            <>
              <span>·</span>
              <span className="text-ember">{post.level}</span>
            </>
          )}
        </div>
        <h1 className="mt-3 text-[2rem] font-bold leading-[1.25] tracking-tight sm:text-[2.4rem]">
          {post.title}
        </h1>
        {post.summary && (
          <p className="mt-4 text-[15px] leading-relaxed text-ash">{post.summary}</p>
        )}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-md bg-ember-soft px-2 py-0.5 text-[11.5px] text-ember"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose-climb mt-9"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <footer className="mt-16 border-t border-line pt-6">
        <Link
          href="/tutorials/"
          className="rounded-lg border border-line bg-chalk px-4 py-2 text-[13px] transition hover:border-ink/30"
        >
          更多教程
        </Link>
      </footer>
    </article>
  );
}
