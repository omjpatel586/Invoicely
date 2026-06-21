export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-body-light dark:bg-body-dark text-text-light dark:text-text-dark">
      {/* HERO */}
      <section className="bg-primary-light dark:bg-primary-dark border-b border-border-light dark:border-border-dark px-6 py-16 text-center">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-secondary-light dark:text-secondary-dark border border-secondary-light dark:border-secondary-dark bg-secondary-light/10 dark:bg-secondary-dark/10 px-4 py-1.5 rounded-full mb-5">
          Support &amp; Inquiries
        </span>
        <h1 className="text-4xl maxSm:text-2xl font-bold tracking-tight text-text-light dark:text-text-dark mb-3">
          Get in touch
        </h1>
        <p className="text-base text-text-light/60 dark:text-text-dark/60 max-w-md mx-auto leading-relaxed">
          We&apos;re here to help. Reach out for support, feedback, or
          partnership inquiries.
        </p>
      </section>

      {/* MAIN */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-14 maxSm:py-8">
        {/* INFO CARDS */}
        <div className="grid grid-cols-4 maxMd:grid-cols-2 maxSm:grid-cols-1 gap-4 mb-10">
          {[
            {
              label: 'Email',
              value: 'connect.omjpatel@gmail.com',
              icon: (
                <svg
                  className="w-5 h-5 stroke-secondary-light dark:stroke-secondary-dark"
                  fill="none"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 7 10-7" />
                </svg>
              ),
            },
            {
              label: 'Response time',
              value: 'Within 24 hours',
              icon: (
                <svg
                  className="w-5 h-5 stroke-secondary-light dark:stroke-secondary-dark"
                  fill="none"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              ),
            },
            {
              label: 'Based in',
              value: 'Gujarat, India',
              icon: (
                <svg
                  className="w-5 h-5 stroke-secondary-light dark:stroke-secondary-dark"
                  fill="none"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              ),
            },
            // {
            //   label: 'Legal entity',
            //   value: 'Proven IT Solutions Pvt. Ltd.',
            //   icon: (
            //     <svg
            //       className="w-5 h-5 stroke-secondary-light dark:stroke-secondary-dark"
            //       fill="none"
            //       strokeWidth={1.8}
            //       strokeLinecap="round"
            //       strokeLinejoin="round"
            //       viewBox="0 0 24 24"
            //     >
            //       <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
            //     </svg>
            //   ),
            // },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-5 hover:border-secondary-light dark:hover:border-secondary-dark transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-secondary-light/10 dark:bg-secondary-dark/10 flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <p className="text-[11px] uppercase tracking-widest text-text-light/40 dark:text-text-dark/40 mb-1.5">
                {item.label}
              </p>
              <p className="text-sm font-medium text-text-light dark:text-text-dark leading-snug">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* FORM CARD */}
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-10 maxSm:p-6">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-1">
            Send us a message
          </h2>
          <p className="text-sm text-text-light/50 dark:text-text-dark/50 mb-8">
            Fill out the form below and we&apos;ll get back to you as soon as
            possible.
          </p>

          <form className="space-y-5">
            <div className="grid grid-cols-2 maxSm:grid-cols-1 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-light/60 dark:text-text-dark/60">
                  Your name
                </label>
                <input
                  type="text"
                  placeholder="Om Patel"
                  className="bg-body-light dark:bg-body-dark border border-border-light dark:border-border-dark rounded-lg px-3.5 py-2.5 text-sm text-text-light dark:text-text-dark placeholder-text-light/25 dark:placeholder-text-dark/25 outline-none focus:border-secondary-light dark:focus:border-secondary-dark focus:ring-2 focus:ring-secondary-light/20 dark:focus:ring-secondary-dark/20 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-light/60 dark:text-text-dark/60">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="bg-body-light dark:bg-body-dark border border-border-light dark:border-border-dark rounded-lg px-3.5 py-2.5 text-sm text-text-light dark:text-text-dark placeholder-text-light/25 dark:placeholder-text-dark/25 outline-none focus:border-secondary-light dark:focus:border-secondary-dark focus:ring-2 focus:ring-secondary-light/20 dark:focus:ring-secondary-dark/20 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-light/60 dark:text-text-dark/60">
                Subject
              </label>
              <select className="bg-body-light dark:bg-body-dark border border-border-light dark:border-border-dark rounded-lg px-3.5 py-2.5 text-sm text-text-light dark:text-text-dark outline-none focus:border-secondary-light dark:focus:border-secondary-dark focus:ring-2 focus:ring-secondary-light/20 dark:focus:ring-secondary-dark/20 transition-all appearance-none cursor-pointer">
                <option value="general">General inquiry</option>
                <option value="support">Technical support</option>
                <option value="billing">Billing question</option>
                <option value="partnership">Partnership</option>
                <option value="bug">Report a bug</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-light/60 dark:text-text-dark/60">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Describe your question or issue..."
                className="bg-body-light dark:bg-body-dark border border-border-light dark:border-border-dark rounded-lg px-3.5 py-2.5 text-sm text-text-light dark:text-text-dark placeholder-text-light/25 dark:placeholder-text-dark/25 outline-none focus:border-secondary-light dark:focus:border-secondary-dark focus:ring-2 focus:ring-secondary-light/20 dark:focus:ring-secondary-dark/20 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-secondary-light dark:bg-secondary-dark text-white font-semibold text-sm py-3 rounded-lg hover:opacity-90 active:scale-[0.99] transition-all"
            >
              Send message
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
