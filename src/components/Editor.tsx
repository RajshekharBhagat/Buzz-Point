"use client";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useToast } from "@/hooks/use-toast";
import { uploadFiles } from "@/lib/uploadthing";
import { PostCreationRequestType, PostValidator } from "@/lib/validators/post";
import EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextAreaAutosize from "react-textarea-autosize";
interface EditorProps {
  hiveId: string;
}

const Editor = ({ hiveId }: EditorProps) => {
  const {loginToast} = useCustomToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequestType>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      title: "",
      content: null,
      hiveId,
    },
  });

  const ref = useRef<EditorJS | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  const initializeEditor = useCallback(async () => {
    if (!isMounted || ref.current) return;
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    // @ts-ignore - Ignore missing type declaration error
    const Embed = (await import("@editorjs/embed")).default;
    // @ts-ignore - Ignore missing type declaration error
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    // @ts-ignore - Ignore missing type declaration error
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;
    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  try {
                    console.log("Uploading File:", file);
                    const uploadedFiles = await uploadFiles("imageUploader", {
                      files: [file],
                    });
                    console.log("Upload response:", uploadedFiles);
                    if (
                      !uploadedFiles ||
                      uploadedFiles.length === 0 ||
                      !uploadedFiles[0]?.ufsUrl
                    ) {
                      throw new Error("File upload failed");
                    }

                    return {
                      success: 1,
                      file: { url: uploadedFiles[0].ufsUrl },
                    };
                  } catch (error) {
                    console.error("Upload Failed:", error);
                    return { success: 0 };
                  }
                },
              },
            },
          },
          list: List,
          code: Code,
          InlineCode: InlineCode,
          embed: Embed,
        },
      });
    }
  }, [isMounted]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef.current?.focus();
      });
    };
    if (isMounted) {
      init();
      return () => {
        ref.current?.destroy();
        ref.current = null;
      };
    }
  }, [isMounted, initializeEditor]);

  const { mutate: createPost } = useMutation({
    mutationFn: async ({ title, content, hiveId }: PostCreationRequestType) => {
      const payload: PostCreationRequestType = {
        title,
        content,
        hiveId,
      };
      const { data } = await axios.post("/api/post/create", payload);
      return data;
    },
    onError: (error) => {
      if(error instanceof AxiosError) {
          if(error.response?.status === 401) {
            return loginToast();
          }
          if(error.response?.status === 400) {
            return toast({
              description: error.response.data.message,
              variant: 'destructive',
            })
          }
          if(error.response?.status === 422) {
            return toast({
              title: "Invalid Post",
              description: error.response.data.message,
              variant: 'destructive',
            })
          }
      } 
      toast({
        title: "Something went wrong.",
        description: "Your post failed to  submit. Please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      const newPathname = pathname.split("/").slice(0, -1).join("/");
      router.push(newPathname);
      router.refresh();
      return toast({
        description: "Your post has been published",
      });
    },
  });

  async function onSubmit(data: PostCreationRequestType) {
    const blocks = await ref.current?.save();
    const payload: PostCreationRequestType = {
      title: data.title,
      content: blocks,
      hiveId,
    };
    createPost(payload);
  }

  const { ref: titleRef, ...rest } = register("title");
  const { toast } = useToast();

  return (
    <div className="w-full p-4 bg-green-50 rounded-lg border border-green-200">
      <form
        id="hive-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextAreaAutosize
            ref={(e) => {
              titleRef(e);
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-2xl font-bld focus:outline-none"
          />
          <div id="editor" className="min-h-[200px]" />
        </div>
      </form>
    </div>
  );
};

export default Editor;
