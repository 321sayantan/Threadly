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

const RightSideBar = () => {
  const { user, setUser } = useUserStore();
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const getSuggestedUser = async () => {
    const res = await suggestedUser();
    setSuggestedUsers(res.user);
  };

  const handleFollowUser = async (followedUserID) => {
    try {
      const res = await followOrUnfollow(followedUserID);
      console.log(1, user);
      const updatedUser = res.isFollowing
        ? {
            ...user,
            following: [...user.following, followedUserID],
          }
          : {
            ...user,
            following: user.following.filter((id) => id !== followedUserID),
          };

      setUser(updatedUser);
      // console.log(1,updatedUser);
      // console.log(2, user)
      toast.success(res.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSuggestedUser();
  }, []);

  useEffect(() => {
    console.log("User state after update:", user);
  }, [user]);

  return (
    // <div className='w-[15%] h-screen fixed top-0 right-0 border-l-2 border-gray-500'>
    // <h1>Right SideBar</h1>
    // </div>
    <>
      <div className="h-screen top-0 right-0 py-5 px-6">
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
                  {user?.bio}
                </p>

                <div className="flex items-center text-xs text-social-gray mb-1">
                  <Building className="w-3 h-3 mr-1" />
                  {user?.company} SDE Google
                </div>

                <div className="flex items-center text-xs text-social-gray mb-4">
                  <MapPin className="w-3 h-3 mr-1" />
                  {user?.location}Hooghly
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
          <Card className="border-social-gray-light">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Users className="w-5 h-5 mr-2 text-social-purple" />
                Suggested for you
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                {suggestedUsers.map((users) => (
                  <div
                    key={users._id}
                    className="px-3 py-3 hover:bg-social-gray-light/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <Avatar className="w-12 h-12 border">
                          <AvatarImage
                            src={users.profilePicture}
                            alt={users.username}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-social-purple-light dark:text-white text-black text-sm">
                            {users.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-social-gray-dark truncate">
                            {users.username}
                          </h4>
                          <p className="text-xs text-social-gray truncate">
                            {users?.title}
                          </p>
                          <p className="text-xs text-social-gray mt-1">
                            {users?.mutualConnections} mutual connections
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant={
                          user?.following.includes(users._id)
                            ? "outline"
                            : "default"
                        }
                        className={`ml-2 ${
                          user?.following.includes(users._id)
                            ? "cursor-pointer"
                            : "bg-gray-200 hover:bg-gray-300 dark:bg-transparent dark:text-white text-black cursor-pointer"
                        }`}
                        onClick={() => handleFollowUser(users._id)}
                      >
                        {user.following.includes(users._id) ? (
                          <>
                            <UserPlus className="w-3 h-3 mr-1" />
                            Following
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 mr-1" />
                            Follow
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-social-gray-light">
                <Button
                  variant="ghost"
                  className="w-full text-social-purple hover:bg-social-purple-light/10 hover:text-social-purple-dark"
                >
                  View all suggestions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RightSideBar;
