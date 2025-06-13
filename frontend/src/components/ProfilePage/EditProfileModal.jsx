import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Camera, Link, MapPin } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const EditProfileModal = ({ isOpen, onClose, profileData }) => {

  const [formData, setFormData] = useState({
    name: profileData?.username || "",
    title: profileData?.title || "",
    location: profileData?.location || "",
    website: profileData?.website || "",
    bio: profileData?.bio || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the data to your backend
    console.log("Saving profile data:", formData);
    onClose(formData);
  };

  return (
    <div>
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
                    <div className="h-36 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md relative overflow-hidden">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-2 right-2 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Change cover photo</span>
                      </Button>
                    </div>
                  </div>

                  <div className="relative mt-[-20%]">
                    <Avatar className="w-24 h-24 border-2 border-white shadow-md">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                    >
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Change profile picture</span>
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 overflow-auto max-h-80">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
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
                      value={formData.website}
                      onChange={handleChange}
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
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
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
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
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
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
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
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfileModal;