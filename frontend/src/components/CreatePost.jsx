import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import MediaCarousel from "./Post/MediaCarousel";
import axios from "axios";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import useUserStore from "@/lib/store";

const readFileAsDataURL = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.readAsDataURL(file);
  });
};

const CreatePost = () => {
  const fileref = useRef(null);
  const [open, setOpen] = useState(true);
  const [complete, setcomplete] = useState(false);
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState();
  const [file, setFile] = useState();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const {post, setPost} = useUserStore()

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
    setLoading(true);
    const formdata = new FormData();
    formdata.append("caption", caption);

    for (let i = 0; i < file.length; i++) {
      formdata.append("postImages", file[i]);
    }

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

      console.log(res);
      if (res.data.success) {
        setOpen(true);
        // window.location.href = "/";
        setPost([res.data.post, ...post])
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (images.length <= 0) {
      setcomplete(false);
    }
  });

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => !open && navigate(-1)}>
        {/* <DialogTrigger asChild>{component}</DialogTrigger> */}
        <DialogContent onInteractOutside={() => setOpen(false)}>
          <div className="text-xl">Create Post</div>
          <textarea
            className="focus:outline-0 text-l"
            placeholder="Write a caption..."
            onChange={(e) => {
              setCaption(e.target.value);
            }}
          ></textarea>
          {complete ? (
            <MediaCarousel
              media={images}
              createpost={true}
              setMedia={setImages}
            />
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
          {!complete ? (
            <Button
              onClick={() => {
                fileref.current.click();
              }}
              className="mt-5"
            >
              Select from computer
            </Button>
          ) : (
            <>
              {loading ? (
                <Button onClick={handelCreatePost} className="mt-5">
                  <Loader2 className="mr-2 animate-spin" />
                  Please wait ...
                </Button>
              ) : (
                <Button onClick={handelCreatePost} className="mt-5">
                  Post
                </Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePost;
