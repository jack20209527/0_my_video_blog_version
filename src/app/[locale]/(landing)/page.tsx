import { getTranslations, setRequestLocale } from 'next-intl/server';
import moment from 'moment';

import { getThemePage } from '@/core/theme';
import { DynamicPage, Section } from '@/shared/types/blocks/landing';
import { getPosts, PostStatus, PostType } from '@/shared/models/post';

export const revalidate = 3600;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('landing');

  const showSections = [
    'hero',
    'projects',
    'introduce',
    'benefits',
    'usage',
    'features',
    'stats',
    'testimonials',
    'subscribe',
    'faq',
    'cta',
  ];

  // build page sections
  const page: DynamicPage = {
    sections: showSections.reduce<Record<string, Section>>((acc, section) => {
      const sectionData = t.raw(section) as Section;
      if (sectionData) {
        acc[section] = sectionData;
      }
      return acc;
    }, {}),
  };

  // 获取最新3篇文章
  const dbPosts = await getPosts({
    type: PostType.ARTICLE,
    status: PostStatus.PUBLISHED,
    page: 1,
    limit: 3,
  });

  const posts = dbPosts.map((post) => ({
    id: post.id,
    title: post.title || '',
    description: post.description || '',
    date: moment(post.createdAt).format('MMM DD'),
    author: post.authorName || '',
    image: post.image || '/imgs/posts/default.png',
    url: `/${locale}/posts/${post.slug}`,
  }));

  // 将posts数据注入到subscribe section
  if (page.sections?.subscribe) {
    page.sections.subscribe.posts = posts;
  }

  // load page component
  const Page = await getThemePage('dynamic-page');

  return <Page locale={locale} page={page} />;
}
