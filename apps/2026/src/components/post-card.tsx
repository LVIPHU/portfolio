import type { Locale, PostMeta } from "@portfolio/content";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export function PostCard({ post, locale }: { post: PostMeta; locale: Locale }) {
  return (
    <article className="group rounded-xl border bg-card p-6 transition-colors hover:border-ring">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
        <div className="flex gap-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <h2 className="mt-2 text-lg font-semibold group-hover:text-primary">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{post.description}</p>
    </article>
  );
}
