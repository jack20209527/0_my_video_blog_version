import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SubscribeForm } from './subscribe-form';

export const revalidate = 3600;

export default async function SubscribePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('landing');
  const subscribeSection = t.raw('subscribe');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[95%] sm:max-w-lg">
        <div className="bg-card text-card-foreground flex flex-col gap-4 md:gap-6 rounded-xl border py-4 md:py-6 shadow-sm">
          <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 md:px-6 text-center">
            <div className="font-semibold text-xl md:text-2xl">Subscribe</div>
            <div className="text-muted-foreground text-base md:text-lg">
              Get the latest updates and insights delivered to your inbox
            </div>
          </div>
          <div className="px-4 md:px-6">
            <div className="w-full max-w-md mx-auto">
              <SubscribeForm action={subscribeSection.submit?.action || '/api/subscribe'} />
              <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-muted-foreground">
                <p>We respect your privacy. Unsubscribe at any time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
