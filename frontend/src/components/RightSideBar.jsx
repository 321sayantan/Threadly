import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Building,
  Calendar,
  MapPin,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";
import useUserStore from "@/lib/store";
import { followOrUnfollow, suggestedUser } from "@/http/api";
import { format } from "date-fns";
import { toast } from "sonner";
import { SuggestedUser } from "./SuggestedUser";

const RightSideBar = () => {
  const { user } = useUserStore();
  
  return (
    // <div className='w-[15%] h-screen fixed top-0 right-0 border-l-2 border-gray-500'>
    // <h1>Right SideBar</h1>
    // </div>
    <>
      <div className="h-screen top-0 right-0 py-5 px-6 hidden lg:block">
        <div className="w-80 space-y-6">
          {/* User Profile Card */}
          <Card className="border-social-gray-light">
            <CardContent className="px-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-20 h-20 mb-4 border">
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={user?.username}
                    className="object-cover"
                  />
                  <AvatarFallback className="dark:bg-purple-400 text-xl dark:text-white text-black">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h3 className="font-semibold text-lg text-social-gray-dark mb-1">
                  {user?.username}
                </h3>
                <p className="text-sm text-social-gray mb-2">
                  Senior Software Engineer
                  {/* {user?.bio} */}
                </p>

                <div className="flex items-center text-xs text-social-gray mb-1">
                  <Building className="w-3 h-3 mr-1" />
                  {user?.company} SDE Google
                </div>

                <div className="flex items-center text-xs text-social-gray mb-4">
                  <MapPin className="w-3 h-3 mr-1" />
                  {user?.location} Hooghly
                </div>

                <div className="w-full border-t border-social-gray-light pt-4">
                  <div className="flex justify-between text-center">
                    <div>
                      <div className="font-semibold text-social-gray-dark">
                        {user?.following.length}
                      </div>
                      <div className="text-xs text-social-gray">
                        {/* Connections */}
                        Following
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-social-gray-dark">
                        {user?.followers.length}
                      </div>
                      <div className="text-xs text-social-gray">
                        {/* Profile views */}
                        Followers
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-xs text-social-gray mt-3">
                  <Calendar className="w-3 h-3 mr-1" />
                  Joined {format(new Date(`${user?.updatedAt}`), "MMM yyyy")}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Users Card */}
          <SuggestedUser/>
        </div>
      </div>
    </>
  );
};

export default RightSideBar;
