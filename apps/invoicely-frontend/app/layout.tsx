import { Toaster } from 'react-hot-toast';
import './global.css';

export const metadata = {
  title: 'Invoicely - Smart Invoice Generator',
  description:
    'Invoicely is a user-friendly invoice generation software for companies. Create, manage, and share invoices effortlessly with a modern, secure, and fast solution.',
  keywords: [
    'invoice generator',
    'Invoicely',
    'billing software',
    'company invoices',
    'digital invoicing',
    'NestJS backend',
    'Next.js frontend',
  ],
  authors: [{ name: 'Om J Patel' }],
  // openGraph: {
  //   title: 'Invoicely - Smart Invoice Generator',
  //   description:
  //     'Generate professional invoices instantly. Invoicely makes invoicing simple, fast, and secure for businesses.',
  //   url: 'https://yourdomain.com',
  //   siteName: 'Invoicely',
  //   images: [
  //     {
  //       url: '/assets/logo.png',
  //       width: 1200,
  //       height: 630,
  //       alt: 'Invoicely Logo',
  //     },
  //   ],
  //   locale: 'en_US',
  //   type: 'website',
  // },
  // icons: {
  //   icon: '/assets/logo.png',
  //   shortcut: '/assets/logo.png',
  //   apple: '/assets/logo.png',
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            success: { style: { background: 'green', color: 'white' } },
            error: { style: { background: 'red', color: 'white' } },
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
