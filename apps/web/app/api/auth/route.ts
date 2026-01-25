import { NextResponse } from 'next/server';
import { loginUserClient } from '../../../views/utils/auth';

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const backendRes = await loginUserClient(body.idToken);

    return new NextResponse('success', {
      status: 200,
      headers: {
        'set-cookie': (backendRes.headers['set-cookie'] || [])[0],
      },
    });
  } catch (error: any) {
    console.log(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
