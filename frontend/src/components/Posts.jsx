import React from 'react'
import { Post } from './Post/Post'
import useUserStore from '@/lib/store';

const Posts = () => {
  const { post } = useUserStore();
  return (
    <div>
        {
            post.map((post) => <Post key={post._id} Post={post} />)

        }
    </div>
  )
}

export default Posts