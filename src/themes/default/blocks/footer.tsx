import { Link } from '@/core/i18n/navigation';
import { Twitter, Github, Mail } from 'lucide-react';
import { Footer as FooterType } from '@/shared/types/blocks/landing';

const iconMap: Record<string, any> = {
  RiTwitterXFill: Twitter,
  Twitter: Twitter,
  Github: Github,
  Mail: Mail,
};

export function Footer({ footer }: { footer: FooterType }) {
  return (
    <section id={footer.id} className="py-16">
      <div className="max-w-7xl mx-auto px-8">
        <footer>
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left">
            {/* 左侧品牌和社交媒体 */}
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              <div>
                <div className="flex items-center justify-center gap-2 lg:justify-start">
                  {footer.brand?.logo && (
                    <img
                      src={footer.brand.logo.src}
                      alt={footer.brand.logo.alt || footer.brand.title || ''}
                      className="h-11"
                    />
                  )}
                  <p className="text-3xl font-semibold">
                    {footer.brand?.title || ''}
                  </p>
                </div>
                {footer.brand?.description && (
                  <p className="mt-6 text-md text-muted-foreground">
                    {footer.brand.description}
                  </p>
                )}
              </div>

              {/* 社交媒体图标 */}
              {footer.social && (
                <ul className="flex items-center space-x-6 text-muted-foreground">
                  {footer.social.items.map((item, index) => {
                    const IconComponent = item.icon ? iconMap[item.icon as keyof typeof iconMap] : null;
                    return (
                      <li
                        key={index}
                        className="font-medium hover:text-primary"
                      >
                        <a
                          href={item.url || '#'}
                          target={item.target || '_blank'}
                          aria-label={item.title || 'Social link'}
                        >
                          {IconComponent && <IconComponent className="size-4" />}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* 右侧导航 */}
            <div className="grid grid-cols-3 gap-6 lg:gap-20">
              {footer.nav?.items.map((item, idx) => (
                <div key={idx}>
                  <p className="mb-6 font-bold">{item.title}</p>
                  <ul className="space-y-4 text-sm text-muted-foreground">
                    {item.children?.map((subItem, iidx) => (
                      <li key={iidx} className="font-medium hover:text-primary">
                        <a
                          target={subItem.target || '_self'}
                          href={subItem.url || '#'}
                        >
                          {subItem.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 底部版权和链接 */}
          <div className="mt-8 flex flex-col justify-between gap-4 border-t pt-8 text-center text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-left">
            <p>
              © 2025 • {footer.brand?.title || 'ScarChin'} All rights reserved.
              <a
                href="https://shipany.ai/?ivt=scarqin"
                target="_blank"
                className="px-2 text-primary"
              >
                build with ShipAny
              </a>
            </p>
            {footer.agreement && (
              <ul className="flex justify-center gap-4 lg:justify-start">
                {footer.agreement.items.map((item, index) => (
                  <li key={index} className="hover:text-primary">
                    <a href={item.url || '#'}>{item.title}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </footer>
      </div>
    </section>
  );
}
