import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PostsClient } from './posts-client';

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('landing');
  const subscribeSection = t.raw('subscribe');
  return (
    <PostsClient 
      locale={locale}
      subscribeConfig={{
        title: subscribeSection.title || 'Subscribe',
        description: subscribeSection.description || 'Get the latest updates and insights delivered to your inbox',
        placeholder: subscribeSection.submit?.input?.placeholder || 'Enter your email address',
        buttonText: subscribeSection.submit?.button?.title || 'Subscribe',
        action: subscribeSection.submit?.action || '/api/subscribe',
      }}
    />
  );
}
