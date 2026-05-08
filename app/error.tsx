"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--cream)] px-4">
      <h1 className="font-display text-2xl font-semibold text-[var(--navy)]">
        Something went wrong
      </h1>
      <p className="mt-2 font-ui text-sm text-[var(--brown)]">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className={cn(buttonVariants({ variant: "outline" }), "border-[var(--sand)]")}
        >
          Try again
        </button>
        <Link
          href="/en"
          className={cn(buttonVariants(), "bg-[var(--navy)] text-[var(--cream)] hover:bg-[var(--slate)]")}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
