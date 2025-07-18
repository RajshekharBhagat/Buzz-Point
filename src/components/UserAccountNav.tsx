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
          className="h-8 w-8"
          user={{
            name: user.name,
            image: user.image,
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white shadow-md rounded-md" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator/>
        <DropdownMenuItem asChild>
            <Link href={'/'}>Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Link href={'/h/create'}>Create Community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Link href={'/settings'}>Settings</Link>
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
