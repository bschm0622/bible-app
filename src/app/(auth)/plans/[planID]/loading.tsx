// app/plans/[planId]/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Title skeleton */}
      <div className="h-8 bg-gray-200 rounded-md w-1/3 animate-pulse" />
      
      {/* Description skeleton */}
      <div className="h-4 bg-gray-200 rounded-md w-2/3 animate-pulse" />
      
      {/* Entries skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="border p-4 rounded-lg space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse" />
        </div>
      ))}
    </div>
  );
}