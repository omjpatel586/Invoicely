'use server';
import { cookies } from 'next/headers';

export async function getAuthToken() {
  const cookieStore = await cookies(); // safely await here
  return cookieStore.get('invoicelyAppAuthToken');
}
