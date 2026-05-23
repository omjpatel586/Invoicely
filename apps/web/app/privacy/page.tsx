const sections = [
  {
    title: 'Information We Collect',
    body: 'Invoicely may collect basic account details, company information, billing records, and usage data necessary to operate the platform. This placeholder policy is provided for design and product preview purposes and will be replaced with a production legal version before public release.',
  },
  {
    title: 'How We Use Information',
    body: 'Collected information may be used to authenticate users, organize billing workflows, maintain company records, improve product reliability, and support customer communication features tied to invoicing and business operations.',
  },
  {
    title: 'Data Handling',
    body: 'We aim to handle business data responsibly, with access controls, structured storage, and operational safeguards appropriate for a modern SaaS workflow. Final legal and compliance language will be published before full launch.',
  },
  {
    title: 'Third-Party Services',
    body: 'Certain workflows may rely on third-party services such as authentication providers, messaging integrations, hosting, and analytics tools. Their use will be disclosed in the final production privacy policy.',
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
        This page currently contains professional placeholder content for early
        product presentation. It is not the final legal privacy policy.
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
