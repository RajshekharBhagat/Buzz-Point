import MainSideBar from "@/components/MainSideBar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import PostFeed from "@/components/PostFeed";


export default async function Home() {
  return(
    <MaxWidthWrapper className="pt-5">
      <h1 className="font-bold text-xl md:text-2xl">Your Feed</h1>
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <div className="relative col-span-2 w-full">
        <PostFeed type="feed" />
        </div>
        <MainSideBar />
      </div>
    </MaxWidthWrapper>
  )
}