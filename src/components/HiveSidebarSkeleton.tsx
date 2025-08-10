import React from 'react'
import { Skeleton } from './ui/skeleton'

const HiveSidebarSkeleton = () => {
  return (
    <div className="sticky top-20 hidden md:block h-fit overflow-hidden shadow-md order-first md:order-last rounded-lg">
      <div className="px-6 bg-green-100 py-4">
        <Skeleton className="h-5 w-40" />
      </div>
      <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
        <div className="flex justify-between gap-x-4 py-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="pt-4">
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
        <div className="pt-3">
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </dl>
    </div>
  )
}

export default HiveSidebarSkeleton