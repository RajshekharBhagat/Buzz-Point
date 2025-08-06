import { User } from "@/models/User.model";
import React, { FC } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { Icons } from "./Icons";
import { AvatarProps } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps extends AvatarProps {
  user?: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, className, ...props }) => {
  return (
    <Avatar className={cn("relative size-10 select-none", className)} {...props}>
      {user?.image ? (
        <Image
          fill
          src={user.image}
          alt={user?.name ?? "Profile picture"}
          referrerPolicy="no-referrer"
          className="rounded-full object-cover"
        />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name ?? "User"}</span>
          <Icons.user className="h-5 w-5 text-muted-foreground" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
