import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, UserPlus, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import useUserStore from '@/lib/store';
import { followOrUnfollow, suggestedUser } from '@/http/api';
import { toast } from 'sonner';

export const SuggestedUser = () => {
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
        toast.success(res.message);
      } catch (error) {
        console.log(error);
      }
    };

      useEffect(() => {
        getSuggestedUser();
      }, []);

  return (
    <div>
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
  );
}
