'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { AnimatedTitle } from '@/shared/components/ui/animated-title';
import { cn } from '@/shared/lib/utils';
import type { Section } from '@/shared/types/blocks/landing';

export function Subscribe({
  section,
  className,
  showSeeAll = true,
  posts = [],
}: {
  section: Section;
  className?: string;
  showSeeAll?: boolean;
  posts?: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    author: string;
    image: string;
    url: string;
  }>;
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }

    if (!section.submit?.action) {
      return;
    }

    try {
      setLoading(true);
      const resp = await fetch(section.submit.action, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!resp.ok) {
        throw new Error(`request failed with status ${resp.status}`);
      }

      const { code, message } = await resp.json();
      if (code !== 0) {
        throw new Error(message);
      }

      setLoading(false);

      if (message) {
        toast.success(message);
      }
      setEmail('');
    } catch (e: any) {
      setLoading(false);
      toast.error(e.message || 'subscribe failed');
    }
  };

  return (
    <section
      id={section.id}
      className={cn('py-12 md:py-24', section.className, className)}
    >
      <div className="mb-6 md:mb-8 px-4">
        <AnimatedTitle>
          {section.title || "ScarChin's Posts"}
        </AnimatedTitle>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* 左侧文章列表 */}
          <div className="lg:col-span-2">
            <div className="space-y-6 md:space-y-8">
              {posts.map((post, idx) => (
                <div key={idx}>
                  <Link href={post.url} className="block group">
                    <article className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 transition-colors rounded-xl">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-4 group-hover:text-muted-foreground transition-colors leading-tight">
                          {post.title}
                        </h3>
                        {post.description && (
                          <p className="text-muted-foreground text-base md:text-lg mb-4 md:mb-6 line-clamp-2">
                            {post.description}
                          </p>
                        )}
                        <div className="flex items-center text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-medium">
                          <span>{post.date}</span>
                          {post.author && (
                            <>
                              <span className="mx-2 md:mx-3">·</span>
                              <span>{post.author}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-full sm:w-40 h-48 sm:h-32 rounded-[4px] overflow-hidden bg-muted">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </article>
                  </Link>
                  {idx < posts.length - 1 && (
                    <div className="mt-6 md:mt-8 border-b border-border/50"></div>
                  )}
                </div>
              ))}
            </div>

            {showSeeAll && (
              <div className="mt-6 md:mt-8">
                <Link
                  href="/posts"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background shadow-xs hover:shadow-xl hover:bg-muted hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-10 rounded-md px-6 has-[>svg]:px-4"
                >
                  See all
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* 右侧订阅表单 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  Subscribe
                </h3>
                <p className="text-muted-foreground">
                  Get the latest updates and insights delivered to your inbox
                </p>
              </div>
              <form onSubmit={handleSubscribe}>
                <div className="flex">
                  <Input
                    type="email"
                    className="flex-1 rounded-r-none h-12 text-base"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="rounded-l-none h-12 px-6"
                    disabled={loading}
                  >
                    {loading ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
