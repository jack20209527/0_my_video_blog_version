import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import moment from 'moment';

import { BlogPost } from '@/themes/default/blocks/blog-post';
import { findPost, PostStatus } from '@/shared/models/post';

export const revalidate = 3600;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const postData = await findPost({ slug, status: PostStatus.PUBLISHED });
  
  if (!postData) {
    notFound();
  }

  const post = {
    title: postData.title || '',
    date: moment(postData.createdAt).format('MMM DD, YYYY'),
    content: postData.content || '',
    author: postData.authorName || '',
    image: postData.image || '',
  };

  return <BlogPost post={post} />;
}
