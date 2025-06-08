import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router";
import { MessageSquareOff, MoreHorizontal } from "lucide-react";
import Comment from "./Comment";
import PostComments from "./PostComments";

export const CommentDialog = ({ open, setOpen, commentBtn, post }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <>
      {/* <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => {
            setOpen(false);
          }}
        >
          <h1>fghfh</h1>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog> */}
      <Dialog>
        <DialogTrigger aschild>{commentBtn}</DialogTrigger>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="p-0 flex flex-col h-[90%] !w-[80%] !max-w-none"
        >
          <div className="flex flex-1">
            <div className="w-1/2">
              <img
                src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=1170&auto=format&fit=crop"
                alt="Team celebrating"
                className="w-full h-full object-cover rounder-l-lg"
              />
            </div>

            <div className="w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex gap-3 items-center">
                    <Link>
                      <Avatar>
                        <AvatarImage src={post.author.profilePicture} className="object-cover"></AvatarImage>
                        <AvatarFallback>
                          {getInitials(post.author.username)}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <Link className="font-bold">{post.author.username}</Link>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger aschild>
                      <MoreHorizontal className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col text-sm text-center">
                      <div className="w-full cursor-pointer text-red-600">
                        unfollow
                      </div>
                      <div className="w-full cursor-pointer">save post</div>
                      <div className="w-full cursor-pointer">copy link</div>
                      <div className="w-full cursor-pointer text-red-600">
                        report
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <hr className="" />
                {post.comments.length > 0 ? (
                  <PostComments comments={post.comments} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-96">
                    No Comments
                    <MessageSquareOff className="h-20 w-20 mt-5 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="pb-4 ">
                <Comment post={post} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
