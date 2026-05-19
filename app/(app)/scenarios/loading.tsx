export default function ScenariosLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded bg-[var(--sand)] animate-pulse" />
          <div className="h-4 w-56 rounded bg-[var(--sand)] animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 rounded-md bg-[var(--sand)] animate-pulse" />
          <div className="h-9 w-32 rounded-md bg-[var(--sand)] animate-pulse" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-[var(--sand)] bg-white p-5 space-y-3">
            <div className="h-5 w-3/4 rounded bg-[var(--sand)] animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-[var(--sand)] animate-pulse" />
            <div className="h-8 w-full rounded bg-[var(--sand)] animate-pulse mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
