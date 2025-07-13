"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateHivePayload } from "@/lib/validators/hive";
import { useToast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
const Page = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: createHive, isPending } = useMutation({
    mutationFn: async () => {
      const payload: CreateHivePayload = {
        name: name,
        description: description,
      };
      const { data: response } = await axios.post(
        "/api/hive/createHive",
        payload
      );
      return response;
    },
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message || "Your hive is created successfully.",
        variant: "default",
      });
      router.push(`/b/${response.data.name}`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: "Hive already exist.",
            description: "Please choose a different hive name.",
            variant: "destructive",
          });
        }
        if (error.response?.status === 422) {
          return toast({
            title: "Invalid hive name.",
            description: "Please choose a name between 3 and 21 characters.",
            variant: "destructive",
          });
        }
        if (error.response?.status === 401) {
          return loginToast();
        }
      }
      toast({
        title: "There was an error.",
        description: "Could not create hive.",
        variant: "destructive",
      });
    },
  });

  return (
    <MaxWidthWrapper className="flex pt-10">
      <div className="max-w-xl rounded-lg bg-emerald-50 p-4 mx-auto w-full">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-lg md:text-xl font-semibold">
            Create new Community.
          </h1>
          <Separator className="bg-emerald-200 h-px" />
          <div className="flex w-full items-center gap-1.5 max-w-md mx-auto">
            <p className="text-lg font-medium">Name:</p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white flex-grow"
            />
          </div>
          <div className="flex w-full items-center gap-1.5 max-w-md mx-auto">
            <p className="text-lg font-medium">Description:</p>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white flex-grow"
            />
          </div>
          <p className="text-xs text-zinc-600">
            Hive name including capitalization cannot be changed.{" "}
          </p>
          <div className="flex max-w-md w-full justify-end items-center gap-6">
            <Button variant={"outline"} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              onClick={() => createHive()}
              isLoading={isPending}
              disabled={name.length === 0}
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
