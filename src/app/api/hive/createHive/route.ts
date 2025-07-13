import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { CreateHiveValidator } from "@/lib/validators/hive";
import HiveModel from "@/models/Hives.model";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getAuthSession();
        const user = session?.user;
        if(!session || !user) {
            return new Response(
              JSON.stringify({
                success: false,
                message: "Unauthorized Request",
              }),
              { status: 401 }
            );
        }
        const userId = user.id;
        const body = await req.json();
        const {name,description} = CreateHiveValidator.parse(body);

        const existHive = await HiveModel.findOne({name: name});

        if(existHive) {
            return new Response(
              JSON.stringify({
                success: false,
                message: "Hive with the name already exist.",
              }),
              { status: 409 }
            );
        }

        const hive = new HiveModel({
            name: name,
            description: description,
            creator: userId,
        });

        await hive.save();
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Hive created Successfully.',
            data: hive,
          }),
          { status: 201}
        )

    } catch (error) {
      console.log('There is a problem creating new Hive: ',error);
        if(error instanceof z.ZodError) {
          return new Response(
            JSON.stringify({
              success: false,
              message: error.message,
            }),
            {status: 422}
          )
        }
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Failed to create a new hive.',
          }),{
            status: 500,
          }
        )
    }
}