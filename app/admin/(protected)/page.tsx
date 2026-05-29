import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl">
      {/* HEADER */}
      <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-3 text-3xl font-semibold text-white">
            Admin Dashboard
          </h1>

          <p className="max-w-2xl text-gray-400">
            Manage your content, articles, tools, and incoming requests. This is
            your control center.
          </p>
        </div>

        <Link
          href="/"
          className="
            inline-flex items-center justify-center
            rounded-md
            border border-white/20
            px-5 py-3
            text-sm font-medium text-white/80
            transition
            hover:bg-white hover:text-black
          "
        >
          Back to Home
        </Link>
      </header>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* MAIN – SPHAWN LAB */}
        <section className="rounded-xl border border-white/10 bg-[#111827] p-8 lg:col-span-2">
          <h2 className="mb-3 text-2xl font-medium text-white">
            Sphawn Lab
          </h2>

          <p className="mb-6 max-w-xl leading-relaxed text-gray-400">
            Write and manage Lab articles, experiments, and technical content.
            This section is used to build authority and SEO visibility.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/admin/lab"
              className="
                inline-flex items-center justify-center
                rounded-md
                bg-[#00E1F0]
                px-6 py-3
                font-medium text-black
                transition
                hover:brightness-110
              "
            >
              Manage Lab Articles
            </Link>

            <Link
              href="/admin/lab/add"
              className="
                inline-flex items-center justify-center
                rounded-md
                border border-white/20
                px-6 py-3
                text-white/80
                transition
                hover:bg-white hover:text-black
              "
            >
              + Add New Article
            </Link>
          </div>
        </section>

        {/* OFFERS */}
        <section className="rounded-xl border border-white/10 bg-[#111827] p-8">
          <h2 className="mb-3 text-xl font-medium text-white">
            Offers
          </h2>

          <p className="mb-6 leading-relaxed text-gray-400">
            View and manage incoming offer requests from potential clients.
          </p>

          <Link
            href="/admin/offers"
            className="inline-flex items-center text-[#00E1F0] hover:underline"
          >
            View offers →
          </Link>
        </section>

        {/* GPS LAB */}
        <section className="rounded-xl border border-white/10 bg-[#111827] p-8">
          <h2 className="mb-3 text-xl font-medium text-white">
            GPS Lab
          </h2>

          <p className="mb-6 leading-relaxed text-gray-400">
            Open the GPS tracking experiment to test route recording, current
            position, and map-based movement.
          </p>

          <Link
            href="/gps-lab"
            className="
              inline-flex items-center justify-center
              rounded-md
              bg-[#00E1F0]
              px-5 py-3
              text-sm font-medium text-black
              transition
              hover:brightness-110
            "
          >
            Open GPS Lab
          </Link>
        </section>

        {/* ROBOT DASHBOARD */}
        <section className="rounded-xl border border-white/10 bg-[#111827] p-8">
          <h2 className="mb-3 text-xl font-medium text-white">
            Robot Dashboard
          </h2>

          <p className="mb-6 leading-relaxed text-gray-400">
            Control and monitor the smart robot dashboard, maps, cleaning
            actions, and device status.
          </p>

          <Link
            href="/admin/robot"
            className="inline-flex items-center text-[#00E1F0] hover:underline"
          >
            Open robot control →
          </Link>
        </section>

        {/* FUTURE / DISABLED */}
        <section className="rounded-xl border border-white/5 bg-[#0F172A] p-8 opacity-60">
          <h2 className="mb-3 text-xl font-medium text-white">
            Coming Soon
          </h2>

          <p className="leading-relaxed text-gray-500">
            Analytics, SEO insights, and system monitoring will appear here.
          </p>
        </section>
      </div>
    </main>
  );
}