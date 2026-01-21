import { NextRequest, NextResponse } from 'next/server';
import { createSubscriber } from '@/shared/models/subscriber';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { code: 1, message: 'Email is required' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { code: 1, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 保存到数据库
    await createSubscriber(email);

    return NextResponse.json({
      code: 0,
      message: 'Successfully subscribed! You will receive updates when new posts are published.',
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { code: 1, message: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
