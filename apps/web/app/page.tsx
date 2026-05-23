import Link from 'next/link';
import {
  FiArrowRight,
  FiCheckCircle,
  FiFileText,
  FiLayers,
  FiPackage,
  FiSend,
  FiShield,
  FiTruck,
  FiUsers,
} from 'react-icons/fi';

const featureCards = [
  {
    title: 'Invoices and Sales Bills',
    description:
      'Create polished business documents quickly without repeating manual work every billing cycle.',
    icon: FiFileText,
  },
  {
    title: 'GST-Ready Billing',
    description:
      'Organize compliant invoicing flows with clear tax handling for modern Indian businesses.',
    icon: FiShield,
  },
  {
    title: 'E-Way Bill Workflow',
    description:
      'Support goods movement workflows when invoice values and transport requirements demand fast execution.',
    icon: FiTruck,
  },
  {
    title: 'Products and Services',
    description:
      'Keep your catalog, pricing, and business records structured in one place.',
    icon: FiPackage,
  },
  {
    title: 'Vendors and Customers',
    description:
      'Maintain relationships, contact details, and billing history without scattered spreadsheets.',
    icon: FiUsers,
  },
  {
    title: 'Multi-Company Management',
    description:
      'Operate across multiple business entities from a single login and a unified workflow.',
    icon: FiLayers,
  },
];

const workflowSteps = [
  'Create invoices and business records faster',
  'Manage products, vendors, and companies in one workspace',
  'Send invoices through WhatsApp-driven workflows with less manual effort',
];

const businessTypes = [
  'Small and medium businesses',
  'Retailers and wholesalers',
  'Traders and distributors',
  'Service providers',
  'Transport and logistics operations',
];

const trustHighlights = [
  'Built around GST-focused business workflows',
  'Structured company records with secure sign-in',
  'Multi-company readiness for growing operations',
  'Professional invoicing and document handling',
  'Easy invoice sharing and payment follow-up workflows',
  'E-way bill support when high-value goods are transported',
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-border-light/70 bg-[radial-gradient(circle_at_top_left,_rgba(79,157,166,0.24),_transparent_35%),linear-gradient(135deg,_rgba(245,250,255,0.98),_rgba(224,242,255,0.92))] px-8 py-10 shadow-[0_30px_100px_rgba(79,157,166,0.12)] dark:border-border-dark/70 dark:bg-[radial-gradient(circle_at_top_left,_rgba(255,107,107,0.18),_transparent_35%),linear-gradient(135deg,_rgba(27,31,59,0.98),_rgba(18,18,18,0.96))] maxSm:px-5 maxSm:py-7">
        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-secondary-light/15 blur-3xl dark:bg-secondary-dark/10" />
        <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-primary-dark/8 blur-3xl dark:bg-primary-light/5" />

        <div className="relative grid gap-8 minLg:grid-cols-[1.2fr_0.8fr] minLg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary-light/30 bg-white/75 px-4 py-2 text-sm font-medium text-secondary-light shadow-sm backdrop-blur dark:border-secondary-dark/30 dark:bg-primary-dark/65 dark:text-secondary-dark">
              <span className="h-2 w-2 rounded-full bg-secondary-light dark:bg-secondary-dark" />
              Professional invoicing is coming soon on web and Play Store
            </div>

            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-text-light dark:text-text-dark maxMd:text-4xl maxSm:text-3xl">
                Smart invoicing for businesses that want less paperwork and
                more control.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 maxSm:text-base maxSm:leading-7">
                Invoicely helps businesses manage invoices, GST-ready billing,
                products, vendors, and multi-company operations from one clean
                workspace built for real-world workflows.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 rounded-xl bg-secondary-light px-5 py-3 font-medium text-white transition hover:translate-y-[-1px] hover:bg-[#438f97] dark:bg-secondary-dark dark:text-white dark:hover:bg-[#ff5a5a]"
              >
                Sign In
                <FiArrowRight />
              </Link>
              <span className="inline-flex items-center rounded-xl border border-border-light bg-white/80 px-5 py-3 font-medium text-text-light dark:border-border-dark dark:bg-primary-dark/70 dark:text-text-dark">
                Public launch coming soon
              </span>
            </div>

            <div className="grid gap-3 minSm:grid-cols-3">
              <div className="rounded-2xl border border-border-light bg-white/80 p-4 shadow-sm dark:border-border-dark dark:bg-card-dark/75">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Built For
                </p>
                <p className="mt-2 text-lg font-semibold">Modern Indian SMEs</p>
              </div>
              <div className="rounded-2xl border border-border-light bg-white/80 p-4 shadow-sm dark:border-border-dark dark:bg-card-dark/75">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Workflow
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Billing, catalog, vendor, compliance
                </p>
              </div>
              <div className="rounded-2xl border border-border-light bg-white/80 p-4 shadow-sm dark:border-border-dark dark:bg-card-dark/75">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Channels
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Web today, app visibility next
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border-light bg-white/90 p-5 shadow-[0_25px_60px_rgba(15,23,42,0.12)] dark:border-border-dark dark:bg-card-dark/90">
            <div className="rounded-[1.5rem] bg-primary-light p-5 dark:bg-primary-dark">
              <div className="flex items-center justify-between border-b border-border-light pb-4 dark:border-border-dark">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    Invoicely Preview
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    One flow for billing and operations
                  </h2>
                </div>
                <span className="rounded-full bg-secondary-light/15 px-3 py-1 text-xs font-medium text-secondary-light dark:bg-secondary-dark/20 dark:text-secondary-dark">
                  Coming Soon
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-card-dark">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Current focus
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        Tax Invoice INV-2026-0048
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      Ready to issue
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 minSm:grid-cols-2">
                    <div className="rounded-xl bg-primary-light p-3 dark:bg-primary-dark">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        Vendor
                      </p>
                      <p className="mt-2 font-medium">Shree Traders</p>
                    </div>
                    <div className="rounded-xl bg-primary-light p-3 dark:bg-primary-dark">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        Total
                      </p>
                      <p className="mt-2 font-medium">₹63,250.00</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 minSm:grid-cols-3">
                  <div className="rounded-2xl border border-border-light bg-white p-4 dark:border-border-dark dark:bg-card-dark">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Product lines
                    </p>
                    <p className="mt-2 text-2xl font-semibold">124</p>
                  </div>
                  <div className="rounded-2xl border border-border-light bg-white p-4 dark:border-border-dark dark:bg-card-dark">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Companies
                    </p>
                    <p className="mt-2 text-2xl font-semibold">6</p>
                  </div>
                  <div className="rounded-2xl border border-border-light bg-white p-4 dark:border-border-dark dark:bg-card-dark">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Shared to WhatsApp
                    </p>
                    <p className="mt-2 text-2xl font-semibold">89%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 minLg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] border border-border-light bg-card-light p-7 dark:border-border-dark dark:bg-card-dark">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-secondary-light dark:text-secondary-dark">
            Why Invoicely
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight maxSm:text-2xl">
            Replace fragmented billing work with one professional operating
            layer.
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
            Invoicely is designed for teams that need faster invoicing, cleaner
            records, clearer GST-driven workflows, and a more polished business
            presence. It reduces repeat effort across billing, product
            management, vendor handling, and payment follow-up.
          </p>
        </div>

        <div className="grid gap-4 minSm:grid-cols-2">
          {workflowSteps.map((step) => (
            <div
              key={step}
              className="rounded-[1.5rem] border border-border-light bg-white p-5 shadow-sm dark:border-border-dark dark:bg-card-dark"
            >
              <FiCheckCircle className="text-2xl text-secondary-light dark:text-secondary-dark" />
              <p className="mt-4 text-lg font-medium leading-8">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.9rem] border border-border-light bg-white p-7 dark:border-border-dark dark:bg-card-dark">
        <div className="flex flex-col gap-3 minLg:flex-row minLg:items-end minLg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-secondary-light dark:text-secondary-dark">
              Core Features
            </p>
            <h2 className="mt-3 text-3xl font-semibold maxSm:text-2xl">
              Everything needed to run invoicing with more discipline.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
            Built around day-to-day operational needs instead of generic
            templates, so businesses can move faster without losing structure.
          </p>
        </div>

        <div className="mt-8 grid gap-4 minSm:grid-cols-2 minLg:grid-cols-3">
          {featureCards.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-[1.5rem] border border-border-light bg-primary-light/45 p-5 transition hover:translate-y-[-2px] hover:shadow-md dark:border-border-dark dark:bg-primary-dark/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-light/15 text-secondary-light dark:bg-secondary-dark/15 dark:text-secondary-dark">
                <Icon className="text-xl" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-[1.4rem] border border-dashed border-secondary-light/35 bg-secondary-light/6 p-5 dark:border-secondary-dark/35 dark:bg-secondary-dark/6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-secondary-light shadow-sm dark:bg-card-dark dark:text-secondary-dark">
              <FiSend className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                WhatsApp invoice delivery workflow
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Reduce manual follow-ups by preparing invoices for structured
                sharing and payment collection messaging through WhatsApp-driven
                business flows.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 minLg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-border-light bg-card-light p-7 dark:border-border-dark dark:bg-card-dark">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-secondary-light dark:text-secondary-dark">
            Built For
          </p>
          <h2 className="mt-3 text-3xl font-semibold maxSm:text-2xl">
            Made for businesses with real billing pressure.
          </h2>
          <div className="mt-6 grid gap-3">
            {businessTypes.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-border-light bg-white px-4 py-4 text-base font-medium dark:border-border-dark dark:bg-primary-dark/50"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-border-light bg-[linear-gradient(135deg,_rgba(79,157,166,0.08),_rgba(255,255,255,1))] p-7 dark:border-border-dark dark:bg-[linear-gradient(135deg,_rgba(255,107,107,0.08),_rgba(44,47,74,0.95))]">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-secondary-light dark:text-secondary-dark">
            Trust and Credibility
          </p>
          <h2 className="mt-3 text-3xl font-semibold maxSm:text-2xl">
            Grounded in compliance-heavy business realities.
          </h2>
          <div className="mt-6 space-y-3">
            {trustHighlights.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-border-light bg-white/80 px-4 py-4 dark:border-border-dark dark:bg-card-dark/70"
              >
                <FiCheckCircle className="mt-1 shrink-0 text-lg text-secondary-light dark:text-secondary-dark" />
                <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border-light bg-primary-dark px-8 py-8 text-white shadow-[0_30px_80px_rgba(27,31,59,0.32)] dark:border-border-dark maxSm:px-5">
        <div className="flex flex-col gap-6 minLg:flex-row minLg:items-center minLg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-secondary-dark">
              Final Call
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight maxSm:text-2xl">
              Start with the platform today, and watch the full public product
              rollout arrive professionally.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-200">
              Sign in to the current experience, follow the product as it grows,
              and prepare for the coming web and Play Store rollout.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 rounded-xl bg-secondary-dark px-5 py-3 font-medium text-white transition hover:translate-y-[-1px] hover:bg-[#ff5a5a]"
            >
              Continue to Sign In
              <FiArrowRight />
            </Link>
            <span className="inline-flex items-center rounded-xl border border-white/20 px-5 py-3 font-medium text-white/90">
              Public release coming soon
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
