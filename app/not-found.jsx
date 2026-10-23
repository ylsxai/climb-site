import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start px-5 py-28">
      <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-ember">404</p>
      <h1 className="mt-4 text-[2.2rem] font-bold tracking-tight">这条线路还没开</h1>
      <p className="mt-4 text-[14.5px] leading-relaxed text-ash">
        页面不存在，或者还没写。回首页看看别的。
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-ink px-5 py-2.5 text-[14px] font-medium text-sand transition hover:bg-ember"
      >
        回首页
      </Link>
    </div>
  );
}
