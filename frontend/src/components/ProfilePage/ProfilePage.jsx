import React from 'react'
import {
  MapPin,
  LinkIcon,
  Calendar,
  MessageCircle,
  UserPlus,
  MoreHorizontal,
  Heart,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Link } from 'react-router';
// import Image from "next/image";
// import Link from "next/link";

const ProfilePage = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white">
          {/* Cover Photo & Profile Header */}
          <div className="relative">
            <div className="h-48 md:h-64 bg-gray-500 relative overflow-hidden">
              <img
                src="/placeholder.svg?height=256&width=1024"
                alt="Cover photo"
                className="object-cover"
              />
            </div>

            {/* Profile Picture & Basic Info */}
            <div className="relative px-6 pb-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage
                      src="/placeholder.svg?height=128&width=128"
                      alt="Profile picture"
                    />
                    <AvatarFallback className="text-2xl">JD</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 md:mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      John Doe
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                      Senior Software Engineer at TechCorp
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        San Francisco, CA
                      </div>
                      <div className="flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" />
                        <Link
                          href="#"
                          className="text-blue-600 hover:underline"
                        >
                          johndoe.dev
                        </Link>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined March 2020
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-6 pt-4 border-t">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">1,234</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">12.5K</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">2,345</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">89</div>
                  <div className="text-sm text-gray-500">Connections</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="px-6 space-y-8 pb-8">
            {/* About Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">About</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Passionate software engineer with 8+ years of experience
                    building scalable web applications. I love working with
                    modern technologies like React, Node.js, and cloud
                    platforms. Always eager to learn new things and share
                    knowledge with the community.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "JavaScript",
                          "TypeScript",
                          "React",
                          "Node.js",
                          "Python",
                          "AWS",
                          "Docker",
                          "GraphQL",
                        ].map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Photography",
                          "Travel",
                          "Open Source",
                          "Machine Learning",
                          "Hiking",
                        ].map((interest) => (
                          <Badge key={interest} variant="outline">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Experience Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Experience</h2>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src="/placeholder.svg?height=48&width=48"
                        alt="TechCorp"
                      />
                      <AvatarFallback>TC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        Senior Software Engineer
                      </h3>
                      <p className="text-gray-600">TechCorp • Full-time</p>
                      <p className="text-sm text-gray-500">
                        Jan 2022 - Present • 2 yrs
                      </p>
                      <p className="text-sm text-gray-700 mt-2">
                        Leading a team of 5 engineers to build and maintain
                        scalable web applications serving millions of users.
                      </p>
                    </div>
                  </div>

                  {/* <Separator /> */}

                  <div className="flex gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src="/placeholder.svg?height=48&width=48"
                        alt="StartupXYZ"
                      />
                      <AvatarFallback>SX</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">Software Engineer</h3>
                      <p className="text-gray-600">StartupXYZ • Full-time</p>
                      <p className="text-sm text-gray-500">
                        Jun 2019 - Dec 2021 • 2 yrs 7 mos
                      </p>
                      <p className="text-sm text-gray-700 mt-2">
                        Developed full-stack applications using React and
                        Node.js, improving user engagement by 40%.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src="/placeholder.svg?height=48&width=48"
                        alt="University"
                      />
                      <AvatarFallback>UC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        Bachelor of Science in Computer Science
                      </h3>
                      <p className="text-gray-600">University of California</p>
                      <p className="text-sm text-gray-500">2015 - 2019</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">
                      AWS Certified Solutions Architect
                    </h3>
                    <p className="text-sm text-gray-500">
                      Amazon Web Services • Issued Mar 2023
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Google Cloud Professional Developer
                    </h3>
                    <p className="text-sm text-gray-500">
                      Google Cloud • Issued Jan 2022
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Posts Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                {/* {Array.from({ length: 9 }).map((_, i) => ( */}
                  <div
                    // key={i}
                    className="aspect-square relative group cursor-pointer"
                  >
                    <img
                      src={`/placeholder.svg?height=300&width=300`}
                    //   alt={`Post ${i + 1}`}
                    //   fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 flex gap-4 text-white">
                        <div className="flex items-center gap-1">
                          <Heart className="w-5 h-5" />
                          <span>124</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-5 h-5" />
                          <span>23</span>
                        </div>
                      </div>
                    </div>
                  </div>
                {/* ))} */}
              </div>
            </div>

            {/* Connections Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Connections</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* {Array.from({ length: 6 }).map((_, i) => ( */}
                      <div
                        // key={i}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <Avatar>
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40`}
                            // alt={`Connection ${i + 1}`}
                          />
                          {/* <AvatarFallback>U{i + 1}</AvatarFallback> */}
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">User {0 + 1}</h3>
                          <p className="text-sm text-gray-500">
                            Software Engineer
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    {/* ))} */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage