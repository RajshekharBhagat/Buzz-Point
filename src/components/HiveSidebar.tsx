'use client';
import { useGetHiveByName } from '@/hooks/use-hive';
import {Loader2, TriangleAlertIcon } from 'lucide-react';
import React from 'react'
import { buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';
import SubscribeUnsubscribeToggle from './SubscribeUnsubscribe';
import { format } from 'date-fns';
import Link from 'next/link';
import OnlineUsers from './OnlineUsers';

const HiveSidebar = ({hiveName}:{hiveName: string}) => {
    const {data: hiveDetails, isLoading, error} = useGetHiveByName(hiveName);
  if (isLoading) {
    return (
      <div className="relative w-full overflow-hidden">
        <div className="flex flex-col w-full h-full items-center my-28 gap-6">
          <Loader2 className="animate-spin text-green-500 size-16" />
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">Loading...</h1>
        </div>
      </div>
    );
  }
  if (error || !hiveDetails) {
    return (
      <div className="relative w-full overflow-hidden">
        <div className="flex flex-col w-full h-full items-center my-28 gap-6">
          <TriangleAlertIcon className="text-green-500 size-16" />
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">
            hiveDetails not found!
          </h1>
          <Link href={'/'} className={cn(buttonVariants({variant:'link'}))}>
            Go Back
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="sticky top-20 hidden md:block h-fit overflow-hidden shadow-md order-first md:order-last rounded-lg">
            <div className="px-6 bg-green-100 py-4">
              <p className="text-zinc-900 font-semibold">About h/{hiveDetails.name}</p>
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
              {hiveDetails.isSubscribed && (<OnlineUsers hiveId={hiveDetails._id.toString()} />)}
              {hiveDetails.isCreator? (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-gray-500">You created this community.</p>
                </div>
              ) : null}
              <SubscribeUnsubscribeToggle
                hiveName={hiveDetails.name}
                hiveId={hiveDetails._id.toString()}
                isSubscribed={hiveDetails.isSubscribed}
              />
              <Link href={`/h/${hiveName || hiveDetails.name}/chatroom`} className={buttonVariants({variant: "default",className:'w-full'})}>ChatRoom</Link>
            </dl>
          </div>
  )
}

export default HiveSidebar