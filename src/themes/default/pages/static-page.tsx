import { Post as PostType } from '@/shared/types/blocks/blog';
import { PageDetail } from '@/themes/default/blocks';

export default async function StaticPage({
  locale,
  post,
}: {
  locale?: string;
  post: PostType;
}) {
  // 静态页面全屏显示，不受 landing layout 的 header/footer 影响
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <PageDetail post={post} />
    </div>
  );
}
