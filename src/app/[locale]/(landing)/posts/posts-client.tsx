'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { toast } from 'sonner';

import { AnimatedTitle } from '@/shared/components/ui/animated-title';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

type Post = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  authorName: string;
  createdAt: string;
};

type SubscribeConfig = {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
  action: string;
};

export function PostsClient({
  locale,
  subscribeConfig,
}: {
  locale: string;
  subscribeConfig: SubscribeConfig;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);

  const loadPosts = useCallback(async (pageNum: number) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/posts?page=${pageNum}&limit=10`);
      const data = await response.json();
      
      if (data.code === 0 && data.data) {
        if (data.data.length < 10) {
          setHasMore(false);
        }
        setPosts(prev => pageNum === 1 ? data.data : [...prev, ...data.data]);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }

    try {
      setSubscribing(true);
      const resp = await fetch(subscribeConfig.action, {
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

      setSubscribing(false);

      if (message) {
        toast.success(message);
      }
      setEmail('');
    } catch (e: any) {
      setSubscribing(false);
      toast.error(e.message || 'subscribe failed');
    }
  };

  useEffect(() => {
    loadPosts(1);
  }, []);

  useEffect(() => {
    if (!hasMore || loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          pageRef.current += 1;
          loadPosts(pageRef.current);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadPosts]);

  return (
    <div className="min-h-screen py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-6 md:mb-8 mt-8 md:mt-0">
          <AnimatedTitle>{subscribeConfig.title}</AnimatedTitle>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* 左侧博客列表 */}
          <div className="lg:col-span-2">
            <div className="space-y-6 md:space-y-8">
              {posts.map((post, idx) => (
                <div key={post.id}>
                  <Link href={`/${locale}/posts/${post.slug}`} className="block group">
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
                          <span>{moment(post.createdAt).format('MMM DD')}</span>
                          {post.authorName && (
                            <>
                              <span className="mx-2 md:mx-3">·</span>
                              <span>{post.authorName}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {post.image && (
                        <div className="flex-shrink-0 w-full sm:w-40 h-48 sm:h-32 rounded-[4px] overflow-hidden bg-muted">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </article>
                  </Link>
                  {idx < posts.length - 1 && (
                    <div className="mt-6 md:mt-8 border-b border-border/50"></div>
                  )}
                </div>
              ))}
            </div>

            {hasMore && (
              <div ref={loadMoreRef} className="mt-6 md:mt-8 text-center py-4">
                {loading && <p className="text-muted-foreground">Loading...</p>}
              </div>
            )}

            {!loading && posts.length === 0 && (
              <div className="mt-6 md:mt-8 text-center py-4">
                <p className="text-muted-foreground">No posts yet</p>
              </div>
            )}
          </div>

          {/* 右侧订阅表单 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {subscribeConfig.buttonText}
                </h3>
                <p className="text-muted-foreground">
                  {subscribeConfig.description}
                </p>
              </div>
              <form onSubmit={handleSubscribe}>
                <div className="flex">
                  <Input
                    type="email"
                    className="flex-1 rounded-r-none h-12 text-base"
                    placeholder={subscribeConfig.placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="rounded-l-none h-12 px-6"
                    disabled={subscribing}
                  >
                    {subscribing ? 'Subscribing...' : subscribeConfig.buttonText}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
