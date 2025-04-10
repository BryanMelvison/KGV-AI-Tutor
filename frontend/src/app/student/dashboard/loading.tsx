export default function DashboardLoading() {
  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Header Skeleton */}
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
