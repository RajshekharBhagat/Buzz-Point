import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import HiveModel, { Hive } from "@/models/Hives.model";
import PostModel, { ExtendedPost } from "@/models/Post.model";
import { LucideBox } from "lucide-react";
import { notFound } from "next/navigation";


const page = async ({ params }: {params: Promise<{name: string}>}) => {
  const { name } = await params;
  await dbConnect();
  const session = await getAuthSession();
  const hive = await HiveModel.findOne<Hive>({ name })
    .select("name description creator")
    .lean();
  const initialPost = await PostModel.find<ExtendedPost>({ hive: hive?._id })
    .select('-__v').populate('author') 
    .lean();
  if (!hive) return notFound();
  if(!initialPost) {
    return(
      <>
      <MiniCreatePost session={session} />
      <div className="pt-20 flex flex-col items-center justify-center">
        <LucideBox className="w-20 h-20 text-green-300 animate-bounce" />
        <span className="text-gray-500">No Posts Yet</span>
      </div>
      </>
    )
  }
  return (
    <div className="flex flex-col">
      <div className="px-2 py-2">
        <h1 className="text-lg md:text-xl font-semibold">
          h/{hive.name}
        </h1>
      </div>
      <MiniCreatePost session={session} />
      <PostFeed hiveName={hive.name} initialPost={initialPost ? JSON.parse(JSON.stringify(initialPost)) : null} />
    </div>
  );
};

export default page;
