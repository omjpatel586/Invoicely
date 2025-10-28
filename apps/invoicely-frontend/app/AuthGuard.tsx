import { redirect } from 'next/navigation';
import { getAuthToken } from '../libs/auth';

export default async function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const authToken = await getAuthToken();

  if (!authToken) {
    redirect('/signin');
  }

  return <>{children}</>;
}
