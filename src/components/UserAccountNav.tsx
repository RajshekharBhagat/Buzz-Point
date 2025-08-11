'use client'
import { User } from "@/models/User.model";
import React, { FC } from "react";
import { DropdownMenu, DropdownMenuItem,DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { signOut } from "next-auth/react";


interface UserAccountNavProps {
  user: User;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="size-8"
          user={{
            name: user.name,
            image: user.image,
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white shadow-md rounded-md" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <Link href={`/u/${user.username}`} className="flex flex-col">
            {user.name && <p className="font-medium text-sm">{user.name}</p>}
            {user.username && (
              <p className="w-[200px] truncate text-xs text-zinc-700">
                {user.username}
              </p>
            )}
          </Link>
        </div>
        <DropdownMenuSeparator/>
        <DropdownMenuItem asChild>
            <Link className="text-sm" href={'/'}>Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Link className="text-sm" href={`/u/${user.username}/saved`}>Saved Posts</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Link className="text-sm" href={'/h/create'}>Create Community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Link className="text-sm" href={'/settings'}>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(event) => {
            event.preventDefault();
            signOut({
                callbackUrl: `${window.location.origin}/sign-in`
            })
        }} className="cursor-pointer">
            Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
