import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { projects, type Locale } from "@portfolio/content";
import { ProjectCard } from "@/components/project-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "vi" ? "Dự án" : "Projects" };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const sorted = [...projects].sort((a, b) => b.year - a.year);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("description")}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sorted.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            locale={locale}
            demoLabel={t("demo")}
            sourceLabel={t("source")}
          />
        ))}
      </div>
    </div>
  );
}
