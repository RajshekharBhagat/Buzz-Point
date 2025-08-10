"use client";
import { useToast } from "@/hooks/use-toast";
import { useGetUserByUsername } from "@/hooks/useUser";
import UserAvatar from "./UserAvatar";
import UserPageSideBarSkeleton from "./UserPageSidebarSkeleton";

const UserPageSideBar = ({ username }: { username: string }) => {
  const { data: user, isLoading: isUserLoading } =
    useGetUserByUsername(username);
  const { toast } = useToast();
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(
        `buzz-point.vercel.app/u/${username}`
      );
      toast({
        title: "Profile link copied.",
      });
    } catch (error) {
      console.error("Failed to copy user profile link");
      toast({
        title: "Failed to Copy.",
        variant: "destructive",
      });
    }
  };
  if (isUserLoading) {
    return <UserPageSideBarSkeleton />
  }
  return (
    <>
      {!isUserLoading && user && (
        <div className=" flex flex-col  mt-7 rounded-lg shadow-md shadow-black/20 bg-white p-4">
          <div className="flex flex-row w-full lg:flex-col items-center gap-3">
            <div className="relative size-12 lg:size-20 rounded-full overflow-hidden">
              <UserAvatar user={user} className="size-12 lg:size-20" />
            </div>
            <span className="flex flex-col">
              <h1 className="text-black font-semibold text-sm lg:text-center">
                {user.name}
              </h1>
              <p
                onClick={handleClick}
                className="text-gray-600 text-xs lg:text-center hover:cursor-pointer hover:text-gray-800"
              >{`/u/${user.username}`}</p>
            </span>
          </div>
          <div className="w-full p-2 bg-green-100 mt-4 rounded-lg divide-y-2 divide-green-200 space-y-2">
            <span className="flex items-center justify-between">
              <h1 className="text-xs font-semibold text-green-800">
                Total Posts
              </h1>
              <p className="text-xs text-green-600">{user.totalPosts}</p>
            </span>
            <span className="flex items-center justify-between">
              <h1 className="text-xs font-semibold text-green-800">
                Total Comments
              </h1>
              <p className="text-xs text-green-600">{user.totalComments}</p>
            </span>
            <span className="flex items-center justify-between">
              <h1 className="text-xs font-semibold text-green-800">
                Total Saved
              </h1>
              <p className="text-xs text-green-600">{user.totalSaved}</p>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPageSideBar;
