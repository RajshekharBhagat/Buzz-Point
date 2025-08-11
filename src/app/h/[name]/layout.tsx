import HiveSidebar from "@/components/HiveSidebar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{name: string}>;
}) => {
  const { name } = await params;
  return (
    <MaxWidthWrapper className="px-0 md:px-2.5 py-0">
      <div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4">
          <div className="flex flex-col col-span-2">{children}</div>
          <HiveSidebar hiveName={name} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Layout;
