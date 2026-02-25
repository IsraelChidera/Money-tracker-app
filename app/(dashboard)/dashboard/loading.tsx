export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Banner skeleton */}
      <div className="h-24 rounded-2xl bg-white/5" />

      {/* Stats skeletons */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/5" />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="h-64 rounded-2xl bg-white/5 lg:col-span-2" />
        <div className="h-64 rounded-2xl bg-white/5" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="h-56 rounded-2xl bg-white/5" />
        <div className="h-56 rounded-2xl bg-white/5" />
      </div>
    </div>
  );
}
