'use client';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="p-10 bg-white rounded-2xl shadow-lg w-full max-w-md text-center flex flex-col justify-between">
        {/* Headline */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Digital invoicing, effortless management 🚀
          </h1>
          <p className="text-gray-500 mb-8">
            Securely sign in to manage companies, clients, products, and
            invoices — all in one dashboard.
          </p>

          {/* Google Login Button */}
          <button className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-white border border-gray-300 shadow-sm hover:shadow-md transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
            <Image
              src="/google_icon.svg.webp"
              alt="Google Logo"
              width={20}
              height={20}
            />
            <span className="text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-8">
          By signing in you agree to our{' '}
          <a href="/terms" className="underline hover:text-blue-600">
            Terms
          </a>{' '}
          &{' '}
          <a href="/privacy" className="underline hover:text-blue-600">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
