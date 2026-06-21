const sections = [
  {
    title: 'Acceptance',
    body: 'By creating an account and using Invoicely, you agree to these terms. If you are using the platform on behalf of a business, you confirm you have the authority to bind that business to these terms.',
  },
  {
    title: 'What Invoicely provides',
    body: 'Invoicely is a business tool — not a licensed accounting firm or tax advisor. The platform helps you generate GST-compliant invoices and manage business records, but you remain responsible for verifying the accuracy of your filings and complying with applicable tax laws.',
  },
  {
    title: 'Your account',
    body: 'You sign in using Google OAuth. You are responsible for all activity that takes place under your account. Do not share your login credentials. Notify us immediately if you suspect unauthorised access.',
  },
  {
    title: 'Your data',
    body: 'You own the business data you enter into Invoicely — your products, vendors, and invoices belong to you. We do not claim any rights over your content. You grant us permission to store and process it solely to provide the service.',
  },
  {
    title: 'Acceptable use',
    body: 'Invoicely is intended for legitimate business use only. You must not use the platform to generate fraudulent invoices, misrepresent GST information, or engage in any activity that violates Indian law. Accounts found in violation may be suspended without notice.',
  },
  {
    title: 'Availability',
    body: 'We aim to keep Invoicely available at all times, but we cannot guarantee uninterrupted access. Scheduled maintenance, third-party outages, or unforeseen issues may occasionally affect the service. We are not liable for losses resulting from downtime.',
  },
  {
    title: 'Changes to the service',
    body: 'We may update or modify the Invoicely service from time to time. We will notify you of any material changes to these terms or the service. Your continued use of the service after such changes constitutes your acceptance of the updated terms.',
  },
  {
    title: 'Limitation of liability',
    body: 'Invoicely is provided as-is. To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the platform, including data loss or inaccurate tax filings.',
  },
  {
    title: 'Governing law',
    body: 'These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Surat, Gujarat.',
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
