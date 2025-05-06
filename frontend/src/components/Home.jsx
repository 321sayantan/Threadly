import React, { useEffect, useState } from "react";
import LeftSideBar from "./LeftSideBar";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSideBar";
import { ScaleLoader } from "react-spinners";

const Home = () => {
const [loading, setLoading] = useState(true);

  // Simulate a loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the delay as needed

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);


  return (
    <>
      {loading ? 
      (<div className="flex justify-center items-center h-screen">
        <ScaleLoader color='red' />
      </div>)
      :
      (<div className="flex">
        <LeftSideBar />
        <div className="flex-grow">
          <Feed />
          <Outlet />
        </div>
        <RightSideBar />
      </div>)}
    </>
  );
};

export default Home;
