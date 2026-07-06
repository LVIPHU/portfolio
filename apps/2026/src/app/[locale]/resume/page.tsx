import type { Metadata } from "next";
import { Download } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resume, type Locale } from "@portfolio/content";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatMonth, t } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Resume" };
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tResume = await getTranslations("resume");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{tResume("title")}</h1>
        <a
          href="/resume.pdf"
          download
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Download className="h-4 w-4" /> {tResume("download")}
        </a>
      </div>

      {/* Experience */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">{tResume("experience")}</h2>
        <div className="mt-4 space-y-6 border-l pl-6">
          {resume.experience.map((item, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
              <p className="text-sm text-muted-foreground">
                {formatMonth(item.start, locale)} —{" "}
                {item.end ? formatMonth(item.end, locale) : tResume("present")}
              </p>
              <h3 className="mt-0.5 font-semibold">
                {t(item.role, locale)}{" "}
                <span className="font-normal text-muted-foreground">
                  · {item.company}
                </span>
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {item.summary.map((line, j) => (
                  <li key={j}>{t(line, locale)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">{tResume("education")}</h2>
        <div className="mt-4 space-y-4">
          {resume.education.map((item, i) => (
            <div key={i} className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                {item.start} — {item.end}
              </p>
              <h3 className="font-semibold">{item.school}</h3>
              <p className="text-sm text-muted-foreground">
                {t(item.degree, locale)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">{tResume("skills")}</h2>
        <div className="mt-4 space-y-4">
          {resume.skills.map((group, i) => (
            <div key={i}>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                {t(group.label, locale)}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
