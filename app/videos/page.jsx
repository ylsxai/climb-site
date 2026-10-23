import { getVideos, formatDate } from '../../lib/content';

export const metadata = { title: '视频 · 岩点' };

export default function VideosPage() {
  const videos = getVideos();

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <h1 className="text-[2rem] font-bold tracking-tight">视频</h1>
      <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ash">
        「攀岩教本」系列成片与片段。视频负责让你看见动作，文章负责让你看懂为什么。
      </p>

      {videos.length === 0 ? (
        <p className="mt-12 rounded-xl border border-dashed border-line p-8 text-center text-[14px] text-rock">
          还没有视频。在 <code>content/videos.json</code> 里加一条就会出现在这里。
        </p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {videos.map((v) => (
            <article key={v.id} className="group">
              <div className="overflow-hidden rounded-xl border border-line bg-ink/5">
                {v.bvid ? (
                  <iframe
                    src={`//player.bilibili.com/player.html?bvid=${v.bvid}&autoplay=0&high_quality=1`}
                    title={v.title}
                    allow="fullscreen; picture-in-picture"
                    scrolling="no"
                    frameBorder="no"
                    className="aspect-video w-full"
                  />
                ) : (
                  <div className="grid aspect-video w-full place-items-center bg-ember-soft text-[13px] text-ember">
                    视频待上传（填 bvid 后自动嵌入）
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h2 className="text-[15.5px] font-medium tracking-tight">{v.title}</h2>
                <time className="shrink-0 text-[12px] tabular-nums text-rock">
                  {formatDate(v.date)}
                </time>
              </div>
              {v.summary && (
                <p className="mt-1.5 text-[13px] leading-relaxed text-ash">{v.summary}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
