import { getBlogPosts } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "SettleLens Blog — Divorce Financial Planning Guides",
    description:
      "Expert guides on divorce financial planning, settlement calculations, and jurisdiction-specific property division rules.",
    alternates: {
      canonical: `https://settlelens.com/${lang}/blog`,
    },
  };
}

const COUNTRY_LABELS: Record<string, string> = {
  US: "🇺🇸 US",
  UK: "🇬🇧 UK",
  DE: "🇩🇪 DE",
  FR: "🇫🇷 FR",
  ES: "🇪🇸 ES",
  TR: "🇹🇷 TR",
};

const LANG_LABELS: Record<string, string> = {
  en: "All",
  tr: "Türkçe",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
};

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  const posts = getBlogPosts(lang);

  return (
    <div className="mx-auto max-w-4xl py-12 px-4">
      <div className="mb-10 text-center">
        <h1
          className="text-3xl font-bold text-[#1C2B3A] sm:text-4xl"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Divorce Financial Planning Guides
        </h1>
        <p className="mt-3 text-[#8B7355]">
          Understand your financial options before you negotiate.
        </p>
        <p className="mt-1 text-xs text-[#8B7355]">
          For informational purposes only. Not legal or financial advice.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-[#8B7355]">
          <p>Articles coming soon. Check back shortly.</p>
          <Link
            href={`/${lang}`}
            className="mt-4 inline-block text-sm text-[#C8973A] hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${lang}/blog/${post.slug}`}
              className="group rounded-xl border border-[#D4C5B0] bg-white p-6 hover:border-[#C8973A] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <time className="text-xs text-[#8B7355]">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                {post.country && (
                  <span className="text-xs bg-[#F7F3EE] px-2 py-0.5 rounded-full text-[#8B7355]">
                    {COUNTRY_LABELS[post.country] ?? post.country}
                  </span>
                )}
              </div>
              <h2
                className="text-lg font-bold text-[#1C2B3A] group-hover:text-[#C8973A] transition-colors leading-snug"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-[#8B7355] line-clamp-3">
                {post.description}
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-[#F7F3EE] text-[#2E4D6B] px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-xl bg-[#1C2B3A] p-8 text-center text-white">
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Ready to model your settlement?
        </h2>
        <p className="mt-2 text-sm text-gray-300">
          Use SettleLens to compare scenarios and understand your financial
          position.
        </p>
        <Link
          href={`/${lang}/register`}
          className="mt-4 inline-block rounded-lg bg-[#C8973A] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Start Free Analysis →
        </Link>
      </div>
    </div>
  );
}
