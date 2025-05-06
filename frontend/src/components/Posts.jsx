import React from 'react'
import { Post } from './Post/Post'

const Posts = () => {
  return (
    <div>
        {
            [1, 2, 3, 4, 5].map((post) => <Post key={post} />)

        }
    </div>
  )
}

export default Posts