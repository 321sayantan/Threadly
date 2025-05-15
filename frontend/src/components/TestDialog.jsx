import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";



const testDialog = () => {
 const [open, setOpen]=useState()
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
            <h1>open</h1>
        </DialogTrigger>
        <DialogContent onInteractOutside={() => setOpen(false)}>
          <div className="text-xl">Create Post</div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default testDialog;
