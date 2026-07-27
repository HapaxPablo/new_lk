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


export function LoaderSkeletonRow() {
  return (
    <div className='container mx-auto w-full p-4'>
      <div className="animate-pulse w-full flex flex-row items-center gap-4"> {/* Добавлен w-full */}
        <div className="h-8 bg-gray-400 rounded mb-4 w-1/4"></div>
        <div className="h-8 bg-gray-400 rounded mb-4 w-1/4"></div>
        <div className="h-8 bg-gray-400 rounded mb-4 w-1/4"></div>
        <div className="h-8 bg-gray-400 rounded mb-4 w-1/4"></div>
      </div>
    </div>
  )
}
