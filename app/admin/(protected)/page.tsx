/* eslint-disable @next/next/no-html-link-for-pages */

export default function AdminDashboardPage() {
  return (
    <main className="max-w-6xl mx-auto">
      {/* HEADER */}
      <header className="mb-12">
        <h1 className="text-3xl font-semibold mb-3">
          Admin Dashboard
        </h1>

        <p className="text-gray-400 max-w-2xl">
          Manage your content, articles, and incoming requests.
          This is your control center.
        </p>
      </header>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN – SPHAWN LAB */}
        <section className="lg:col-span-2 bg-[#111827] rounded-xl border border-white/10 p-8">
          <h2 className="text-2xl font-medium mb-3">
            Sphawn Lab
          </h2>

          <p className="text-gray-400 max-w-xl mb-6 leading-relaxed">
            Write and manage Lab articles, experiments, and technical content.
            This section is used to build authority and SEO visibility.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/admin/lab"
              className="
                inline-flex items-center justify-center
                px-6 py-3
                rounded-md
                bg-[#00E1F0]
                text-black font-medium
                hover:brightness-110
                transition
              "
            >
              Manage Lab Articles
            </a>

            <a
              href="/admin/lab/add"
              className="
                inline-flex items-center justify-center
                px-6 py-3
                rounded-md
                border border-white/20
                text-white/80
                hover:bg-white hover:text-black
                transition
              "
            >
              + Add New Article
            </a>
          </div>
        </section>

        {/* OFFERS */}
        <section className="bg-[#111827] rounded-xl border border-white/10 p-8">
          <h2 className="text-xl font-medium mb-3">
            Offers
          </h2>

          <p className="text-gray-400 mb-6 leading-relaxed">
            View and manage incoming offer requests from potential clients.
          </p>

          <a
            href="/admin/offers"
            className="inline-flex items-center text-[#00E1F0] hover:underline"
          >
            View offers →
          </a>
        </section>

        {/* FUTURE / DISABLED */}
        <section className="bg-[#0F172A] rounded-xl border border-white/5 p-8 opacity-60">
          <h2 className="text-xl font-medium mb-3">
            Coming Soon
          </h2>

          <p className="text-gray-500 leading-relaxed">
            Analytics, SEO insights, and system monitoring will appear here.
          </p>
        </section>
      </div>
    </main>
  );
}
