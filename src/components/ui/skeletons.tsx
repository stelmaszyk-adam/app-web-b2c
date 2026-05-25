function Pulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[var(--radius-md)] bg-surface-mid ${className ?? ""}`}
    />
  );
}

export function EventCardSkeleton() {
  return (
    <div className="bg-surface-high flex gap-3 rounded-[var(--radius-lg)] p-3">
      {/* Thumbnail */}
      <Pulse className="h-28 w-28 shrink-0 rounded-[var(--radius-md)]" />

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 py-1">
        <Pulse className="h-4 w-16 rounded-full" />
        <Pulse className="h-3 w-24" />
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-3/4" />
        <div className="mt-auto flex items-center gap-1.5">
          <Pulse className="h-3 w-3 rounded-full" />
          <Pulse className="h-3 w-32" />
        </div>
        <Pulse className="h-4 w-16" />
      </div>
    </div>
  );
}

export function EventCardListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function VenueProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1.5">
        <Pulse className="h-4 w-20" />
        <Pulse className="h-4 w-4 rounded-full" />
        <Pulse className="h-4 w-16" />
        <Pulse className="h-4 w-4 rounded-full" />
        <Pulse className="h-4 w-32" />
      </div>

      {/* Hero image */}
      <Pulse className="aspect-[21/9] w-full rounded-[var(--radius-xl)]" />

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        {/* Left column */}
        <div className="flex-1 space-y-6">
          <Pulse className="h-9 w-64" />
          <Pulse className="h-5 w-48" />

          {/* Stats row */}
          <div className="bg-surface-low flex items-center gap-6 rounded-[var(--radius-lg)] px-4 py-3">
            <Pulse className="h-5 w-24" />
            <Pulse className="h-5 w-24" />
            <Pulse className="h-5 w-20" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Pulse className="h-6 w-32" />
            <Pulse className="h-4 w-full" />
            <Pulse className="h-4 w-full" />
            <Pulse className="h-4 w-3/4" />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-full shrink-0 space-y-4 lg:w-80">
          <Pulse className="h-56 w-full rounded-[var(--radius-xl)]" />
          <Pulse className="h-32 w-full rounded-[var(--radius-xl)]" />
        </div>
      </div>
    </div>
  );
}

export function MapPinsSkeleton() {
  return (
    <div className="relative h-full w-full animate-pulse overflow-hidden rounded-[var(--radius-lg)] bg-surface-mid">
      {/* Fake map grid lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-0 h-full w-px bg-on-surface-muted" />
        <div className="absolute left-2/4 top-0 h-full w-px bg-on-surface-muted" />
        <div className="absolute left-3/4 top-0 h-full w-px bg-on-surface-muted" />
        <div className="absolute left-0 top-1/3 h-px w-full bg-on-surface-muted" />
        <div className="absolute left-0 top-2/3 h-px w-full bg-on-surface-muted" />
      </div>

      {/* Fake pin dots */}
      {[
        { top: "25%", left: "30%" },
        { top: "40%", left: "55%" },
        { top: "60%", left: "40%" },
        { top: "35%", left: "70%" },
        { top: "55%", left: "25%" },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute h-3 w-3 rounded-full bg-primary/30"
          style={{ top: pos.top, left: pos.left }}
        />
      ))}
    </div>
  );
}
