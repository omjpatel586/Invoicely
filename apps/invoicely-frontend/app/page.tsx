import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardPage from '../views/dashboardPage/page';

const Home = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('invoicelyAppAuthToken');

  if (!token) {
    // Redirect to signin if token missing
    redirect('/signin');
  }

  return <DashboardPage token={token.value} />;
};

export default Home;
