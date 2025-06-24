import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { editSkillsInterest } from '@/http/api';
import { toast } from 'sonner';
import useUserStore from '@/lib/store';

const EditSkillsModal = ({ isOpen, onClose, skills = [], interest = [] }) => {
    const {user, setUser} = useUserStore();
    const [skillsList, setSkillsList] = useState(skills);
    const [newSkill, setNewSkill] = useState("");
    const [interestList, setInterestList] = useState(interest);
    const [newInterest, setNewInterest] = useState("");

    const handleAddSkill = () => {
      if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
        setSkillsList([...skillsList, newSkill.trim()]);
        setNewSkill("");
      }
    };

    const handleAddInterest = () => {
      if (newInterest.trim() && !interestList.includes(newInterest.trim())) {
        setInterestList([...interestList, newInterest.trim()]);
        setNewInterest("");
      }
    };

    const handleRemoveSkill = (skillToRemove) => {
      setSkillsList(skillsList.filter((skill) => skill !== skillToRemove));
    };

    const handleRemoveInterest = (interestToRemove) => {
      setInterestList(
        interestList.filter((interest) => interest !== interestToRemove)
      );
    };

    const handleSkillsKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddSkill();
      }
    };

    const handleInterestKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddInterest();
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      // console.log("Saving skills:", skillsList);
      // console.log("Saving Interests:", interestList);

      const res = await editSkillsInterest({skills: skillsList, interest: interestList});      
      setUser({...user, skills: skillsList, interests: interestList});
      if(res.success){
        toast.success(res.message);
      }
      onClose(false);
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
                  onKeyDown={handleSkillsKeyDown}
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
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={handleInterestKeyDown}
                  placeholder="Add your Interest (e.g., JavaScript)"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddInterest} size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {interestList.map((interest) => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="px-2 py-1 text-sm"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {interest}</span>
                    </button>
                  </Badge>
                ))}
                {interestList.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No Interests added yet.
                  </p>
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