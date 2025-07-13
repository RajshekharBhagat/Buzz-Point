import CustomFeed from "@/components/CustomFeed";
import GeneralFeed from "@/components/GeneralFeed";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await getAuthSession();
  return(
    <MaxWidthWrapper className="pt-5">
      <h1 className="font-bold text-3xl md:text-4xl">Your Feed</h1>
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {session ?  <CustomFeed />:<GeneralFeed /> }
        {/* your hive information */}
        <div className="lg:sticky lg:top-20 my-10 rounded-lg overflow-hidden h-fit border border-emerald-200 order-last">
          <div className="bg-emerald-100 px-6 py-4">
            <p className="flex items-center py-3 font-semibold gap-1.5"><HomeIcon className="w-4 h-4" />Home</p>
          </div>
          <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-900">Your personal BuzzPoint homepage. Come here to check in with your favorite communities.</p>
            </div>
          <Link href={'h/create'} className={buttonVariants({className:'w-full mt-4 mb-6'})}>
            Create a new Hive
          </Link>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}