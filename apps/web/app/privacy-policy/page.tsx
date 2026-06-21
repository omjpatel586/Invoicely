const sections = [
  {
    title: 'Who we are',
    body: 'Invoicely is a GST-compliant invoicing and business management platform built for Indian businesses — from small retailers to logistics providers. We help you generate invoices, manage vendors, track products, and handle e-way bills from a single dashboard.',
  },
  {
    title: 'What we collect',
    body: 'When you sign in with Google, we receive your name, email address, and profile picture — nothing more. Inside the app, we store the business data you enter: company details, GST numbers, product catalogs, vendor records, and invoices. We do not collect any financial credentials or payment card information.',
  },
  {
    title: 'How we use it',
    body: 'Your data is used solely to operate the platform — to generate your invoices, keep your records organised, and let you manage multiple companies from one account. We do not sell your data, share it with advertisers, or use it for any purpose outside of running Invoicely for you.',
  },
  {
    title: 'Third-Party Services',
    body: `We use Google OAuth for authentication and MongoDB for secure data storage. GST verification is handled via an external government-linked API. These services process only the minimum data necessary to perform their function.

Invoicely may display ads served by Google AdSense. Google's own privacy policy governs how ad-related data is handled on their end.`,
  },
  {
    title: 'Data security',
    body: 'All data is transmitted over HTTPS and stored with access controls in place. Your auth token is never exposed to third parties. We follow standard security practices, but no system is completely risk-free — please keep your Google account secure.',
  },
  {
    title: 'Your rights',
    body: 'You can request deletion of your account and associated data at any time by contacting us. You may also request an export of your business data. We honour these requests within 7 working days.',
  },
  {
    title: 'Cookies',
    body: 'We use minimal session cookies required for authentication. Google AdSense may use cookies to serve relevant ads. You can manage cookie preferences through your browser settings.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl rounded-[2rem] border border-border-light bg-card-light p-8 dark:border-border-dark dark:bg-card-dark maxSm:p-5">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-secondary-light dark:text-secondary-dark">
        Privacy Policy
      </p>
      <h1 className="mt-3 text-4xl font-semibold maxSm:text-3xl">
        Privacy information for Invoicely
      </h1>
      <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
        **Effective date:** May 24, 2026
      </p>

      <div className="mt-8 space-y-5">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-[1.5rem] border border-border-light bg-white p-5 dark:border-border-dark dark:bg-primary-dark/35"
          >
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
        **Questions?** Contact us at connect.omjpatel@gmail.com
      </p>
    </div>
  );
}
