import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  lang: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  country?: string;
  state?: string;
  content: string;
}

export function getBlogPosts(lang: string): BlogPost[] {
  const dir = path.join(process.cwd(), "content", "blog", lang);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const { data, content } = matter(raw);
      return {
        ...data,
        slug: f.replace(".mdx", ""),
        content,
        lang,
      } as BlogPost;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getBlogPost(lang: string, slug: string): BlogPost | null {
  const filePath = path.join(
    process.cwd(),
    "content",
    "blog",
    lang,
    `${slug}.mdx`
  );
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { ...data, slug, content, lang } as BlogPost;
}
