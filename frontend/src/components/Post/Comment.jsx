import React, { useState } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

const Comment = () => {
    const [newComment, setNewComment] = useState('');
    const handlePostComment = () => {
    }

  return (
    <>
      <div className="flex gap-2 px-3">
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1"
        />
        <Button
          size="sm"
          onClick={handlePostComment}
          disabled={!newComment.trim()}
          className="bg-purple-500 hover:bg-purple-800 hover:cursor-pointer hover:text-white h-9 w-9"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}

export default Comment;