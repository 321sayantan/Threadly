import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import MediaCarousel from "./Post/MediaCarousel";
import axios from "axios";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";

const readFileAsDataURL = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.readAsDataURL(file);
  });
};

const CreatePost = ({ isopen, setisopen, component }) => {
  const fileref = useRef(null);
  const [complete, setcomplete] = useState(false);
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState()
  const [file, setFile] = useState();
  const navigate = useNavigate();

  const handelfileupload = async (e) => {
    console.log("inside file");
    const file = e.target.files;
    setFile(Array.from(file));

    if (file) {
      const newImages = [];

      for (const image of Object.values(file)) {
        const dataurl = await readFileAsDataURL(image);
        newImages.push({
          type: "image",
          src: dataurl,
        });
      }

      setImages([...newImages]);
      console.log(images);
      setcomplete(true);
      // console.log(caption)
    }
  };

  const handelCreatePost = async () => {
    const formdata = new FormData();
    formdata.append('caption', caption);

    for (let i = 0; i < file.length; i++) {
      formdata.append("postImages", file[i]);
    }

    try {
      const res = await axios.post("http://localhost:8000/api/v1/post/createPost", formdata, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      console.log(res)
      if(res.data.success)
      {
        toast.success(res.data.message);
      }
      
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  useEffect(()=>{
    if (images.length<=0)
    {
        setcomplete(false);
    }
  })


  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{component}</DialogTrigger>
        <DialogContent onInteractOutside={() => setisopen(false)}>
          <div className="text-xl">Create Post</div>
          <textarea
            className="focus:outline-0 text-l"
            placeholder="Write a caption..."
            onChange={(e)=>{setCaption(e.target.value)}}
          ></textarea>
          {complete ? (
            <MediaCarousel media={images} createpost={true} setMedia={setImages}/>
          ) : (
            <div className="m-auto border-3 border-dotted w-[100%] h-[300px] flex justify-center items-center">
              <div className="flex flex-col justify-center items-center h-full">
                Upload Images
                <input
                  ref={fileref}
                  type="file"
                  className="hidden"
                  onChange={handelfileupload}
                  multiple
                ></input>
              </div>
            </div>
          )}
          { !complete ? (<Button
            onClick={() => {
              fileref.current.click();
            }}
            className="mt-5"
          >
            Select from computer
          </Button>) :
          (<Button
            onClick={handelCreatePost}
            className="mt-5"
          >
            Post
          </Button>)}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePost;
