import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { getAuthSession } from "@/lib/auth";


const page = async ({ params }: {params: Promise<{name: string}>}) => {
  const { name } = await params;
  const session = await getAuthSession();

  return (
    <div className="flex flex-col">
      <div className="px-2 py-2 flex items-center justify-between">
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
