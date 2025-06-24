import { fetchAllPost } from "@/http/api";
import useUserStore from "@/lib/store";
import { useEffect } from "react";

const useGetAllPost = ()=>{
    const {user, setPost, setUserPost} = useUserStore();
    useEffect(()=>{
        const fetchPost = async () => {
            const res = await fetchAllPost();
            // console.log(100, res.allPost);
            if(res.success)
            {
                setPost(res.allPost)
                const userPost = res.allPost.filter((p) => p.author._id === user._id);
                setUserPost(userPost);
                // console.log(userPost)
            }
        }
        
        fetchPost();
        // console.log(11,post);
    },[])
    

}

export default useGetAllPost;