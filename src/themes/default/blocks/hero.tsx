import Image from 'next/image';
// import { ArrowRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
// import { SmartIcon } from '@/shared/blocks/common';
// import { Button } from '@/shared/components/ui/button';
// import { Highlighter } from '@/shared/components/ui/highlighter';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';
import { RaysAnimation } from '@/shared/components/ui/rays-animation';
// import { SocialAvatars } from './social-avatars';

export function Hero({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <section
      id={section.id}
      className={cn(
        'container min-h-screen relative pt-20 md:pt-32 lg:pt-[150px] overflow-hidden flex flex-col items-center justify-center px-4 md:px-6',
        section.className,
        className
      )}
    >
      <div className="text-center mx-auto mb-8 md:mb-0 relative z-10">
        <div className="font-base text-xs md:h-[var(--text-lg)] md:text-lg mr-[-10px] md:mr-[-25px] tracking-[10px] md:tracking-[30px] uppercase text-foreground/60 text-justify after:content-[''] after:inline-block after:w-full">
          {section.subtitle}
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase xl:text-9xl 2xl:text-10xl font-bold text-foreground leading-none tracking-[-0.02em] indent-[-0.3rem] md:indent-[-0.6rem]">
          {section.title}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row mt-6 md:mt-[40px] max-w-7xl mx-auto gap-6 md:gap-0 md:items-start md:justify-center relative z-10">
        <div className="relative md:bottom-[100px] h-[300px] md:h-[550px] md:flex-shrink-0">
          {section.hero_image?.src && (
            <Image
              src={section.hero_image.src}
              alt={section.hero_image.alt || 'Hero'}
              width={section.hero_image.width || 600}
              height={section.hero_image.height || 550}
              className="w-full h-full object-cover mask-radial-[92%_100%] mask-radial-from-80% mask-radial-at-top"
            />
          )}
        </div>

        <div className="mx-0 md:mx-12 my-0 border-l border-foreground/20 h-0 md:h-[400px] hidden md:block md:flex-shrink-0"></div>

        <div className="md:flex-shrink-0">
          <div className="space-y-6 relative z-[3] shadow-[0px_5px_20px_rgba(255,255,255,0.08)] p-3 md:p-4 md:px-3 rounded-[10px]">
            <div className="space-y-3 md:space-y-4">
              <span className="text-xl md:text-2xl font-bold">{section.author_name}</span>
              <p className="text-sm md:text-base text-foreground/70">{section.author_role}</p>
              <div className="space-y-2">
                {section.author_bio?.map((bio: string, idx: number) => (
                  <p key={idx} className="text-foreground/70 max-w-lg text-xs md:text-sm leading-loose">
                    {bio}
                  </p>
                ))}
              </div>
              {section.author_link && (
                <Link href={section.author_link.url || '/author'} className="text-sm text-primary cursor-pointer hover:underline">
                  {section.author_link.title || 'Read More'}
                </Link>
              )}
            </div>

            {section.stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8 pt-3 md:pt-4">
                {section.stats.map((stat: any, idx: number) => (
                  <div key={idx} className="text-center w-fit">
                    <div className="text-2xl md:text-3xl lg:text-4xl text-foreground">{stat.value}</div>
                    <div className="text-xs md:text-sm text-foreground/60 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <RaysAnimation />
    </section>
  );
}
