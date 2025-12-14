export default function TermsAndConditionsPage() {
  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* BG blur circles */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-28 pb-24">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            These Terms &amp; Conditions govern the use of this website and the
            services provided by Sphawn.
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-slate-300 leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              1. General information
            </h2>
            <p>
              Sphawn is a freelance web design and web development business,
              operated as a ZZP and registered in the Netherlands.
            </p>
            <ul className="mt-2 text-sm">
              <li>
                Business name: <strong className="text-slate-200">Sphawn</strong>
              </li>
              <li>
                KvK number:{" "}
                <strong className="text-slate-200">97594148</strong>
              </li>
              <li>
                Location:{" "}
                <strong className="text-slate-200">
                  Heerlen, Limburg, Netherlands
                </strong>
              </li>
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
              2. Services
            </h2>
            <p>
              Sphawn provides web design, web development and related digital
              services, including but not limited to:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm">
              <li>Website design and development</li>
              <li>Landing pages and business websites</li>
              <li>Custom builds using modern frameworks</li>
              <li>Basic SEO and performance optimization</li>
            </ul>
            <p className="mt-2">
              All services are delivered on a freelance basis and tailored to
              the specific agreement with the client.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              3. Quotes and agreements
            </h2>
            <p>
              All quotes are non-binding unless explicitly stated otherwise.
              A project starts only after written agreement by both parties.
            </p>
            <p className="mt-2">
              Any changes to the scope of a project may affect pricing and
              delivery time and will be communicated clearly.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              4. Payments
            </h2>
            <p>
              Payment terms are agreed upon per project. Unless stated
              otherwise:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm">
              <li>Invoices must be paid within the agreed term</li>
              <li>Late payments may result in suspension of services</li>
              <li>All prices are exclusive of VAT unless stated otherwise</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              5. Intellectual property
            </h2>
            <p>
              All designs, code and materials created by Sphawn remain the
              intellectual property of Sphawn until full payment has been
              received.
            </p>
            <p className="mt-2">
              After full payment, the client receives the right to use the
              delivered work for its intended purpose, unless agreed otherwise
              in writing.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              6. Liability
            </h2>
            <p>
              Sphawn is not liable for any indirect or consequential damages,
              including loss of revenue, data or business opportunities.
            </p>
            <p className="mt-2">
              While every effort is made to deliver high-quality and secure
              websites, Sphawn cannot guarantee that a website will be free from
              errors or downtime at all times.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              7. Third-party services
            </h2>
            <p>
              Websites may rely on third-party services such as hosting
              providers, plugins or external APIs. Sphawn is not responsible for
              changes, downtime or issues caused by these third parties.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              8. Termination
            </h2>
            <p>
              Either party may terminate a project in writing. Work completed up
              to the termination date must be paid by the client.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              9. Governing law
            </h2>
            <p>
              These Terms &amp; Conditions are governed by and interpreted in
              accordance with the laws of the Netherlands.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              10. Changes to these terms
            </h2>
            <p>
              Sphawn reserves the right to update these Terms &amp; Conditions at
              any time. Changes will be published on this page.
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
