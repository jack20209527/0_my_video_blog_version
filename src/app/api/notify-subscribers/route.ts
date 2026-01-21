import { NextRequest, NextResponse } from 'next/server';
import { getAllActiveSubscribers } from '@/shared/models/subscriber';
import { getEmailService } from '@/shared/services/email';
import { NewPostNotification } from '@/shared/blocks/email/new-post-notification';

export async function POST(request: NextRequest) {
  try {
    const { postTitle, postDescription, postUrl, postImage } = await request.json();

    if (!postTitle || !postUrl) {
      return NextResponse.json(
        { code: 1, message: 'Post title and URL are required' },
        { status: 400 }
      );
    }

    // 获取所有活跃订阅者
    const subscribers = await getAllActiveSubscribers();

    if (subscribers.length === 0) {
      return NextResponse.json({
        code: 0,
        message: 'No active subscribers found',
        sent: 0,
      });
    }

    // 获取邮件服务
    const emailService = await getEmailService();

    // 批量发送邮件
    const results = await Promise.allSettled(
      subscribers.map((subscriber) =>
        emailService.sendEmail({
          to: subscriber.email,
          subject: `New Post: ${postTitle}`,
          react: NewPostNotification({
            postTitle,
            postDescription,
            postUrl,
            postImage,
            unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`,
          }),
        })
      )
    );

    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    const failedCount = results.filter((r) => r.status === 'rejected').length;

    return NextResponse.json({
      code: 0,
      message: `Notifications sent successfully`,
      sent: successCount,
      failed: failedCount,
      total: subscribers.length,
    });
  } catch (error) {
    console.error('Notify subscribers error:', error);
    return NextResponse.json(
      { code: 1, message: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
