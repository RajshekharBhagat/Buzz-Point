import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { cn } from "@/lib/utils";
import HiveModel, { Hive } from "@/models/Hives.model";
import PostModel, { ExtendedPost } from "@/models/Post.model";
import {LucideBox, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";


const page = async ({ params }: {params: Promise<{name: string}>}) => {
  const { name } = await params;
  const session = await getAuthSession();
  return (
    <div className="flex flex-col">
      <div className="px-2 py-2">
        <h1 className="text-lg md:text-xl font-semibold">
          h/{name}
        </h1>
      </div>
      <MiniCreatePost session={session} />
      <PostFeed type="hive" hiveName={name} />
    </div>
  );
};

export default page;
