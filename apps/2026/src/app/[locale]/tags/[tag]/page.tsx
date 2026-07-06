import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllTags, getPostsByTag, type Locale } from "@portfolio/content";
import { Link } from "@/i18n/navigation";
import { PostCard } from "@/components/post-card";

export function generateStaticParams() {
  // Union tag của cả 2 locale
  const tags = new Set([
    ...getAllTags("vi").map(({ tag }) => tag),
    ...getAllTags("en").map(({ tag }) => tag),
  ]);
  return [...tags].map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${decodeURIComponent(tag)}` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ locale: Locale; tag: string }>;
}) {
  const { locale, tag: rawTag } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const tag = decodeURIComponent(rawTag);
  const posts = getPostsByTag(tag, locale);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/tags"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("allTags")}
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        {t("postsTaggedWith")} <span className="text-primary">#{tag}</span>
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </div>
  );
}
