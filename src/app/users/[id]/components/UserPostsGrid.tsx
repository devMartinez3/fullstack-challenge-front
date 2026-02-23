import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/authStore";

interface UserPostsGridProps {
  posts?: any[];
  openEditModal: (post: any) => void;
  setPostToDelete: (id: string) => void;
  isDeletePending: boolean;
}

export function UserPostsGrid({
  posts,
  openEditModal,
  setPostToDelete,
  isDeletePending,
}: UserPostsGridProps) {
  const { user } = useAuthStore();

  if (!posts || posts.length === 0) {
    return (
      <div className="grid gap-4 overflow-y-auto max-h-[calc(100vh-27.5rem)] md:max-h-[calc(100vh-23.5rem)] z-10">
        <p className="text-muted-foreground col-span-full">
          No hay posts todavía.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 m-0 overflow-y-auto max-h-[calc(100vh-27.5rem)] md:max-h-[calc(100vh-23.5rem)] md:grid-cols-2 lg:grid-cols-3 py-2">
      {posts.map((post: any) => (
        <Card
          key={post.id}
          className="flex flex-col hover:z-20 transition-transform duration-300 hover:scale-[1.02]"
        >
          <CardHeader>
            <CardTitle className="text-lg">{post.title}</CardTitle>
            <CardDescription className="text-xs">
              {new Date(post.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-gray-700 line-clamp-4 break-all text-left">
                    {post.content}
                  </p>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] break-all">
                  <p>{post.content}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
          <CardFooter className="flex gap-2 border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => openEditModal(post)}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Editar
            </Button>
            {user && user.role === "ADMIN" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setPostToDelete(post.id)}
                disabled={isDeletePending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
