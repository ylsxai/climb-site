import Link from 'next/link';
import { getAllPosts, formatDate } from '../../lib/content';

export const metadata = { title: '教程 · 岩点' };

export default function TutorialsPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <h1 className="text-[2rem] font-bold tracking-tight">教程</h1>
      <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ash">
        动作原理、训练方法、装备安全。每篇都尽量写到「照着做能复现」的程度。
      </p>

      {posts.length === 0 ? (
        <p className="mt-12 rounded-xl border border-dashed border-line p-8 text-center text-[14px] text-rock">
          还没有文章。把 Markdown 丢进 <code>content/posts/</code> 就会出现。
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-line border-t border-line">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/tutorials/${p.slug}/`}
                className="group grid gap-2 py-7 sm:grid-cols-[8rem_1fr] sm:gap-6"
              >
                <div className="text-[12.5px] tabular-nums text-rock">
                  {formatDate(p.date)}
                  {p.level && (
                    <span className="mt-1 block text-[11.5px] text-ember">{p.level}</span>
                  )}
                </div>
                <div>
                  <h2 className="text-[18px] font-semibold tracking-tight group-hover:text-ember">
                    {p.title}
                  </h2>
                  {p.summary && (
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ash">
                      {p.summary}
                    </p>
                  )}
                  {Array.isArray(p.tags) && p.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-ember-soft px-2 py-0.5 text-[11.5px] text-ember"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
