const sections = [
  {
    title: 'Service Scope',
    body: 'Invoicely is intended to support invoicing, billing workflows, business record management, and related operational features. This page currently provides placeholder terms content and will be replaced with final legal terms before public launch.',
  },
  {
    title: 'User Responsibilities',
    body: 'Users are expected to provide accurate account and business information, maintain secure access to their login credentials, and use the product in accordance with applicable commercial and regulatory requirements.',
  },
  {
    title: 'Availability and Product Changes',
    body: 'Features, workflows, integrations, and availability may evolve as the platform develops. Product previews, early access features, and coming-soon messaging should not be interpreted as guaranteed launch commitments until formally published.',
  },
  {
    title: 'Compliance and Records',
    body: 'Businesses remain responsible for reviewing and validating their invoices, compliance outputs, and operational records. Invoicely is designed to support process quality, but final business accountability remains with the user.',
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl rounded-[2rem] border border-border-light bg-card-light p-8 dark:border-border-dark dark:bg-card-dark maxSm:p-5">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-secondary-light dark:text-secondary-dark">
        Terms of Service
      </p>
      <h1 className="mt-3 text-4xl font-semibold maxSm:text-3xl">
        Terms for using Invoicely
      </h1>
      <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
        This page currently contains professional placeholder content for early
        product presentation. It is not the final legal terms document.
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
    </div>
  );
}
