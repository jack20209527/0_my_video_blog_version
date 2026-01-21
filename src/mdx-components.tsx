import React from 'react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { cn } from '@/shared/lib/utils';

// Custom link component with nofollow for external links
const CustomLink = ({
  href,
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  // Check if the link is external
  const isExternal = href?.startsWith('http') || href?.startsWith('//');

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className={cn('text-blue-600 hover:text-blue-800 underline decoration-blue-600', className)}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Internal links
  return (
    <a href={href} className={cn('text-blue-600 hover:text-blue-800 underline decoration-blue-600', className)} {...props}>
      {children}
    </a>
  );
};

// Higher-order component to wrap any link component with nofollow logic
export function withNoFollow(
  LinkComponent: React.ComponentType<
    React.AnchorHTMLAttributes<HTMLAnchorElement>
  >
) {
  return ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // Check if the link is external
    const isExternal = href?.startsWith('http') || href?.startsWith('//');

    if (isExternal) {
      // For external links, add nofollow and pass through to the wrapped component
      return (
        <LinkComponent
          href={href}
          target="_blank"
          rel="nofollow noopener noreferrer"
          {...props}
        >
          {children}
        </LinkComponent>
      );
    }

    // For internal links, just use the wrapped component as-is
    return (
      <LinkComponent href={href} {...props}>
        {children}
      </LinkComponent>
    );
  };
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  const customComponents = {
    a: CustomLink,
    h1: (props: React.ComponentProps<'h1'>) => (
      <h1 className="text-4xl font-bold tracking-tight mb-6" {...props} />
    ),
    h2: (props: React.ComponentProps<'h2'>) => (
      <h2 className="text-3xl font-semibold tracking-tight mb-4 mt-8" {...props} />
    ),
    p: (props: React.ComponentProps<'p'>) => (
      <p className="mb-4 leading-7" {...props} />
    ),
    ul: (props: React.ComponentProps<'ul'>) => (
      <ul className="mb-4 ml-6 list-disc" {...props} />
    ),
    ol: (props: React.ComponentProps<'ol'>) => (
      <ol className="mb-4 ml-6 list-decimal" {...props} />
    ),
    li: (props: React.ComponentProps<'li'>) => (
      <li className="mb-1" {...props} />
    ),
    img: (props: React.ComponentProps<'img'>) => {
      const { src } = props;
      const imageSrc =
        typeof src === 'object' && src !== null && 'src' in src
          ? (src as any).src
          : src;

      return (
        <img
          {...props}
          src={imageSrc}
          className={cn('rounded-lg border', props.className)}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      );
    },
    Video: ({ className, ...props }: React.ComponentProps<'video'>) => (
      <video
        className={cn('rounded-md border', className)}
        controls
        loop
        {...props}
      />
    ),
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
  };

  const mergedComponents = {
    ...defaultMdxComponents,
    ...customComponents,
    ...components,
  };

  return mergedComponents;
}

export const useMDXComponents = getMDXComponents;
