import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateStaticParams() {
  const langs = ["en", "tr", "de", "fr", "es", "ar"];
  return langs.flatMap((lang) =>
    getBlogPosts(lang).map((post) => ({ lang, slug: post.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getBlogPost(lang, slug);
  if (!post) return {};
  return {
    title: `${post.title} — SettleLens`,
    description: post.description,
    alternates: { canonical: `https://settlelens.com/${lang}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;
  const post = getBlogPost(lang, slug);
  if (!post) notFound();

  const t = await getTranslations({ locale: lang, namespace: "blog" });

  const related = getBlogPosts(lang)
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    publisher: { "@type": "Organization", name: "SettleLens", url: "https://settlelens.com" },
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          {/* Article */}
          <article>
            <Link href={`/${lang}/blog`} className="text-sm text-[#C8973A] hover:underline">
              ← {t("allArticles")}
            </Link>

            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <time className="text-sm text-[#8B7355]">
                  {new Date(post.publishedAt).toLocaleDateString(
                    lang === "ar" ? "ar-SA" : lang === "tr" ? "tr-TR" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </time>
                {post.tags?.map((tag) => (
                  <span key={tag} className="text-xs bg-[#F7F3EE] text-[#2E4D6B] px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <h1
                className="text-3xl font-bold text-[#1C2B3A] leading-tight sm:text-4xl"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {post.title}
              </h1>
              <p className="mt-3 text-lg text-[#8B7355]">{post.description}</p>
            </div>

            <div className="mt-8 prose prose-slate max-w-none prose-headings:font-display prose-a:text-[#C8973A] prose-strong:text-[#1C2B3A]">
              <MDXRemote source={post.content} />
            </div>

            {/* Disclaimer */}
            <div className="mt-10 rounded-lg border border-[#D4C5B0] bg-[#F7F3EE] p-4 text-sm text-[#8B7355]">
              <strong className="text-[#1C2B3A]">{t("disclaimerLabel")}</strong>{" "}
              {t("disclaimerText")}
            </div>

            {/* CTA */}
            <div className="mt-8 rounded-xl bg-[#1C2B3A] p-6 text-white">
              <h2 className="text-lg font-bold" style={{ fontFamily: "Playfair Display, serif" }}>
                {t("postCtaTitle")}
              </h2>
              <p className="mt-1 text-sm text-gray-300">{t("postCtaDesc")}</p>
              <Link
                href={`/${lang}/register`}
                className="mt-4 inline-block rounded-lg bg-[#C8973A] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                {t("postCtaButton")} →
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {related.length > 0 && (
              <div className="rounded-xl border border-[#D4C5B0] bg-white p-5">
                <h3 className="font-semibold text-[#1C2B3A] mb-3" style={{ fontFamily: "Playfair Display, serif" }}>
                  {t("relatedArticles")}
                </h3>
                <ul className="space-y-3">
                  {related.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/${lang}/blog/${p.slug}`} className="text-sm text-[#2E4D6B] hover:text-[#C8973A] transition-colors">
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl bg-[#1C2B3A] p-5 text-white">
              <h3 className="font-semibold mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                {t("sidebarTitle")}
              </h3>
              <p className="text-xs text-gray-300 mb-3">{t("sidebarDesc")}</p>
              <Link
                href={`/${lang}/register`}
                className="block text-center rounded-lg bg-[#C8973A] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                {t("sidebarButton")} →
              </Link>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}
