import { NextRequest, NextResponse } from 'next/server';
import { unsubscribe } from '@/shared/models/subscriber';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { code: 1, message: 'Email is required' },
        { status: 400 }
      );
    }

    await unsubscribe(email);

    return NextResponse.json({
      code: 0,
      message: 'Successfully unsubscribed. You will no longer receive email notifications.',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { code: 1, message: 'Failed to unsubscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
