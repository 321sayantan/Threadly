import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const EditExperience = ({ isOpen, onClose, experience = {} }) => {
  const [formData, setFormData] = useState({
    title: experience?.title || "",
    company: experience?.company || "",
    employmentType: experience?.employmentType || "full-time",
    startDate: experience?.startDate || "",
    endDate: experience?.endDate || "",
    current: experience?.current || false,
    description: experience?.description || "",
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
    console.log("Saving experience:", formData);
    onClose(formData);
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {experience.id ? "Edit" : "Add"} Experience
            </DialogTitle>
            <DialogDescription>
              {experience.id
                ? "Update your work experience details."
                : "Add a new work experience to your profile."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
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
                  placeholder="Senior Software Engineer"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="Company Name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employmentType" className="text-right">
                   Type
                </Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value) =>
                    handleSelectChange("employmentType", value)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
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
                  rows={4}
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="submit">{experience.id ? "Update" : "Add"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditExperience