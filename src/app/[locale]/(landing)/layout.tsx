import { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';

import { getThemeLayout } from '@/core/theme';
import {
  Footer as FooterType,
  Header as HeaderType,
} from '@/shared/types/blocks/landing';

export default async function LandingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getTranslations('landing');
  const Layout = await getThemeLayout('landing');
  const header: HeaderType = t.raw('header');
  const footer: FooterType = t.raw('footer');

  return (
    <Layout header={header} footer={footer}>
      {children}
    </Layout>
  );
}
