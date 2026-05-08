import { Header } from "./Header";
import { Footer } from "./Footer";
import { Disclaimer } from "./Disclaimer";

type Props = {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
};

export function LegalPageLayout({ title, lastUpdated, children }: Props) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-[var(--navy)]">
          {title}
        </h1>
        {lastUpdated && (
          <p className="mt-1 font-ui text-sm text-[var(--brown)]">
            Last updated: {lastUpdated}
          </p>
        )}
        <Disclaimer variant="full" className="mt-4" />
        <div className="prose prose-neutral mt-8 max-w-none font-body text-[var(--navy)] [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--navy)] [&_a]:text-[var(--gold)]">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
