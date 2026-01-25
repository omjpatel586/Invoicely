'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAuthToken } from '../../libs/auth';
import ScreenLoader from '../../views/components/loader';
import { loginUserNextJSClient } from '../../views/utils/auth';
import { signInWithGoogle } from './firebaseConfig';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signIn = async () => {
    try {
      const result = await signInWithGoogle();
      const userIdToken = await result.user.getIdToken();
      setLoading(true);
      await loginUserNextJSClient(userIdToken);
      setLoading(false);
      toast.success('Google Login Successful!');
      router.push('/');
    } catch {
      toast.error('Google Login Failed!');
    }
  };

  useEffect(() => {
    const redirectToDashboardIfAlreadySignIn = async () => {
      const token = await getAuthToken();
      if (token) {
        router.push('/');
      }
    };

    redirectToDashboardIfAlreadySignIn();
  }, [router]);

  if (loading) {
    return <ScreenLoader />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="p-10 bg-white rounded-2xl shadow-lg w-full max-w-md text-center flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Digital invoicing, effortless management 🚀
          </h1>
          <p className="text-gray-500 mb-8">
            Securely sign in to manage companies, clients, products, and
            invoices — all in one dashboard.
          </p>

          <button
            className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-white border border-gray-300 shadow-sm hover:shadow-md transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            onClick={signIn}
          >
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
