export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* BG blur circles – păstrăm designul */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-28 pb-24">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            This Privacy Policy explains how Sphawn collects, uses and protects
            your personal data when you visit this website or contact us.
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-slate-300 leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              1. Who we are
            </h2>
            <p>
              Sphawn is a freelance web design and web development business based
              in Heerlen, Limburg, the Netherlands.
            </p>
            <ul className="mt-2 text-sm">
              <li>Business name: <strong className="text-slate-200">Sphawn</strong></li>
              <li>KvK number: <strong className="text-slate-200">97594148</strong></li>
              <li>Location: <strong className="text-slate-200">Heerlen, Limburg, NL</strong></li>
              <li>
                Email:{" "}
                <a
                  href="mailto:support@sphawn.nl"
                  className="text-cyan-300 hover:text-cyan-200 underline"
                >
                  support@sphawn.nl
                </a>
              </li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              2. What data we collect
            </h2>
            <p>
              We only collect personal data that you voluntarily provide to us,
              for example when you contact us through the contact form.
            </p>
            <p className="mt-2">
              This may include:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm">
              <li>Your name</li>
              <li>Your email address</li>
              <li>The subject and content of your message</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              3. How we use your data
            </h2>
            <p>
              Your data is used exclusively to:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm">
              <li>Respond to your inquiry</li>
              <li>Communicate with you about your project or request</li>
            </ul>
            <p className="mt-2">
              We do not sell, rent or share your personal data with third parties
              for marketing purposes.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              4. Analytics & cookies
            </h2>
            <p>
              This website does <strong>not</strong> use tracking cookies or
              marketing cookies.
            </p>
            <p className="mt-2">
              We use <strong>Vercel Analytics</strong> to gain basic insights
              into website traffic. This analytics tool:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm">
              <li>Does not use cookies</li>
              <li>Does not track individual users</li>
              <li>Does not collect personal data</li>
              <li>Is GDPR-compliant by default</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              5. Data storage & security
            </h2>
            <p>
              We take appropriate technical and organizational measures to
              protect your personal data against loss, misuse or unauthorized
              access.
            </p>
            <p className="mt-2">
              Personal data submitted through the contact form is stored only as
              long as necessary to handle your request.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              6. Your rights
            </h2>
            <p>
              Under the General Data Protection Regulation (GDPR), you have the
              right to:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm">
              <li>Access your personal data</li>
              <li>Request correction or deletion of your data</li>
              <li>Withdraw your consent at any time</li>
            </ul>
            <p className="mt-2">
              To exercise your rights, please contact us at{" "}
              <a
                href="mailto:support@sphawn.nl"
                className="text-cyan-300 hover:text-cyan-200 underline"
              >
                support@sphawn.nl
              </a>.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              7. Changes to this policy
            </h2>
            <p>
              This Privacy Policy may be updated from time to time to reflect
              changes in legal requirements or website functionality.
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
