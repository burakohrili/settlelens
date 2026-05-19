export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 rounded bg-[var(--sand)]" />
        <div className="mt-2 h-4 w-64 rounded bg-[var(--sand)]/60" />
      </div>

      {/* Journey progress bar skeleton */}
      <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
        <div className="h-3 w-24 rounded bg-[var(--sand)] mb-3" />
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className="h-7 w-7 rounded-full bg-[var(--sand)] shrink-0" />
              {i < 4 && <div className="h-0.5 flex-1 bg-[var(--sand)]/50" />}
            </div>
          ))}
        </div>
      </div>

      {/* Narrative insight strip skeleton */}
      <div className="rounded-xl border border-[var(--sand)]/50 bg-[var(--sand)]/10 px-4 py-3">
        <div className="h-4 w-3/4 rounded bg-[var(--sand)]/60" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--sand)] bg-white p-4">
            <div className="h-3 w-20 rounded bg-[var(--sand)]" />
            <div className="mt-2 h-7 w-28 rounded bg-[var(--sand)]/60" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
        <div className="h-4 w-40 rounded bg-[var(--sand)] mb-4" />
        <div className="h-48 w-full rounded bg-[var(--sand)]/40" />
      </div>

      <div className="flex gap-3">
        <div className="h-9 w-36 rounded-md bg-[var(--sand)]" />
        <div className="h-9 w-36 rounded-md bg-[var(--sand)]/60" />
        <div className="h-9 w-28 rounded-md bg-[var(--sand)]/60" />
      </div>
    </div>
  );
}
