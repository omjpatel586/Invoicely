// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
import { redirect } from 'next/navigation';
import { getAuthToken } from '../libs/auth';
import DashboardPage from '../views/dashboardPage/page';

const Home = async () => {
  const token = await getAuthToken();

  if (!token) {
    redirect('/signin');
  }

  return <DashboardPage token={token?.value} />;
};

export default Home;
