import { NextRequest, NextResponse } from 'next/server';
import { getPosts, PostStatus, PostType } from '@/shared/models/post';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const posts = await getPosts({
      type: PostType.ARTICLE,
      status: PostStatus.PUBLISHED,
      page,
      limit,
    });

    return NextResponse.json({
      code: 0,
      data: posts,
      page,
      limit,
    });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { code: 1, message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
