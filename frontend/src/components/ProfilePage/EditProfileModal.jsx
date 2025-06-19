import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Camera, Link, Loader2, MapPin } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { editUser } from '@/http/api';
import useUserStore from '@/lib/store';
import { toast } from 'sonner';

const readFileAsDataURL = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.readAsDataURL(file);
  });
};

const EditProfileModal = ({ isOpen, onClose, profileData }) => {

  const { setUser } = useUserStore();
  const profileRef = useRef(null);
  const coverRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [profileURL, setProfileURL] = useState(null);
  const [coverURL, setcoverURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: profileData?.username || "",
    title: profileData?.title || "",
    location: profileData?.location || "",
    links: profileData?.links || { website: "", linkedin: "", twitter: "", instagram: "" },
    bio: profileData?.bio || "",
    gender: profileData?.gender || "",
  });
  
  const isValidUrl = (url) => {
    try {
      new URL(url); // throws if not valid
      return true;
    } catch (_) {
      return false;
    }
  };
  
  const handleLinks = (e) =>{
    const {name, value} = e.target;
    setFormData((prev)=> ({...prev, links: {...prev.links, [name]: value}}));
    if(!isValidUrl(value)){
     e.target.style.borderColor = "red";
    }
    else{
      e.target.style.borderColor = "transparent";
    }
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverImage = async(e)=>{
    const file = e.target.files[0];
    setCoverImage(file);
    const datauri = await readFileAsDataURL(file);
    setcoverURL(datauri);
  }
  const handleProfilePicture = async(e)=>{
    const file = e.target.files[0];
    setProfileImage(file);
    const datauri = await readFileAsDataURL(file);
    setProfileURL(datauri);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true)
    const updatedData = new FormData();
    Object.entries(formData).forEach(([name, value]) => {
      console.log(name, value);
      if (name == "links") updatedData.append(`${name}`, JSON.stringify(value));
      else updatedData.append(`${name}`, value);
    });

    if (profileImage) updatedData.append("profilePicture", profileImage);
    if (coverImage) updatedData.append("coverImage", coverImage);

    const res = await editUser(updatedData);
    console.log(res)
    if(res.success){
      setUser({...res.user});
      toast.success(res.message)
    }

    // console.log("Saving profile data:", formData);
    setIsLoading(false)
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose} className="max-h-[95%]">
        <DialogContent className="sm:max-w-[525px] max-h-[95%]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile information here.
            </DialogDescription>
          </DialogHeader>
          <div className="">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 py-4 ">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-full">
                    <div
                      className="h-36 border rounded-md relative overflow-hidden bg-cover"
                      style={{
                        backgroundImage: `url(${
                          coverURL ? coverURL : profileData?.coverImage
                        })`,
                      }}
                    >
                      <input
                        ref={coverRef}
                        type="file"
                        className="hidden"
                        onChange={handleCoverImage}
                      />
                      <Button
                        size="icon"
                        type="button"
                        variant="secondary"
                        className="absolute bottom-2 right-2 rounded-full"
                        onClick={() => {
                          coverRef.current.click();
                        }}
                      >
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Change cover photo</span>
                      </Button>
                    </div>
                  </div>

                  <div className="relative mt-[-20%]">
                    <Avatar className="w-24 h-24 border-2 border-white shadow-md">
                      <AvatarImage
                        src={profileURL ? profileURL : profileData.profilePicture}
                        className="object-cover"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <input
                      ref={profileRef}
                      type="file"
                      className="hidden"
                      onChange={handleProfilePicture}
                    />
                    <Button
                      size="icon"
                      type="button"
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                      onClick={() => {
                        profileRef.current.click();
                      }}
                    >
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Change profile picture</span>
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 overflow-auto max-h-80 pr-3">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <div className="col-span-3 flex gap-2">
                      {/* <MapPin className="w-4 h-4 mt-2 text-gray-500" /> */}
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="website" className="text-right">
                      Website
                      <Link className="w-3 h-3" />
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.links.website}
                      onChange={handleLinks}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="website" className="text-right">
                      Linkedin
                      <Link className="w-3 h-3" />
                    </Label>
                    <Input
                      id="website"
                      name="linkedin"
                      value={formData.links.linkedin}
                      onChange={handleLinks}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="website" className="text-right">
                      X
                      <Link className="w-3 h-3" />
                    </Label>
                    <Input
                      id="website"
                      name="twitter"
                      value={formData.links.twitter}
                      onChange={handleLinks}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="website" className="text-right">
                      Instagram
                      <Link className="w-3 h-3" />
                    </Label>
                    <Input
                      id="website"
                      name="instagram"
                      value={formData.links.instagram}
                      onChange={handleLinks}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="bio" className="text-right pt-2">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="col-span-3 max-h-25"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onClose()}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {!isLoading ? (
                    "Save changes"
                  ) : (
                    <>
                      <Loader2 className="animate-spin" />
                      <span>Updating...</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProfileModal;