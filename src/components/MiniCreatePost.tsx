"use client";

import { ImageIcon, Link } from "lucide-react";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import UserAvatar from "./UserAvatar";
import { Input } from "./ui/input";

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost = ({ session }: MiniCreatePostProps) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="bg-green-100 h-fit px-2 py-2 rounded-lg shadow-md">
      <div className="flex items-center justify-between gap-1.5">
        <div className="relative">
          <UserAvatar user={session?.user} />
          <span className="absolute size-2 ring-2 ring-emerald-100 bg-green-500 rounded-full bottom-0 right-0 " />
        </div>
        <Input readOnly className="bg-emerald-50" placeholder="Create post" onClick={() => router.push(pathname + '/submit')} />
        <Button onClick={() => router.push(pathname + '/submit')} variant={'ghost'}><ImageIcon className="text-zinc-500" /></Button>
        <Button onClick={() => router.push(pathname + '/submit')} variant={'ghost'}><Link className="text-zinc-500" /></Button>
      </div>
    </div>
  );
};

export default MiniCreatePost;
