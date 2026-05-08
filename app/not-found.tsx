import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[var(--navy)] px-4">
        <p className="font-display text-8xl font-bold text-[var(--gold)]">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-[var(--cream)]">
          Page not found
        </h1>
        <p className="mt-2 font-ui text-sm text-[var(--sand)]">
          The page you were looking for does not exist.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/en"
            className={cn(buttonVariants({ variant: "outline" }), "border-[var(--sand)] text-[var(--cream)] hover:bg-[var(--slate)]")}
          >
            Go Home
          </Link>
          <Link
            href="/en/register"
            className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/90 font-semibold")}
          >
            Start Free Analysis
          </Link>
        </div>
      </body>
    </html>
  );
}
