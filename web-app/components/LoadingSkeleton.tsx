export default function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 animate-pulse">
          <div className="h-4 rounded-full" style={{ backgroundColor: 'var(--color-neutral-200)', width: `${60 + (i % 3) * 15}%` }} />
          <div className="h-3 rounded-full" style={{ backgroundColor: 'var(--color-neutral-100)', width: `${40 + (i % 2) * 20}%` }} />
        </div>
      ))}
    </div>
  )
}
