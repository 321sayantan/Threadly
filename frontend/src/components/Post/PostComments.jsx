import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const PostComments = ({ comments }) => {
    const getInitials = (name) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };
  return (
    <div>
      {comments.map((comment) => (
        <Card className="m-2 p-0 border-border bg-card">
          <CardContent className="p-3">
            <div className="flex  space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={comment.author.profilePicture}
                  alt={comment.author.username}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(comment.author.username)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      {comment.author.username}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {/* {formatDistanceToNow(comment.timestamp, {
                      addSuffix: true,
                    })} */}
                      0min
                    </span>
                  </div>

                <p className="text-sm text-foreground leading-relaxed mb-0">
                  {comment.text}
                </p>

              </div>
                {/* {comment.likes !== undefined && ( */}
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <span className="text-x">❤️ {comment.likes}</span>
                  </div>
                {/* )} */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostComments;

// <div className="space-y-4 mb-4">
//   {comments.map((comment) => (
//     <div key={comment._id} className="flex flex-col">
//       <div className="flex items-center gap-2">
//         <span className="font-medium text-sm">
//           {comment?.author.username}
//         </span>
//         <span className="text-xs text-social-gray">
//           {/* {comment?.timestamp} */}
//         </span>
//       </div>
//       <p className="text-sm mt-1">{comment.text}</p>
//     </div>
//   ))}
// </div>
