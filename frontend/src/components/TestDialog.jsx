import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useNavigate } from "react-router";




const testDialog = () => {
 const [open, setOpen]=useState(true)
 const navigate = useNavigate()
  return (
    <>
      <Dialog open={open} onOpenChange={(open) => !open && navigate("/")}>
        {/* <DialogTrigger asChild>
            <h1>open</h1>
        </DialogTrigger> */}
        <DialogContent
          onInteractOutside={() => {
            // navigate(-1);
            setOpen(false);
          }}
        >
          <div className="text-xl">Create Post</div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default testDialog;
