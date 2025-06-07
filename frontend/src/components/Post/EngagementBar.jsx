import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import { CommentDialog } from "./CommentDialog";
import { dislikePost, likePost } from "@/http/api";
import useUserStore from "@/lib/store";

const EngagementBar = ({
  initialLikes,
  initialComments,
  initialShares,
  initialSaved,
  post,
}) => {
  const { user, post: Post, setPost } = useUserStore();
  const like = post.likes.includes(user._id);
  const [liked, setLiked] = useState(like);
  const [likes, setLikes] = useState(initialLikes);
  const [saved, setSaved] = useState(initialSaved);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);

  const handleLike = async () => {
    if (liked) {
      if (likes > 0) {
        await dislikePost(post._id);
        setLikes(likes - 1);
      }
    } else {
      await likePost(post._id);
      setLikes(likes + 1);
    }

    const updatePost = Post.map((p) => {
      if (p._id === post._id && likes > 0) {
        return {
          ...p,
          likes: liked
            ? p.likes.filter((id) => id !== user._id) // Unlike
            : [...p.likes, user._id], // Like
        };
      }
      return p; // Return unchanged post
    });

    // console.log(updatePost);

    setPost(updatePost);
    setLiked(!liked);
  };

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-2 mt-2">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              "flex items-center space-x-1 px-2",
              liked ? "text-red-500" : "text-social-gray hover:text-red-500"
            )}
          >
            <Heart className={cn("!h-5 !w-5", liked && "fill-current")} />
            <span>{likes}</span>
          </Button>

          <CommentDialog
            open={commentsDialogOpen}
            setOpen={setCommentsDialogOpen}
            commentBtn={
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 px-2 text-social-gray hover:text-social-blue"
                onClick={() => setCommentsDialogOpen(true)}
              >
                <MessageCircle className="!h-5 !w-5" />
                <span>{initialComments}</span>
              </Button>
            }
          />

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 px-2 text-social-gray hover:text-social-purple"
          >
            <Share2 className="!h-5 !w-5" />
            <span>{initialShares}</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSaved(!saved)}
          className={cn(
            "px-2",
            saved
              ? "text-social-purple"
              : "text-social-gray hover:text-social-purple"
          )}
        >
          <Bookmark className={cn("!h-5 !w-5", saved && "fill-current")} />
        </Button>
      </div>

      <div className="flex items-center text-xs text-social-gray mb-4">
        <div className="flex -space-x-1 mr-2">
          <div className="w-5 h-5 rounded-full bg-blue-500 border border-white"></div>
          <div className="w-5 h-5 rounded-full bg-purple-500 border border-white"></div>
          <div className="w-5 h-5 rounded-full bg-gray-500 border border-white"></div>
          <div className="w-5 h-5 rounded-full bg-gray-600 border border-white"></div>
        </div>
        <p>
          Liked by <span className="font-medium">Sarah Chen</span> and{" "}
          <span className="font-medium">{likes - 1} others</span>
        </p>
      </div>
    </div>
  );
};

export default EngagementBar;
