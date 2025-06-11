import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useUserStore from "@/lib/store";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Calendar, FileText, Image, Smile, Video } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router";

export const CreatePostHeader = () => {
  const { user } = useUserStore();
  const [postContent, setPostContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  function handelCreatePost() {
    navigate("/create-Post", { state: { backgroundLocation: location } });
  }
  return (
    <div onClick={handelCreatePost}>
      <Card className="w-[600px] mb-6 border-social-gray-light p-1">
        <CardContent className="p-2">
          <div className="flex space-x-3">
            <Avatar className="w-14 h-14">
              <AvatarImage
                src={user.profilePicture}
                alt={user.username}
                className="object-cover"
              />
              <AvatarFallback className="bg-social-purple dark:text-white text-black border">
                {user?.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind, John?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                // onClick={handleTextareaClick}
                className="resize-none border-social-gray-light bg-social-gray-light/30 placeholder:text-social-gray min-h-[50px]"
              />

              {isExpanded && (
                <div className="mt-4 space-y-4">
                  {/* Media Options */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-social-gray hover:text-social-purple hover:bg-social-purple-light/10"
                      >
                        <Image className="w-5 h-5 mr-2" />
                        Photo
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-social-gray hover:text-social-purple hover:bg-social-purple-light/10"
                      >
                        <Video className="w-5 h-5 mr-2" />
                        Video
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-social-gray hover:text-social-purple hover:bg-social-purple-light/10"
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        Event
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-social-gray hover:text-social-purple hover:bg-social-purple-light/10"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Article
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-social-gray hover:text-social-purple hover:bg-social-purple-light/10"
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  {/* <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsExpanded(false);
            setPostContent("");
          }}
          className="border-social-gray text-social-gray-dark hover:bg-social-gray-light"
        >
          Cancel
        </Button>

        <Button
          size="sm"
        //   onClick={handlePostSubmit}
        //   disabled={!postContent.trim()}
          className="bg-social-purple hover:bg-social-purple-dark text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Post
        </Button>
      </div> */}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// {
//   isExpanded && (
//     <div className="mt-4 space-y-4">
//       {/* Media Options */}
//       <div className="flex items-center justify-between">
//         <div className="flex space-x-4">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-social-gray hover:text-social-purple hover:bg-social-purple-light/10"
//           >
//             <Image className="w-5 h-5 mr-2" />
//             Photo
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-social-gray hover:text-social-purple hover:bg-social-purple-light/10"
//           >
//             <Video className="w-5 h-5 mr-2" />
//             Video
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-social-gray hover:text-social-purple hover:bg-social-purple-light/10"
//           >
//             <Calendar className="w-5 h-5 mr-2" />
//             Event
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-social-gray hover:text-social-purple hover:bg-social-purple-light/10"
//           >
//             <FileText className="w-5 h-5 mr-2" />
//             Article
//           </Button>
//         </div>

//         <Button
//           variant="ghost"
//           size="sm"
//           className="text-social-gray hover:text-social-purple hover:bg-social-purple-light/10"
//         >
//           <Smile className="w-5 h-5" />
//         </Button>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-end space-x-3">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => {
//             setIsExpanded(false);
//             setPostContent("");
//           }}
//           className="border-social-gray text-social-gray-dark hover:bg-social-gray-light"
//         >
//           Cancel
//         </Button>

//         <Button
//           size="sm"
//           onClick={handlePostSubmit}
//           disabled={!postContent.trim()}
//           className="bg-social-purple hover:bg-social-purple-dark text-white disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Post
//         </Button>
//       </div>
//     </div>
//   );
// }
