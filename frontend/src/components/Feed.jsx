import React from 'react'
import Posts from './Posts'
import { CreatePostHeader } from './CreatePostHeader.jsx'

const Feed = () => {
  function handelCreatePost() {
    navigate("/create-Post", { state: { backgroundLocation: location } });
  }
  return (
    <div className="flex flex-col max-w-full my-5 items-center flex-1">
      <CreatePostHeader  />
      <Posts />
    </div>
  );
}

export default Feed