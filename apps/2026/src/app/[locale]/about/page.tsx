import type { Metadata } from "next";
import { MapPin, Mail } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { profile, type Locale } from "@portfolio/content";
import { t } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "vi" ? "Giới thiệu" : "About" };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tAbout = await getTranslations("about");

  return (
    <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">{tAbout("title")}</h1>
        <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
          {profile.bio.map((paragraph, i) => (
            <p key={i}>{t(paragraph, locale)}</p>
          ))}
        </div>
      </section>

      <aside className="flex flex-col gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatar}
          alt={profile.name}
          className="aspect-[4/5] w-full rounded-xl border object-cover"
        />
        <div className="rounded-xl border bg-card p-4 text-sm">
          <h2 className="mb-3 font-semibold">{tAbout("quickFacts")}</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {t(profile.location, locale)}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a
                href={`mailto:${profile.email}`}
                className="hover:text-foreground hover:underline"
              >
                {profile.email}
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
