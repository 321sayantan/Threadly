import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const EditCertificates = ({ isOpen, onClose, certification = {} }) => {
  const [formData, setFormData] = useState({
    name: certification?.name || "",
    organization: certification?.organization || "",
    issueDate: certification?.issueDate || "",
    expirationDate: certification?.expirationDate || "",
    // noExpiration: certification?.noExpiration || false,
    credentialId: certification?.credentialId || "",
    credentialUrl: certification?.credentialUrl || "",
    description: certification?.description || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving certification:", formData);
    onClose(formData);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {certification?.id ? "Edit" : "Add"} Certification
            </DialogTitle>
            <DialogDescription>
              {certification?.id
                ? "Update your certification details."
                : "Add a new certification to your profile."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
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
                  placeholder="AWS Certified Solutions Architect"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="organization" className="text-right">
                  Organization
                </Label>
                <Input
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="Amazon Web Services"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="issueDate" className="text-right">
                  Issue Date
                </Label>
                <Input
                  id="issueDate"
                  name="issueDate"
                  type="month"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>

              {/* <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">
                  <Label htmlFor="noExpiration" className="mr-2">
                    No Expiration
                  </Label>
                  <input
                    id="noExpiration"
                    name="noExpiration"
                    type="checkbox"
                    checked={formData.noExpiration}
                    onChange={handleChange}
                    className="rounded"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    id="expirationDate"
                    name="expirationDate"
                    type="month"
                    value={formData.expirationDate}
                    onChange={handleChange}
                    disabled={formData.noExpiration}
                    placeholder={formData.noExpiration ? "No expiration" : ""}
                  />
                </div>
              </div> */}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="credentialId" className="text-right">
                  Credential ID
                </Label>
                <Input
                  id="credentialId"
                  name="credentialId"
                  value={formData.credentialId}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="ABC123456789"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="credentialUrl" className="text-right">
                  Credential URL
                </Label>
                <Input
                  id="credentialUrl"
                  name="credentialUrl"
                  type="url"
                  value={formData.credentialUrl}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="https://www.credly.com/badges/..."
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
                  placeholder="Skills and knowledge gained from this certification..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="submit">
                {certification?.id ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditCertificates;
