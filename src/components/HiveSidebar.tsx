"use client";
import { useGetHiveByName } from "@/hooks/use-hive";
import { ChevronsLeftIcon, TriangleAlertIcon } from "lucide-react";
import React from "react";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import SubscribeUnsubscribeToggle from "./SubscribeUnsubscribe";
import { format } from "date-fns";
import Link from "next/link";
import OnlineUsers from "./OnlineUsers";
import HiveSidebarSkeleton from "./HiveSidebarSkeleton";
import { usePathname } from "next/navigation";

const HiveSidebar = ({ hiveName }: { hiveName: string }) => {
  const pathname = usePathname();
  const isChatRoom = pathname.endsWith('chatroom')
  const { data: hiveDetails, isLoading, error } = useGetHiveByName(hiveName);
  if (isLoading) {
    return <HiveSidebarSkeleton />;
  }
  if (error || !hiveDetails) {
    return (
      <div className="relative w-full overflow-hidden">
        <div className="flex flex-col w-full h-full items-center my-28 gap-6">
          <TriangleAlertIcon className="text-green-500 size-16" />
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">
            hiveDetails not found!
          </h1>
          <Link href={"/"} className={cn(buttonVariants({ variant: "link" }))}>
            Go Back
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="sticky top-14 hidden md:block h-fit overflow-hidden shadow-md order-first md:order-last rounded-lg">
      <div className="px-6 bg-green-100 py-4">
        <p className="text-zinc-900 font-semibold">
          About h/{hiveDetails.name}
        </p>
      </div>
      <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Created</dt>
          <dd className="text-gray-700">
            <time dateTime={new Date(hiveDetails.createdAt).toDateString()}>
              {format(hiveDetails.createdAt, "MMMM d, yyyy")}
            </time>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Members</dt>
          <dd className="text-gray-700">{hiveDetails.subscribersCount}</dd>
        </div>
        {hiveDetails.isSubscribed && (
          <OnlineUsers hiveId={hiveDetails._id.toString()} />
        )}
        {hiveDetails.isCreator ? (
          <div className="flex justify-between gap-x-4 py-3">
            <p className="text-gray-500">You created this community.</p>
          </div>
        ) : null}
        <SubscribeUnsubscribeToggle
          hiveName={hiveDetails.name}
          hiveId={hiveDetails._id.toString()}
          isSubscribed={hiveDetails.isSubscribed}
        />
        {hiveDetails.isSubscribed && !isChatRoom && (
          <Link
            href={`/h/${hiveName || hiveDetails.name}/chatroom`}
            className={buttonVariants({
              variant: "default",
              className: "w-full",
            })}
          >
            ChatRoom
          </Link>
        )}
        {isChatRoom && (
          <Link
          href={`/h/${hiveName || hiveDetails.name}`}
          className={buttonVariants({
            variant: "secondary",
            className: "w-full flex items-center gap-2 group",
          })}
        >
          <ChevronsLeftIcon className="text-gray-500 group-hover:text-gray-700 group-hover:mr-2 translate-x-0 duration-300" />
          Go Back
        </Link>
        )}
      </dl>
    </div>
  );
};

export default HiveSidebar;
