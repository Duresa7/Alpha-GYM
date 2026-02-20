import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-56 rounded-xl" />
      <Skeleton className="h-56 rounded-xl" />
      <Skeleton className="h-36 rounded-xl" />
      <Skeleton className="h-11 rounded-xl" />
    </div>
  );
}
