import Link from 'next/link';

const NAV = [
  { href: '/tutorials/', label: '教程' },
  { href: '/routes/', label: '线路库' },
  { href: '/videos/', label: '视频' },
  { href: '/about/', label: '关于' },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-sand/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-[13px] font-bold text-sand transition group-hover:bg-ember">
            岩
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            岩点<span className="text-rock"> / climb</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-[13.5px]">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-ash transition hover:bg-ember-soft hover:text-ember"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
