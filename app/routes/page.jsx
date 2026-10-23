import { getAllRoutes } from '../../lib/content';

export const metadata = { title: '线路库 · 岩点' };

export default function RoutesPage() {
  const routes = getAllRoutes();

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <h1 className="text-[2rem] font-bold tracking-tight">线路库</h1>
      <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ash">
        按难度排的线路笔记。重点不是线路长什么样，而是每一步该用哪个动作、为什么。
      </p>

      {routes.length === 0 ? (
        <p className="mt-12 rounded-xl border border-dashed border-line p-8 text-center text-[14px] text-rock">
          还没有线路。在 <code>content/routes/</code> 里加 Markdown 就会出现在这里。
        </p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {routes.map((r) => (
            <li
              key={r.slug}
              className="rounded-xl border border-line bg-chalk p-6 transition hover:border-ink/25"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[16.5px] font-semibold tracking-tight">{r.title}</h2>
                  {r.location && (
                    <p className="mt-1 text-[12.5px] text-rock">{r.location}</p>
                  )}
                </div>
                {r.grade && (
                  <span className="shrink-0 rounded-md bg-ink px-2 py-1 text-[12px] font-semibold text-sand">
                    {r.grade}
                  </span>
                )}
              </div>
              <div
                className="prose-climb mt-4 text-[13.5px] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: r.html }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
