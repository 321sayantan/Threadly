import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    // headers: {
    //     'Content-Type': 'application/json'
    // },
    withCredentials: true,
});


export const register = async (data) => {
    try{
        const res = await api.post("/user/register", data);
        // console.log(res);

        return res.data;
    }
    catch (err){
        console.log(err)
        return err.response.data;
    }
}

export const login = async (data) => {
    try{
        console.log(1,data)
        const res = await api.post('/user/login', data);
        return res.data;
    }
    catch (err){
        // console.log(10,err)
        return err.response.data;
    }
}

export const logout = async () => {
    try{
        const res = await api.get('/user/logout');
        return res.data;
    }
    catch (err){
        return err.response.data;
    }
}

export const deletePost = async (postid) => {
    try{
        const res = await api.get(`/post/deletePost/${postid}`);
        return res.data;
    }
    catch (err){
        return err.response.data;
    }
}

export const fetchAllPost = async ()  => {
    try {
        const res = await api.get('/post/getAllPost');
        // console.log(res.data);
        return res.data;

    } catch (error) {
        return error.response.data;
    }
}

export const likePost = async (postID)  => {
    try {
        const res = await api.get(`/post/likePost/${postID}`);
        // console.log(res.data);
        return res.data;

    } catch (error) {
        return error.response.data;
    }
}

export const dislikePost = async (postID)  => {
    try {
        const res = await api.get(`/post/dislikePost/${postID}`);
        // console.log(res.data);
        return res.data;

    } catch (error) {
        return error.response.data;
    }
}

export const addComment = async (postID, data)  => {
    try {
        const res = await api.post(`/post/addComment/${postID}`, data);
        console.log(res.data);
        return res.data;

    } catch (error) {
        return error.response.data;
    }
}

export const suggestedUser = async ()  => {
    try {
        const res = await api.get("/user/suggestedUser");
        console.log(res.data);
        return res.data;

    } catch (error) {
        return error.response.data;
    }
}

export const followOrUnfollow = async (userID)  => {
    try {
        const res = await api.post(`/user/followOrUnfollow/${userID}`);
        console.log(res.data);
        return res.data;

    } catch (error) {
        return error.response.data;
    }
}