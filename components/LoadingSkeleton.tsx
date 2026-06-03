"use client";

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
