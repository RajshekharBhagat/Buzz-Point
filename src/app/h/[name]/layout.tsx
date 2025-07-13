import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import SubscribeUnsubscribeToggle from "@/components/SubscribeUnsubscribe";
import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import HiveModel, { Hive } from "@/models/Hives.model";
import SubscriptionModel from "@/models/Subscription.model";
import { format } from "date-fns";
import { notFound } from "next/navigation";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{name: string}>;
}) => {
  const { name } = await params;
  await dbConnect();
  const session = await getAuthSession();
  const hive = (await HiveModel.findOne({ name: name })
    .select("creator createdAt name upVotes downVotes")
    .lean()) as Hive | null;
  const subscription = !session?.user
    ? undefined
    : await SubscriptionModel.findOne({
        user: session.user.id,
        hive: hive?._id,
      });
  const isSubscribed = Boolean(subscription);
  const subscribersCount = await SubscriptionModel.countDocuments({
    hive: hive?._id,
  });
  if (!hive) return notFound();
  return (
    <MaxWidthWrapper>
      <div>
        {/* TODO: GO Back BUTTON */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>
          <div className="sticky top-20 hidden md:block h-fit overflow-hidden shadow-md  order-first md:order-last rounded-lg">
            <div className="px-6 bg-green-100 py-4">
              <p className="text-zinc-900 font-semibold">About h/{hive.name}</p>
            </div>
            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={hive.createdAt.toDateString()}>
                    {format(hive.createdAt, "MMMM d, yyyy")}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="text-gray-700">{subscribersCount}</dd>
              </div>
              {hive.creator.toString() === session?.user.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-gray-500">You created this community.</p>
                  <p>{hive.id as string}</p>
                </div>
              ) : null}
              <SubscribeUnsubscribeToggle
                hiveName={hive.name}
                hiveId={hive._id.toString()}
                isSubscribed={isSubscribed}
              />
            </dl>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Layout;
