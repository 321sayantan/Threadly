import { useSocketStore } from '@/lib/socketStore';
import useUserStore from '@/lib/store';
import axios from 'axios';
import { CloudHail } from 'lucide-react';
import { io } from "socket.io-client";

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

        if(res.data.success){
        useUserStore.setState({user : res.data.userdata});
        const { initSocket } = useSocketStore.getState();
        initSocket();
        }

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
        const { disconnectSocket } = useSocketStore.getState();
        await disconnectSocket();
        return res.data;
    }
    catch (err){
        return err.response.data;
    }
}

export const createPost = async (formdata) => {
  try {
    const res = await axios.post(
      "http://localhost:8000/api/v1/post/createPost",
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

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

export const editUser = async(data) => {
    try {
        const res = await api.post("/user/profile/edit", data);
        console.log(res)
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const editSkillsInterest = async(data) => {
    try {
        const res = await api.post("/user/editSkillsInterest", data);
        console.log(res)
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const editExperience = async(data) => {
    try {
        const res = await api.post("/user/editExperience", {experience: data});
        console.log(res)
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const deleteExperience = async(expID) => {
    try {
        const res = await api.get(`/user/deleteExperience/${expID}`);
        console.log(res)
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const editEducation = async (data) => {
  try {
    const res = await api.post("/user/editEducation", { education: data });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteEducation = async (eduID) => {
  try {
    const res = await api.get(`/user/deleteEducation/${eduID}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const editCertificates = async (data) => {
  try {
    const res = await api.post("/user/editCertificates", { certificate: data });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCertificate = async (certID) => {
  try {
    const res = await api.get(`/user/deleteCertificate/${certID}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async(id) => {
    try {
        const res = await api.get(`/user/getUser/${id}`);
        console.log(res)
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const sendMessage = async(id, text, conversationID) => {
    try {
        const res = await api.post(`message/send/${id}`, {text, conversationID});
        console.log(res)
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const getMessage = async(conversationID) => {
    try {
        const res = await api.get(`message/get/${conversationID}`);
        console.log(res)
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const getChatList = async () => {
    try {
        // console.log("chatlist")
        const res = await api.get("/conversation/getChatList");
        // console.log(res.data)
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const createChat = async (id) =>{
    try {
        const res = await api.get(`/conversation/createChat/${id}`);
        console.log(res.data);
        return res.data;
    } catch (error) {
        
    }
}