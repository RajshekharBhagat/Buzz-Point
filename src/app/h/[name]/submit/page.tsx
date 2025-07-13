import Editor from "@/components/Editor";
import { Button } from "@/components/ui/button";
import dbConnect from "@/lib/dbConnect";
import HiveModel, { Hive } from "@/models/Hives.model";

const page = async({params}:{params: Promise<{name: string}>}) => {
    const {name:hiveName} = await params;
    await dbConnect();
    const hive = await HiveModel.findOne<Hive>({name: hiveName}) as Hive;
    return (
        <div className="flex flex-col mt-4 gap-6">
            <div className="border-b-2 border-emerald-300 pb-2">
                <div className="flex flex-wrap gap-1.5 items-baseline">
                    <h3 className="text-gray-900 leading-6 font-semibold text-base">Create Post</h3>
                    <p className="text-gray-700 truncate text-sm">in b/{hiveName}</p>
                </div>
            </div>
            <Editor hiveId={hive._id.toString()} />
            <div className="w-full flex justify-end">
                <Button className="w-full" type="submit" form="hive-post-form">Post</Button>
            </div>
        </div>

    );
};

export default page;