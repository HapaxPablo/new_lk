interface LoaderSkeletonProps {
  className?: string
}

export default function LoaderSkeleton({ className }: LoaderSkeletonProps) {
  return (
    <div className={`container mx-auto w-full p-4 ${className || ''}`}>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-400 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-400 rounded"></div>
          <div className="h-4 bg-gray-400 rounded "></div>
          <div className="h-4 bg-gray-400 rounded "></div>
        </div>
      </div>
    </div>
  )
}
