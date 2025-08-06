import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import PostFeed from "@/components/PostFeed";
import UserPageSideBar from "@/components/UserPageSideBar";
import { useGetUserByUsername } from "@/hooks/useUser";
import React, { ReactNode } from "react";

const Layout = async ({
  params,
  children,
}: {
  params: Promise<{ username: string }>;
  children: ReactNode;
}) => {
  const { username } = await params;

  return (
    <MaxWidthWrapper>
      <div className="relative w-full grid grid-cols-1 lg:grid-cols-3 gap-y-4 lg:gap-x-4 py-3">
        <div className="relative col-span-2 w-full">
        {children}
        </div>
        <div className="w-full order-first lg:order-last mt-5">
        <UserPageSideBar username={username} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Layout;
