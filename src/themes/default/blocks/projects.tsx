'use client';

import { LazyImage } from '@/shared/blocks/common';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { AnimatedTitle } from '@/shared/components/ui/animated-title';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function Projects({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <section
      id={section.id}
      className={cn('py-8', section.className, className)}
    >
      <div className="mb-8">
        <AnimatedTitle>
          {section.title}
        </AnimatedTitle>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {section.items?.map((item, idx) => (
            <ScrollAnimation key={idx} delay={idx * 0.1}>
              <div className="project-card p-[16px] bg-primary-foreground relative z-[1] flex h-full flex-col rounded-[24px] shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)]">
                <Link
                  href={item.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer h-full flex flex-col group"
                  title={`View "${item.title}" Project`}
                >
                  <div className="aspect-[1.675/1] overflow-hidden rounded-[4px]">
                    <LazyImage
                      src={item.image?.src ?? ''}
                      alt={item.image?.alt ?? item.title ?? ''}
                      className="aspect-[1.675/1] rounded-[4px] object-cover object-top w-full h-full"
                      width={400}
                      height={240}
                    />
                  </div>

                  <div className="flex-1 my-8">
                    <h3 className="text-2xl font-semibold line-clamp-2 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-auto">
                    {item.github && (
                      <div className="mb-3">
                        <img
                          alt={`GitHub stars for ${item.title}`}
                          className="h-5"
                          src={`https://img.shields.io/github/stars/${item.github}?style=social`}
                        />
                      </div>
                    )}

                    <div className="group/button see-more-button w-full h-12 rounded-xl border border-solid border-border bg-transparent transition-colors duration-200 hover:bg-muted flex items-center justify-center px-5 text-sm text-foreground relative z-1">
                      <span className="text-sm whitespace-nowrap">
                        See more
                      </span>
                      <ArrowRight className="ml-3 h-4 w-0 opacity-0 transition-all duration-200 group-hover/button:opacity-100 group-hover/button:w-4" />
                    </div>
                  </div>
                </Link>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {section.seeAllLink && (
          <Link href={section.seeAllLink.url || '#'} className="block mt-8">
            <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background shadow-xs hover:shadow-xl hover:bg-muted hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 flex items-center gap-2">
              {section.seeAllLink.title}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        )}
      </div>

    </section>
  );
}
