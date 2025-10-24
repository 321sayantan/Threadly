import React, { useEffect, useRef, useState } from "react";
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
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Link, useNavigate, useParams } from "react-router";
import useUserStore from "@/lib/store";
import { SuggestedUser } from "../SuggestedUser.jsx";
import { format } from "date-fns";
import EditProfileModal from "./EditProfileModal.jsx";
import EditSkillsModal from "./EditSkillsModal.jsx";
import EditExperience from "./EditExperience.jsx";
import EditEducation from "./EditEducation.jsx";
import EditCertificates from "./EditCertificates.jsx";
import { createChat, getUser } from "@/http/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "@radix-ui/react-dropdown-menu";
import PostHeader from "../Post/PostHeader";
import EngagementBar from "../Post/EngagementBar";
import { formatDistanceToNow } from "date-fns";

const OthersProfilePage = ({ User }) => {
  // const { user, setUser, userPosts } = useUserStore();
  // const [User, setUser] = useState({});
  // const { id: userId } = useParams();

  console.log(111, User);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isProfileModalOpen, setProfileModal] = useState(false);
  const [isSkillsModalOpen, setSkillModal] = useState(false);
  const [isEditExpModalOpen, setEditExpModal] = useState(false);
  const [isEditEduModalOpen, setEditEduModal] = useState(false);
  const [isEditCertificateModalOpen, setEditCertificateModal] = useState(false);

  const [selectedExperience, setSelectedExperience] = useState({});
  const [selectedEducation, setSelectedEducation] = useState({});
  const [selectedCertificate, setSelectedCertificate] = useState({});

  const experiences = User?.experience || [];
  const education = User?.education || [];
  const certifications = User?.certificate || [];
  const posts = User?.posts || [];

  const handelOptions = (action) => {
    if (action == "edit") setProfileModal(true);
  };

  const handelExperienceModal = (experience) => {
    if (experience) {
      setSelectedExperience(experience);
      console.log("experience send");
    } else setSelectedExperience({});

    setEditExpModal(true);
  };

  const handelEducationModal = (education) => {
    if (education) {
      setSelectedEducation(education);
      console.log("education send");
    } else setSelectedEducation({});

    setEditEduModal(true);
  };

  const handleCertificateModal = (certificate) => {
    if (certificate) {
      setSelectedCertificate(certificate);
    } else {
      setSelectedCertificate({});
    }
    setEditCertificateModal(true);
  };

  const handelMessageClick = async () => {
    console.log(User);
    const res = await createChat(User._id);
    console.log(res);
    navigate(`/messages/${res.conversation._id}`)
  };

  const formatDegree = (degree) => {
    const degreeMap = {
      bachelor: "Bachelor's Degree",
      master: "Master's Degree",
      phd: "PhD",
      associate: "Associate Degree",
      diploma: "Diploma",
      certificate: "Certificate",
      other: "Other",
    };
    return degreeMap[degree] || degree;
  };

    const scrollRef = useRef(null);
  
    // scroll helpers
    const scroll = (direction) => {
      const gap = 16; // matches gap-4 (1rem)
      const slideWidth = scrollRef.current.firstElementChild.offsetWidth + gap;
      scrollRef.current.scrollBy({
        left: direction * slideWidth * 2, // 2 posts per click
        behavior: "smooth",
      });
    };

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto bg-transparent rounded-4xl border">
        {/* Cover Photo & Profile Header */}
        <div className="relative ">
          <div className="h-48 md:h-64 bg-gray-500 relative overflow-hidden rounded-t-4xl">
            <img
              src={User.coverImage}
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
                    src={User.profilePicture}
                    alt="Profile picture"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>

                <div className="flex gap-6 mt-6 ml-6 pt-4 border-t">
                  <div className="text-center ">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {posts.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-white">
                      Posts
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {User.followers?.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-white">
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {User.following?.length}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handelMessageClick()}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Follow
                </Button>

                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger aschild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-social-gray hover:text-social-purple"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>Follow</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex flex-row">
              <div className="flex-1/4 mt-5 md:mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {User.username}
                </h1>
                <p className="text-lg text-gray-600 mb-2  dark:text-white">
                  {User.title}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 ">
                  <div className="flex items-center gap-1 dark:text-white">
                    <MapPin className="w-4 h-4" />
                    {User.location}
                  </div>
                  {User.links?.website && (
                    <div className="flex items-center gap-1 dark:text-white">
                      <LinkIcon className="w-4 h-4" />
                      <Link href="#" className="text-blue-600 hover:underline">
                        {User.links.website}
                      </Link>
                    </div>
                  )}
                  <div className="flex items-center gap-1 dark:text-white">
                    <Calendar className="w-4 h-4" />
                    Joined {format(new Date(`${User?.createdAt}`), "MMM yyyy")}
                  </div>
                </div>
              </div>
              <div className="flex-1 self-end pb-4 ml-10">
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
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {User.skills?.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {User.interests?.map((interest) => (
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
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-4 text-xl">
                  <Briefcase className="w-5 h-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {experiences.length === 0 ? (
                  <div className="text-center">No Work Experience</div>
                ) : (
                  experiences.map((experience, index) => (
                    <div key={experience?._id} className="relative">
                      <div className="flex gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" />
                          <AvatarFallback>
                            {experience?.company
                              ?.substring(0, 2)
                              ?.toUpperCase() || "NA"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{experience?.title}</h3>
                          <p className="text-gray-600">
                            {experience?.company} • {experience?.employmentType}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(experience?.startDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                              }
                            )}{" "}
                            -{" "}
                            {experience.current
                              ? "Present"
                              : new Date(experience.endDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                  }
                                )}
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
                          </p>
                        </div>
                      </div>

                      {index !== experiences.length - 1 && (
                        <hr className="my-4" />
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Education
              </h2>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center mb-4 gap-2 text-xl">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {education.length === 0 ? (
                  <div className="text-center">No Education</div>
                ) : (
                  education.map((edu) => (
                    <div key={edu._id} className="relative">
                      <div className="flex gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src="/placeholder.svg?height=48&width=48"
                            alt={edu?.school}
                          />
                          <AvatarFallback>
                            {edu?.school.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {formatDegree(edu?.degree)} in {edu?.fieldOfStudy}
                          </h3>
                          <p className="text-gray-600">{edu?.school}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(edu?.startDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                              }
                            )}{" "}
                            -
                            {edu.current
                              ? " Present"
                              : ` ${new Date(edu?.endDate).toLocaleDateString(
                                  "en-US",
                                  { year: "numeric", month: "short" }
                                )}`}
                          </p>
                          {edu?.grade && (
                            <p className="text-sm text-gray-500">
                              Grade: {edu.grade}
                            </p>
                          )}
                          {edu?.description && (
                            <p className="text-sm text-gray-700 mt-2">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {edu?._id !== education[education.length - 1]?._id && (
                        <hr className="my-4" />
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Certificates
              </h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {certifications.length === 0 ? (
                  <div className="text-center">No Certificate</div>
                ) : (
                  certifications.map((cert) => (
                    <div key={cert._id} className="relative">
                      <div className="flex items-start justify-between pr-10">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{cert.name}</h3>
                            {cert.credentialUrl && (
                              <Link
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4 text-blue-600" />
                                <span className="sr-only">View credential</span>
                              </Link>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {cert.organization} • Issued{" "}
                            {new Date(cert.issueDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                              }
                            )}
                            {!cert.noExpiration &&
                              cert.expirationDate &&
                              ` • Expires ${new Date(
                                cert.expirationDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })}`}
                          </p>
                          {cert.credentialId && (
                            <p className="text-sm text-gray-500">
                              Credential ID: {cert.credentialId}
                            </p>
                          )}
                          {cert.description && (
                            <p className="text-sm text-gray-700 mt-2">
                              {cert.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {cert.id !==
                        certifications[certifications.length - 1].id && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Posts Section */}
          {/* <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="relative h-[300px] w-[300px] cursor-pointer group p-3"
                >
                  <img
                    src={post?.images[0]}
                    alt={`Post`}
                    className="object-cover h-full w-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all duration-200">
                    <div className="flex gap-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
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
              ))}
            </div>
          </div> */}
          <div className="space-y-6 px-4 sm:px-0">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Posts
            </h2>

            {posts.length === 0 ? (
              <div className="text-center">No Post Available</div>
            ) : (
              <div className="relative border ">
                {/* left arrow */}
                <button
                  onClick={() => scroll(-1)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-slate-800/80 rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* right arrow */}
                <button
                  onClick={() => scroll(1)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-slate-800/80 rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* scroll container */}
                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto snap-x snap-mandatory gap-1 pb-4 scroll-smooth scrollbar-hide mt-5 mx-5"
                >
                  {posts.map((Post) => (
                    <div
                      key={Post._id}
                      className="snap-start shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.5rem)] lg:w-[calc(50%-0.5rem)]"
                    >
                      <Card className="w-full pt-4 pb-0 max-w-[400px] h-[500px] flex flex-col mx-auto border-social-gray-light shadow-sm hover:shadow-md transition-shadow">
                        {/* Header */}
                        <PostHeader
                          user={{
                            name: Post.author.username,
                            avatar: Post.author.profilePicture,
                            title: Post.author.title,
                            isVerified: true,
                            connectionDegree: 1,
                          }}
                          timestamp={
                            Post.createdAt
                              ? formatDistanceToNow(Post.createdAt, {
                                  addSuffix: true,
                                })
                              : "6 hours ago"
                          }
                          post={Post}
                        />

                        {/* Caption (optional) */}
                        {Post.caption && Post.caption !== "undefined" && (
                          <div className="px-4 mb-2 text-sm shrink-0">
                            <p className="whitespace-pre-line">
                              {Post.caption}
                            </p>
                          </div>
                        )}

                        {/* Image : fills remaining space */}
                        {Post.images.length > 0 && (
                          <div className="flex-1 min-h-0 px-4">
                            <img
                              src={Post.images[0]}
                              className="w-full h-full object-cover rounded"
                              alt="Post"
                            />
                          </div>
                        )}

                        {/* Engagement bar : always at bottom */}
                        <div className="mt-auto shrink-0">
                          <EngagementBar
                            initialLikes={Post.likes.length}
                            initialComments={Post.comments.length}
                            initialShares={0}
                            initialSaved={0}
                            post={Post}
                          />
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 hover:bg-gray-900 hover:cursor-pointer flex justify-center border-t">
                  See All Posts <ArrowRight className="w-5 h-5 ml-1 mt-1" />
                </button>
              </div>
            )}

            {/* wrapper with arrows */}
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
        profileData={User}
      />
      <EditSkillsModal
        isOpen={isSkillsModalOpen}
        onClose={setSkillModal}
        skills={User.skills}
        interest={User.interests}
      />

      <EditExperience
        isOpen={isEditExpModalOpen}
        onClose={setEditExpModal}
        experience={selectedExperience}
      />
      <EditEducation
        isOpen={isEditEduModalOpen}
        onClose={setEditEduModal}
        education={selectedEducation}
      />
      <EditCertificates
        isOpen={isEditCertificateModalOpen}
        onClose={setEditCertificateModal}
        certification={selectedCertificate}
      />
    </div>
  );
};

export default OthersProfilePage;
