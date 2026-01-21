'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';

interface AnimatedTitleProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export function AnimatedTitle({
  children,
  className,
  delay = 0,
  threshold = 0.1,
}: AnimatedTitleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return (
    <h2
      ref={ref}
      className={cn(
        'relative z-[3] mt-[10px] md:mt-[20px] mb-[20px] md:mb-[40px] mx-auto w-max text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[54px] transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
    >
      <span
        className={cn(
          'inline-flex pb-1 chroma-text transition-all duration-500',
          isVisible && 'chroma-text-animate animate-chroma-sweep'
        )}
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </h2>
  );
}
