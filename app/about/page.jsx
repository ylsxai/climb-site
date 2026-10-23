export const metadata = { title: '关于 · 岩点' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="text-[2rem] font-bold tracking-tight">关于</h1>

      <div className="prose-climb mt-8">
        <p>
          这里记的是攀岩的学习过程：把一个动作拆到能自己复现，把一次训练拆到能写进计划。
          视频在「攀岩教本」系列里，细节留在这个站上。
        </p>
        <h2>这里会有什么</h2>
        <ul>
          <li><strong>教程</strong>：动作原理、训练方法、装备安全。</li>
          <li><strong>线路库</strong>：按难度归档的线路笔记与动作要点。</li>
          <li><strong>视频</strong>：系列成片与片段。</li>
        </ul>
        <h2>原则</h2>
        <ol>
          <li>能复现才写。写不清的说明自己还没搞懂。</li>
          <li>不吹效果。练了多久、进步多少，如实记。</li>
          <li>安全第一。任何动作先确认保护与落地区域。</li>
        </ol>
        <h2>联系</h2>
        <p>
          有想看的题材，或者发现写错的地方，欢迎告诉我。
          <br />
          邮箱：<code>hello@example.com</code>（换成你自己的）
        </p>
      </div>
    </div>
  );
}
