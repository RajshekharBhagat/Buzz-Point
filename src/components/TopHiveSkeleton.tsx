"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopHivesSkeleton() {
  return (
    <div className="flex flex-col rounded-lg shadow-xl overflow-hidden shadow-black/20">
      <Skeleton className="h-10 w-full" />

      <ul className="w-full flex flex-col gap-2 p-2">
        {[...Array(5)].map((_, i) => (
          <li
            key={i}
            className="w-full flex flex-col items-center justify-between px-4 py-2 rounded-xl bg-green-100"
          >
            <span className="flex w-full items-center justify-between gap-2">
              <Skeleton className="h-4 w-20" /> {/* Hive name */}
              <span className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" /> {/* Followers */}
                <Skeleton className="h-4 w-4 rounded-full" /> {/* Chevron */}
              </span>
            </span>

            <Skeleton className="h-3 w-full mt-1" />
          </li>
        ))}
      </ul>
    </div>
  );
}
