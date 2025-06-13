import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

const EditSkillsModal = ({ isOpen, onClose, skills = [] }) => {
    const [skillsList, setSkillsList] = useState(skills);
    const [newSkill, setNewSkill] = useState("");

    const handleAddSkill = () => {
      if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
        setSkillsList([...skillsList, newSkill.trim()]);
        setNewSkill("");
      }
    };

    const handleRemoveSkill = (skillToRemove) => {
      setSkillsList(skillsList.filter((skill) => skill !== skillToRemove));
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddSkill();
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Saving skills:", skillsList);
      onClose(skillsList);
    };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[525px] border-2">
          <DialogHeader>
            <DialogTitle>Edit your Skills & Interest</DialogTitle>
            <DialogDescription>
              Add or remove skills from your profile.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a skill (e.g., JavaScript)"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddSkill} size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {skillsList.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-2 py-1 text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {skill}</span>
                    </button>
                  </Badge>
                ))}
                {skillsList.length === 0 && (
                  <p className="text-sm text-gray-500">No skills added yet.</p>
                )}
              </div>
            </div>
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add your Interest (e.g., JavaScript)"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddSkill} size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {skillsList.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-2 py-1 text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {skill}</span>
                    </button>
                  </Badge>
                ))}
                {skillsList.length === 0 && (
                  <p className="text-sm text-gray-500">No skills added yet.</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditSkillsModal