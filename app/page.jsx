import Link from 'next/link';
import { getAllPosts, getAllRoutes, getVideos, formatDate } from '../lib/content';

const ENTRIES = [
  {
    href: '/tutorials/',
    kicker: '教程',
    title: '动作原理与训练方法',
    desc: '重心、脚法、发力顺序，一条条拆开讲，配视频对照。',
  },
  {
    href: '/routes/',
    kicker: '线路库',
    title: '线路与动作要点',
    desc: '按难度归档的线路笔记，写清每一步的关键动作。',
  },
  {
    href: '/videos/',
    kicker: '视频',
    title: '攀岩教本系列',
    desc: '成片与片段，看过程；细节都在文章里。',
  },
];

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);
  const routeCount = getAllRoutes().length;
  const videoCount = getVideos().length;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(115deg, rgba(0,0,0,0.035) 0 1px, transparent 1px 26px), radial-gradient(60% 70% at 88% 8%, rgba(200,69,42,0.10), transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-16 sm:pb-24 sm:pt-24">
          <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-ember">
            攀岩教本 · 系统训练笔记
          </p>
          <h1 className="mt-5 max-w-3xl text-[2.6rem] font-bold leading-[1.12] tracking-tight sm:text-6xl">
            把攀岩
            <br />
            讲清楚
          </h1>
          <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-ash">
            从重心到发力，把每个动作拆到能自己复现。视频看过程，站上看细节——
            {posts.length + routeCount + videoCount > 0
              ? `目前有 ${posts.length} 篇教程、${routeCount} 条线路笔记、${videoCount} 条视频。`
              : '内容正在陆续补齐。'}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/tutorials/"
              className="rounded-lg bg-ink px-5 py-2.5 text-[14px] font-medium text-sand transition hover:bg-ember"
            >
              开始读教程
            </Link>
            <Link
              href="/videos/"
              className="rounded-lg border border-line bg-chalk px-5 py-2.5 text-[14px] font-medium text-ink transition hover:border-ink/30"
            >
              看视频
            </Link>
          </div>
        </div>
      </section>

      {/* 三个入口 */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {ENTRIES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="group rounded-xl border border-line bg-chalk p-6 transition hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rock">
                {e.kicker}
              </span>
              <h2 className="mt-3 text-[17px] font-semibold tracking-tight">
                {e.title}
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ash">
                {e.desc}
              </p>
              <span className="mt-4 inline-block text-[13px] text-ember opacity-0 transition group-hover:opacity-100">
                进去 →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 最新教程 */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-5xl px-5 pb-10">
          <div className="flex items-baseline justify-between border-b border-line pb-3">
            <h2 className="text-[15px] font-semibold tracking-tight">最新教程</h2>
            <Link href="/tutorials/" className="text-[13px] text-ash hover:text-ember">
              全部 →
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/tutorials/${p.slug}/`}
                  className="group flex flex-col gap-1.5 py-6 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <time className="w-32 shrink-0 text-[12.5px] tabular-nums text-rock">
                    {formatDate(p.date)}
                  </time>
                  <span className="flex-1">
                    <span className="block text-[16.5px] font-medium tracking-tight group-hover:text-ember">
                      {p.title}
                    </span>
                    {p.summary && (
                      <span className="mt-1 block text-[13.5px] leading-relaxed text-ash">
                        {p.summary}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 一句立场 */}
      <section className="mx-auto max-w-5xl px-5 pt-10">
        <blockquote className="border-l-2 border-ember pl-5 text-[15px] leading-relaxed text-ash">
          攀岩不是比谁上肢强，是比谁更会把体重交给岩壁。
          <span className="mt-1 block text-[13px] text-rock">
            —— 这个站只记一件有用的事：怎么用力更少。
          </span>
        </blockquote>
      </section>
    </>
  );
}
