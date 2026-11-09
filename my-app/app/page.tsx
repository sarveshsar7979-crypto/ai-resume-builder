export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-black font-sans">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-12">
        <span className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Snapo
        </span>
        <div className="flex items-center gap-3">
          <button className="hidden sm:inline-block rounded-full px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 transition-colors">
            Log in
          </button>
          <button className="rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity">
            Sign up
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:py-24 text-center">
        <h1 className="max-w-2xl text-4xl sm:text-6xl font-bold tracking-tight text-zinc-50">
          Share your moments,{" "}
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            instantly.
          </span>
        </h1>
        <p className="mt-6 max-w-md text-lg text-zinc-400">
          Snapo is the simplest way to capture, share, and discover photos and
          videos with people who matter to you.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-8 py-3 text-base font-semibold text-white shadow-md hover:opacity-90 transition-opacity">
            Get started
          </button>
          <button className="rounded-full border border-zinc-700 px-8 py-3 text-base font-semibold text-zinc-200 hover:bg-zinc-900 transition-colors">
            Learn more
          </button>
        </div>

        {/* Phone mockup / feed preview */}
        <div className="mt-16 w-full max-w-sm rounded-[2rem] border border-zinc-800 bg-zinc-950 p-4 shadow-xl shadow-black/50">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
            <div className="text-left">
              <p className="text-sm font-semibold text-zinc-100">
                jane.doe
              </p>
              <p className="text-xs text-zinc-500">Bali, Indonesia</p>
            </div>
          </div>
          <div className="mt-2 aspect-square w-full rounded-xl bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900" />
          <div className="mt-3 flex items-center gap-4 px-2 text-zinc-300">
            <span>&#9825;</span>
            <span>&#9998;</span>
            <span>&#10148;</span>
          </div>
          <p className="mt-2 px-2 text-left text-sm text-zinc-300">
            <span className="font-semibold text-zinc-100">
              jane.doe
            </span>{" "}
            golden hour never disappoints ✨
          </p>
        </div>
      </main>

      {/* Features */}
      <section className="grid grid-cols-1 gap-8 px-6 py-16 sm:grid-cols-3 sm:px-12 border-t border-zinc-900">
        {[
          {
            title: "Share",
            desc: "Post photos and videos to your feed in seconds.",
            emoji: "📸",
          },
          {
            title: "Connect",
            desc: "Follow friends and discover new creators you'll love.",
            emoji: "💬",
          },
          {
            title: "Discover",
            desc: "Explore trending moments from around the world.",
            emoji: "🌍",
          },
        ].map((f) => (
          <div key={f.title} className="flex flex-col items-center text-center gap-3">
            <span className="text-3xl">{f.emoji}</span>
            <h3 className="text-lg font-semibold text-zinc-50">
              {f.title}
            </h3>
            <p className="max-w-xs text-sm text-zinc-400">
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 sm:px-12 border-t border-zinc-900">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-zinc-50">
          Loved by people everywhere
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              name: "Maya Chen",
              handle: "@maya.creates",
              quote:
                "Snapo makes sharing my travel shots feel effortless. The feed is so clean I actually enjoy scrolling again.",
            },
            {
              name: "Daniel Okafor",
              handle: "@dan.films",
              quote:
                "Finally an app that gets out of the way. I post, people react, that's it — no clutter, no noise.",
            },
            {
              name: "Priya Natarajan",
              handle: "@priya.eats",
              quote:
                "I switched my whole food blog over to Snapo. Discovery actually works, my posts reach real people.",
            },
          ].map((t) => (
            <div
              key={t.handle}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <p className="text-sm text-zinc-300">“{t.quote}”</p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
                <div>
                  <p className="text-sm font-semibold text-zinc-100">
                    {t.name}
                  </p>
                  <p className="text-xs text-zinc-500">{t.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-sm text-zinc-500 sm:px-12">
        © 2026 Snapo. Just a design preview.
      </footer>
    </div>
  );
}
