import { fetchAllPost } from "@/http/api";
import useUserStore from "@/lib/store";
import { useEffect } from "react";

const useGetAllPost = ()=>{
    const {post, setPost} = useUserStore();
    useEffect(()=>{
        const fetchPost = async () => {
            const res = await fetchAllPost();
            // console.log(100, res.allPost);
            if(res.success)
            {
                setPost(res.allPost)
            }
        }
        
        fetchPost();
        // console.log(11,post);
    },[])
    

}

export default useGetAllPost;