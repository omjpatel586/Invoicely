export default function AboutPage() {
  const values = [
    {
      title: 'Speed first',
      desc: 'Create and share a professional invoice in under 60 seconds.',
      icon: (
        <svg
          className="w-5 h-5 stroke-secondary-light dark:stroke-secondary-dark"
          fill="none"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      title: 'Data privacy',
      desc: "Your invoice data stays yours. We don't sell or share it.",
      icon: (
        <svg
          className="w-5 h-5 stroke-secondary-light dark:stroke-secondary-dark"
          fill="none"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: 'Clean output',
      desc: 'Every PDF looks professional — ready to send to any client.',
      icon: (
        <svg
          className="w-5 h-5 stroke-secondary-light dark:stroke-secondary-dark"
          fill="none"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M9 7h6M9 11h6M9 15h4" />
        </svg>
      ),
    },
    {
      title: 'Made with care',
      desc: 'We use Invoicely ourselves — every update is something we needed.',
      icon: (
        <svg
          className="w-5 h-5 stroke-secondary-light dark:stroke-secondary-dark"
          fill="none"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
  ];

  const stats = [
    { num: '∞', label: 'Invoices supported' },
    { num: 'PDF', label: 'Instant export' },
    { num: '100%', label: 'Privacy focused' },
    { num: '100%', label: 'Instant Whatsapp Reminders' },
    { num: '100%', label: 'Payment Directly Into Your Bank Account' },
  ];

  const tags = ['Node.js', 'Next.js', 'PostgreSQL', 'SaaS', 'Open source'];

  return (
    <div className="min-h-screen flex flex-col bg-body-light dark:bg-body-dark text-text-light dark:text-text-dark">
      {/* HERO */}
      <section className="bg-primary-light dark:bg-primary-dark border-b border-border-light dark:border-border-dark px-6 py-16 text-center">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-secondary-light dark:text-secondary-dark border border-secondary-light dark:border-secondary-dark bg-secondary-light/10 dark:bg-secondary-dark/10 px-4 py-1.5 rounded-full mb-5">
          About Invoicely
        </span>
        <h1 className="text-4xl maxSm:text-2xl font-bold tracking-tight text-text-light dark:text-text-dark mb-3 leading-tight">
          Invoicing that{' '}
          <span className="text-secondary-light dark:text-secondary-dark">
            just works
          </span>
        </h1>
        <p className="text-base text-text-light/60 dark:text-text-dark/60 max-w-lg mx-auto leading-relaxed">
          Built for freelancers and small businesses who want professional
          invoices without the complexity. Fast, clean, and reliable.
        </p>
      </section>

      {/* STATS STRIP */}
      <div className="grid grid-cols-3 maxSm:grid-cols-1 border-b border-border-light dark:border-border-dark divide-x maxSm:divide-x-0 maxSm:divide-y divide-border-light dark:divide-border-dark">
        {stats.map((s) => (
          <div
            key={s.label}
            className="py-7 text-center bg-primary-light dark:bg-primary-dark"
          >
            <span className="block text-3xl font-bold text-secondary-light dark:text-secondary-dark tracking-tight mb-1.5">
              {s.num}
            </span>
            <span className="block text-xs text-text-light/40 dark:text-text-dark/40 uppercase tracking-widest">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-14 maxSm:py-8 space-y-14">
        {/* MISSION */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary-light dark:text-secondary-dark mb-2.5">
            Our mission
          </p>
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark tracking-tight mb-4">
            Simple tools for serious work
          </h2>
          <p className="text-sm text-text-light/60 dark:text-text-dark/60 leading-relaxed mb-3">
            Invoicely was built out of frustration with bloated invoicing tools
            that get in the way. We wanted something fast, clean, and
            professional — so we built it ourselves.
          </p>
          <p className="text-sm text-text-light/60 dark:text-text-dark/60 leading-relaxed">
            No steep learning curve, no unnecessary features. Just create your
            invoice, download it as a PDF, and get paid. That&apos;s it.
          </p>
        </section>

        {/* FOUNDER */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary-light dark:text-secondary-dark mb-2.5">
            Built by
          </p>
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark tracking-tight mb-5">
            A small team with strong opinions
          </h2>
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-6 flex gap-5 maxSm:flex-col hover:border-secondary-light dark:hover:border-secondary-dark transition-colors">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary-light to-secondary-dark dark:from-secondary-dark dark:to-secondary-light flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              OM
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-light dark:text-text-dark mb-0.5">
                Om J Patel
              </h3>
              {/* <p className="text-xs text-secondary-light dark:text-secondary-dark font-medium mb-3">
                Founder · Proven IT Solutions Pvt. Ltd.
              </p> */}
              <p className="text-sm text-text-light/60 dark:text-text-dark/60 leading-relaxed mb-4">
                Backend engineer from Gujarat, India. I build SaaS tools and
                business automation systems. Invoicely started as an internal
                tool and grew into a product used by others.
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-secondary-light/10 dark:bg-secondary-dark/10 text-secondary-light dark:text-secondary-dark border border-secondary-light/20 dark:border-secondary-dark/20 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary-light dark:text-secondary-dark mb-2.5">
            What we stand for
          </p>
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark tracking-tight mb-5">
            Core values
          </h2>
          <div className="grid grid-cols-2 maxSm:grid-cols-1 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-5 hover:border-secondary-light dark:hover:border-secondary-dark transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary-light/10 dark:bg-secondary-dark/10 flex items-center justify-center mb-3">
                  {v.icon}
                </div>
                <h4 className="text-sm font-semibold text-text-light dark:text-text-dark mb-1.5">
                  {v.title}
                </h4>
                <p className="text-xs text-text-light/50 dark:text-text-dark/50 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-light dark:bg-primary-dark border border-border-light dark:border-border-dark rounded-2xl p-10 maxSm:p-6 text-center">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
            Ready to create your first invoice?
          </h2>
          <p className="text-sm text-text-light/50 dark:text-text-dark/50 mb-7">
            Free to use. No credit card required.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="/register"
              className="bg-secondary-light dark:bg-secondary-dark text-white font-semibold text-sm px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get started free
            </a>
            <a
              href="/contact"
              className="bg-transparent border border-border-light dark:border-border-dark text-text-light/70 dark:text-text-dark/70 font-medium text-sm px-6 py-2.5 rounded-lg hover:border-secondary-light dark:hover:border-secondary-dark hover:text-text-light dark:hover:text-text-dark transition-all"
            >
              Contact us
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
