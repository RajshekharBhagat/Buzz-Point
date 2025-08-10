"use client";

import { useEffect, useState } from "react";
import { initSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";

interface Props {
  hiveId: string;
}

export default function OnlineUsers({ hiveId }: Props) {
  const [count, setCount] = useState(0);
  const {data: session, status} =  useSession();
  useEffect(() => {
    if(status !== 'authenticated') return;
    const socket = initSocket(session?.accessToken);
    socket.emit("join-hive", hiveId);

    socket.on(`hiveOnlineMembers:${hiveId}`, (newCount: number) => {
      setCount(newCount);
    });

    return () => {
      socket.emit("leave-hive", hiveId);
      socket.off(`hiveOnlineMembers:${hiveId}`);
    };
  }, [hiveId, status,session?.accessToken]);

  return (
    <div className="flex justify-between gap-x-4 py-3">
      <dt className="text-gray-500">Online</dt>
      <dd className="text-gray-700">{count}</dd>
    </div>
  );
}