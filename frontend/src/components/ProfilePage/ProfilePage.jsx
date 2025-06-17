import React, { useState } from "react";
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
  LinkedinIcon,
  Twitter,
  Instagram,
  Users,
  Pencil,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Link } from "react-router";
import useUserStore from "@/lib/store";
import { SuggestedUser } from "../SuggestedUser";
import { format } from "date-fns";
import EditProfileModal from "./EditProfileModal";
import EditSkillsModal from "./EditSkillsModal";
import EditExperience from "./EditExperience";
import EditEducation from "./EditEducation";
import EditCertificates from "./EditCertificates";

const Profile = () => {
  const { user } = useUserStore();
  const [isProfileModalOpen, setProfileModal] = useState(false);
  const [isSkillsModalOpen, setSkillModal] = useState(false);
  const [isEditExpModalOpen, setEditExpModal] = useState(false);
  const [isEditEduModalOpen, setEditEduModal] = useState(false);
  const [isEditCertificateModalOpen, setEditCertificateModal] = useState(false);
  const experience = {};
  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto bg-transparent rounded-4xl border">
        {/* Cover Photo & Profile Header */}
        <div className="relative ">
          <div className="h-48 md:h-64 bg-gray-500 relative overflow-hidden rounded-t-4xl">
            <img
              src="https://img.lovepik.com/background/20211021/large/lovepik-blue-technology-banner-background-image_500362377.jpg"
              alt="Cover photo"
              className="object-cover"
            />
          </div>

          {/* Profile Picture & Basic Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <Avatar className="w-35 h-35 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={user.profilePicture}
                    alt="Profile picture"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>

                <div className="flex gap-6 mt-6 ml-6 pt-4 border-t">
                  <div className="text-center ">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {user.posts.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-white">
                      Posts
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {user.followers.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-white">
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {user.following.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-white">
                      Following
                    </div>
                  </div>
                  {/* <div className="text-center">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        89
                      </div>
                      <div className="text-sm text-gray-500 dark:text-white">
                        Connections
                      </div>
                    </div> */}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setProfileModal(true);
                  }}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-row">
              <div className="flex-1/4 mt-5 md:mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {user.username}
                </h1>
                <p className="text-lg text-gray-600 mb-2  dark:text-white">
                  Senior Software Engineer at TechCorp
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 ">
                  <div className="flex items-center gap-1 dark:text-white">
                    <MapPin className="w-4 h-4" />
                    San Francisco, CA
                  </div>
                  <div className="flex items-center gap-1 dark:text-white">
                    <LinkIcon className="w-4 h-4" />
                    <Link href="#" className="text-blue-600 hover:underline">
                      johndoe.dev
                    </Link>
                  </div>
                  <div className="flex items-center gap-1 dark:text-white">
                    <Calendar className="w-4 h-4" />
                    Joined {format(new Date(`${user?.updatedAt}`), "MMM yyyy")}
                  </div>
                </div>
              </div>
              <div className="flex-1 self-end pb-4">
                <span>Connect With Me:</span>
                <div className="flex gap-8 mt-2">
                  <LinkedinIcon />
                  <Twitter />
                  <Instagram />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="px-6 space-y-8 pb-8">
          {/* About Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              About
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-700 leading-relaxed mb-6 dark:text-white">
                  Passionate software engineer with 8+ years of experience
                  building scalable web applications. I love working with modern
                  technologies like React, Node.js, and cloud platforms. Always
                  eager to learn new things and share knowledge with the
                  community.
                </p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-semibold mb-2">Skills</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => setSkillModal(true)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>

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
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Experience
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditExpModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* {experiences.map((experience) => ( */}
                <div key={experience?.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-8 w-8"
                    onClick={() => setEditExpModal(true)}
                  >
                    <Pencil className="h-4 w-4" />
                    {/* <span className="sr-only">Edit experience</span> */}
                  </Button>

                  <div className="flex gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src="/placeholder.svg?height=48&width=48"
                        // alt={kl}
                      />
                      <AvatarFallback>
                        {/* {experience?.company.substring(0, 2).toUpperCase()} */}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {/* {experience?.title} */}
                        gjghghjgjgj
                      </h3>
                      <p className="text-gray-600">
                        {/* {experience?.company} • {experience?.employmentType} */}
                        xxxxxxx • YYYYYYYY
                      </p>
                      {/* <p className="text-sm text-gray-500">
                          {new Date(experience?.startDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                            }
                          )}{" "}
                          -
                          {experience.current
                            ? " Present"
                            : ` ${new Date(
                                experience.endDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })}`}
                          {!experience?.current &&
                            experience?.startDate &&
                            experience?.endDate &&
                            ` • ${Math.floor(
                              (new Date(experience?.endDate) -
                                new Date(experience?.startDate)) /
                                (1000 * 60 * 60 * 24 * 30)
                            )} mos`}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                          {experience?.description}
                        </p> */}
                    </div>
                  </div>

                  {/* {experience?.id !==
                      experiences[experiences.length - 1].id && (
                      <Separator className="my-4" />
                    )} */}
                </div>
                {/* ))} */}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Education
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditEduModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-8 w-8"
                    onClick={() => setEditEduModal(true)}
                  >
                    <Pencil className="h-4 w-4" />
                    {/* <span className="sr-only">Edit experience</span> */}
                  </Button>

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
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Certificates
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditCertificateModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <div>
                    <h3 className="font-semibold">
                      AWS Certified Solutions Architect
                    </h3>
                    <p className="text-sm text-gray-500">
                      Amazon Web Services • Issued Mar 2023
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-8 w-8"
                    onClick={() => setEditCertificateModal(true)}
                  >
                    <Pencil className="h-4 w-4" />
                    {/* <span className="sr-only">Edit experience</span> */}
                  </Button>
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Posts
            </h2>
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
                      <p className="text-sm text-gray-500">Software Engineer</p>
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
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={setProfileModal}
        profileData={user}
      />
      <EditSkillsModal
        isOpen={isSkillsModalOpen}
        onClose={setSkillModal}
        // skills={skills}
      />

      <EditExperience isOpen={isEditExpModalOpen} onClose={setEditExpModal} />
      <EditEducation isOpen={isEditEduModalOpen} onClose={setEditEduModal} />
      <EditCertificates
        isOpen={isEditCertificateModalOpen}
        onClose={setEditCertificateModal}
      />
    </div>
  );
};

const ProfilePage = () => {
  return (
    <div className="flex flex-grow gap-6 p-5">
      <Profile />
      <SuggestedUser />
    </div>
  );
};

export default ProfilePage;
