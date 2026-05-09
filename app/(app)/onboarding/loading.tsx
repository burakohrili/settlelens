export default function OnboardingLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--cream)]">
      <div className="w-full max-w-lg space-y-6 px-4 animate-pulse">
        <div className="h-2 w-full rounded-full bg-[var(--sand)]">
          <div className="h-2 w-1/3 rounded-full bg-[var(--gold)]/60" />
        </div>
        <div className="h-8 w-64 rounded bg-[var(--sand)]" />
        <div className="h-4 w-80 rounded bg-[var(--sand)]/60" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border border-[var(--sand)] p-4 space-y-2">
              <div className="h-3 w-24 rounded bg-[var(--sand)]" />
              <div className="h-10 w-full rounded bg-[var(--sand)]/40" />
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <div className="h-10 w-20 rounded-md bg-[var(--sand)]/60" />
          <div className="h-10 w-28 rounded-md bg-[var(--sand)]" />
        </div>
      </div>
    </div>
  );
}
