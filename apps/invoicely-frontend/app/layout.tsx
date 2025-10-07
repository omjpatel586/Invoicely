import { Toaster } from 'react-hot-toast';
import './global.css';
import Header from '../views/components/Header';
import Footer from '../views/components/Footer';
import ContentWrapper from '../views/components/ContentWrapper';
import { ThemeProvider } from '../views/context/ThemeContext';

export const metadata = {
  title: 'Invoicely – Smart Invoice Generator',
  description:
    'Invoicely is a modern invoice generation platform for businesses. Create, manage, and share invoices with speed, security, and style.',
  keywords: [
    'invoice generator',
    'Invoicely',
    'billing software',
    'company invoices',
    'digital invoicing',
    'NestJS backend',
    'Next.js frontend',
    'secure invoicing',
    'fast invoice creation',
  ],
  authors: [
    { name: 'Om J Patel', url: 'https://www.linkedin.com/in/om-j-patel' },
  ],
  openGraph: {
    title: 'Invoicely – Smart Invoice Generator',
    description:
      'Generate professional invoices instantly. Invoicely makes invoicing simple, fast, and secure for businesses.',
    url: 'https://invoicely.netlify.app',
    siteName: 'Invoicely',
    images: [
      {
        url: '/assets/logo.png',
        width: 1200,
        height: 630,
        alt: 'Invoicely Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/assets/logo.png',
    shortcut: '/assets/logo.png',
    apple: '/assets/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-body-light dark:bg-body-dark text-text-light dark:text-text-dark">
        <ThemeProvider>
          <Header />

          <ContentWrapper>{children}</ContentWrapper>

          <Footer />
          <Toaster
            position="top-center"
            toastOptions={{
              success: { style: { background: 'green', color: 'white' } },
              error: { style: { background: 'red', color: 'white' } },
              duration: 3000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
