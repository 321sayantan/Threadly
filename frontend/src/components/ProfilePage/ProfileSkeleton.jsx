// ProfileSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "../ui/card";

export const ProfileSkeleton = () => (
    <div className="min-h-screen animate-pulse">
      <div className="max-w-4xl mx-auto">
        {/* Cover ------------------------------------------------ */}
        <Skeleton className="h-48 md:h-64 w-4xl rounded-t-4xl" />

        {/* Avatar + basic info skeleton */}
        <div className="relative px-6 pb-6 -mt-12 md:-mt-16">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Avatar */}
            <Skeleton className="w-28 h-28 md:w-35 md:h-35 rounded-full border-4 border-white" />

            {/* Stats */}
            <div className="flex gap-6 mt-4 ml-0 md:ml-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="w-10 h-6 rounded" />
                  <Skeleton className="w-12 h-4 mt-1 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Name / title / meta */}
          <div className="mt-4 space-y-2">
            <Skeleton className="w-48 h-8 rounded" />
            <Skeleton className="w-36 h-5 rounded" />
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-32 h-4 rounded" />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <Skeleton className="w-24 h-10 rounded-md" />
            <Skeleton className="w-20 h-10 rounded-md" />
            <Skeleton className="w-10 h-10 rounded-md" />
          </div>
        </div>

        {/* Content sections skeleton --------------------------------- */}
        <div className="px-6 space-y-8 pb-8">
          {["About", "Experience", "Education", "Certificates", "Posts"].map(
            (title) => (
              <div key={title} className="space-y-4">
                <Skeleton className="w-32 h-7 rounded" />
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    {[...Array(title === "Posts" ? 4 : 3)].map((_, i) => (
                      <Skeleton key={i} className="h-5 w-full rounded" />
                    ))}
                  </CardContent>
                </Card>
              </div>
            )
          )}
        </div>
      </div>
    </div>
);
