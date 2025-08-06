"use client";
import { initSocket } from "@/lib/socket";
import React, { useEffect, useState } from "react";

const OnlineUsers = ({ hiveName }: { hiveName: string }) => {
  const [userOnline, setUserOnline] = useState<number>(0);

  useEffect(() => {
    const socket = initSocket();

    socket.emit("join-hive", hiveName);

    socket.on(`hiveUserCount:${hiveName}`, (count: number) => {
      console.log(`Users in ${hiveName}: ${count}`);
      setUserOnline(count);
    });

    return () => {
       socket.emit('leave-hive',hiveName);
       socket.off(`hiveUserCount:${hiveName}`)
    };
  }, [hiveName]);
  return <div className="shrink-0 bg-green-200 px-3 py-2 rounded-xl">
    <div className="flex items-center gap-2">
        <h1 className="text-green-800 text-sm font-semibold">Members Online:</h1>
        <p className="text-green-700 text-sm font-semibold">{userOnline}</p>
    </div>
  </div>;
};

export default OnlineUsers;
