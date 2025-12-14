export default function CookieStatementPage() {
  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* BG blur circles */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-28 pb-24">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Cookie Statement
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            This Cookie Statement explains how cookies and similar technologies
            are used on the Sphawn website.
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-slate-300 leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              1. What are cookies?
            </h2>
            <p>
              Cookies are small text files stored on your device when you visit a
              website. They are commonly used to ensure websites function
              properly and to provide insights into website usage.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              2. Cookies used on this website
            </h2>
            <p>
              This website does <strong>not</strong> use tracking cookies,
              marketing cookies or advertising cookies.
            </p>
            <p className="mt-2">
              We do not track individual users and we do not create user
              profiles.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              3. Analytics
            </h2>
            <p>
              We use <strong>Vercel Analytics</strong> to gain basic insights into
              website traffic. Vercel Analytics:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm">
              <li>Does not use cookies</li>
              <li>Does not collect personal data</li>
              <li>Does not identify individual visitors</li>
              <li>Is GDPR-compliant by default</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              4. Managing cookies
            </h2>
            <p>
              Since this website does not use tracking or marketing cookies,
              there is no need to manage cookie preferences or provide consent.
            </p>
            <p className="mt-2">
              You can still control and delete cookies through your browser
              settings at any time.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              5. Changes to this statement
            </h2>
            <p>
              This Cookie Statement may be updated if the website functionality
              changes or if cookies are introduced in the future.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Last updated: {new Date().toLocaleDateString("en-GB")}
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
