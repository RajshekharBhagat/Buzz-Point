"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDeletePostById,
  useIsPostSaved,
  useSavePostById,
  useUnsavePostById,
} from "@/hooks/use-post";
import { Bookmark, BookmarkX, MoreHorizontal, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface PostOptionsProps {
  postId: string;
  author: string;
  hiveName?: string;
}

const PostOptions = ({ postId, author, hiveName }: PostOptionsProps) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isUserPost = session?.user.id === author;

  const { data: isSaved } = useIsPostSaved(postId, !!session?.user);
  const { mutate: deletePost, isPending: isDeletePending } = useDeletePostById(
    postId,
    hiveName
  );
  const { mutate: savePost, isPending: isSavePending } =
    useSavePostById(postId);
  const { mutate: unSavePost, isPending: isUnsavePending } =
    useUnsavePostById(postId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      {session?.user && (
        <DropdownMenuContent align="end" className="w-[10rem] bg-white">
          {isSaved ? (
            <DropdownMenuItem onClick={() => unSavePost()}>
              <BookmarkX className="mr-2 h-4 w-4" />
              Unsave
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => savePost()}>
              <Bookmark className="mr-2 h-4 w-4" />
              Save
            </DropdownMenuItem>
          )}
          {isUserPost && (
            <DropdownMenuItem
              onClick={() => deletePost()}
              className="text-red-500 focus:text-red-500"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
          
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default PostOptions;
