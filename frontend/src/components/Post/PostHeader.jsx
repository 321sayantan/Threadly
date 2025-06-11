import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Flag,
  Bookmark,
  Share2,
  Ban,
  Clock,
  Trash2,
  Loader2,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useUserStore from "@/lib/store";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { deletePost } from "@/http/api";
import { Badge } from "../ui/badge";

// import { toast } from "@/hooks/use-toast";


const PostHeader = ({ user, timestamp, post }) => {
  const { user: currUser, post: Post, setPost } = useUserStore();

  const handleAction = async (action) => {
    if (action === "SavePost") {
    } 
    else if (action === "SharePost") {
    } 
    else if (action === "DeletePost") {
      const res = await deletePost(post._id);
      const updatedpost = Post.filter((postItem) => postItem._id !== post._id);
      setPost(updatedpost);
      console.log(res)
      toast.success(res.message);
    }
    
  };

  // console.log(currUser)
  // console.log(post)

  return (
    <div className="flex items-center justify-between px-4 mb-3">
      <div className="flex items-center space-x-2">
        <Avatar className="!h-12 !w-12 border-2 border-social-purple-light">
          <AvatarImage src={user.avatar} alt={user.name} className="object-cover"/>
          <AvatarFallback className="bg-social-purple-light dark:text-white text-black">
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center">
            <p className="font-medium text-x">{user.name}</p>

            {/* {user.isVerified && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <svg
                      className="w-4 h-4 ml-1 text-social-blue"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verified Account</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )} */}

            <Badge className="ml-2">Author</Badge>

            {/* {user.connectionDegree && (
              <span className="ml-1 text-xs text-social-gray">
                • {user.connectionDegree}°
              </span>
            )} */}
          </div>
          <p className="text-xs text-social-gray">{user.title}</p>
          <div className="flex items-center text-xs text-social-gray mt-0.5">
            <Clock className="w-3 h-3 mr-1" />
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-social-gray hover:text-purple-500"
        >
          + Follow
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-social-gray hover:text-social-purple"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleAction("SavePost")}>
              <Bookmark className="mr-2 h-4 w-4" />
              <span>Save post</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("SharePost")}>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share post</span>
            </DropdownMenuItem>

            {currUser._id === post.author._id && (
            <DropdownMenuItem onClick={() => handleAction("DeletePost")}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete post</span>
            </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleAction("Report")}
              className="text-red-600"
            >
              <Flag className="mr-2 h-4 w-4" />
              <span>Report post</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction("Block User")}
              className="text-red-600"
            >
              <Ban className="mr-2 h-4 w-4" />
              <span>Block user</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>        
      </div>
    </div>
  );
};

export default PostHeader;
