import { House } from 'lucide-react';
import Link from 'next/link';

import { MarkdownPreview } from '@/shared/blocks/common';
import { type Post as PostType } from '@/shared/types/blocks/blog';

export async function PageDetail({ post }: { post: PostType }) {
  return (
    <section id={post.id}>
      <Link
        href="/"
        className="text-base-content cursor-pointer hover:opacity-80 transition-opacity"
      >
        <House className="text-2xl mx-8 my-8" />
      </Link>
      <div className="text-md max-w-3xl mx-auto leading-loose pt-4 pb-8 px-8 prose prose-slate dark:prose-invert prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-base-content prose-code:text-base-content prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
        {post.body ? (
          <>{post.body}</>
        ) : (
          <>
            {post.content && <MarkdownPreview content={post.content} />}
          </>
        )}
      </div>
    </section>
  );
}
