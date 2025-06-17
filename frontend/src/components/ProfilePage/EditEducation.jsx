import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const EditEducation = ({ isOpen, onClose, education = {} }) => {
    const [formData, setFormData] = useState({
      degree: education?.degree || "",
      fieldOfStudy: education?.fieldOfStudy || "",
      school: education?.school || "",
      startDate: education?.startDate || "",
      endDate: education?.endDate || "",
      current: education?.current || false,
      grade: education?.grade || "",
      description: education?.description || "",
    });

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleSelectChange = (name, value) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Saving education:", formData);
      onClose(formData);
    };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {education?.id ? "Edit" : "Add"} Education
            </DialogTitle>
            <DialogDescription>
              {education?.id
                ? "Update your education details."
                : "Add a new education to your profile."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="school" className="text-right">
                  School
                </Label>
                <Input
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="University of California"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="degree" className="text-right">
                  Degree
                </Label>
                <Select
                  value={formData.degree}
                  onValueChange={(value) => handleSelectChange("degree", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select degree type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="associate">Associate Degree</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fieldOfStudy" className="text-right">
                  Field of Study
                </Label>
                <Input
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="Computer Science"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="month"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">
                  <Label htmlFor="current" className="mr-2">
                    Current
                  </Label>
                  <input
                    id="current"
                    name="current"
                    type="checkbox"
                    checked={formData.current}
                    onChange={handleChange}
                    className="rounded"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    id="endDate"
                    name="endDate"
                    type="month"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={formData.current}
                    placeholder={formData.current ? "Present" : ""}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="grade" className="text-right">
                  Grade/GPA
                </Label>
                <Input
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="3.8/4.0 or First Class Honours"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="col-span-3"
                  rows={3}
                  placeholder="Activities, societies, achievements..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="submit">{education?.id ? "Update" : "Add"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditEducation