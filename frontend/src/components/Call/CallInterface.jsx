import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  LoaderCircle,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  SwitchCameraIcon,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from "lucide-react";
// import { useSidebar } from "@/hooks/MessageSidebarContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Peer from "@/lib/Peer";
import { useSocketStore } from "@/lib/socketStore";
import useMessageStore from "@/lib/messageStore";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { ClimbingBoxLoader } from "react-spinners";

const CallInterface = ({
  isActive,
  callType,
  contact,
  onEndCall,
  remoteVidRef, // <--- This is the prop from App.jsx
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [remoteVideoPaused, setRemoteVideoPaused] = useState(false);
  const [remoteAudioPaused, setRemoteAudioPaused] = useState(false);

  const stream = useMessageStore((s) => s.stream);
  const setStream = useMessageStore((s) => s.setStream);
  const { socket } = useSocketStore();
  contact = contact || useMessageStore((s) => s.selectedChat);
  const callConnected = useMessageStore((s) => s.callConnected);
  const setCallConnected = useMessageStore((s) => s.setCallConnected);
  const [connectionStatus, setConnectionStatus] = useState(
    callConnected ? "connected" : "connecting"
  );
  const timebound = useMessageStore((s) => s.timebound);
  const [cameraFacing, setCameraFacing] = useState("user");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const localVideoRef = useRef(null); // Local ref is fine here
  const intervalRef = useRef(null);
  const remoteAudioRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;
    console.log("REMOTE VIDEO REF (prop)", remoteVidRef); // Use the prop

    // const timer = setTimeout(() => setConnectionStatus("connected"), 2000);
    // intervalRef.current = setInterval(
    //   () => setCallDuration((prev) => prev + 1),
    //   1000
    // );

    setupMediaAndTracks();

    return () => {
      // clearTimeout(timer);
      // clearInterval(intervalRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    if (connectionStatus === "connected") {
      intervalRef.current = setInterval(
        () => setCallDuration((prev) => prev + 1),
        1000
      );
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [connectionStatus]);

  const setupMediaAndTracks = async () => {
    try {
      // const mediaStream = await navigator.mediaDevices.getUserMedia({
      //   video: callType === "video",
      //   audio: true,
      // });

      // 1️⃣  detect how many cameras we have
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === "videoinput");
      const hasMultipleCameras = videoInputs.length > 1;
      setHasMultipleCameras(hasMultipleCameras);

      const newFacing = cameraFacing === "user" ? "environment" : "user";
      setCameraFacing(newFacing);

      // 2️⃣  first camera: user-facing
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing },
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }

      // setStream(mediaStream);

      const pc = Peer.getPeer();
      mediaStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, mediaStream));

      pc.ontrack = (ev) => {
        console.log("Receiving remote track from peer connection");
        if (remoteVidRef.current) {
          // Use the prop here
          remoteVidRef.current.srcObject = ev.streams[0];
        }
      };

      console.log("Media and tracks initialized");
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setConnectionStatus("failed");
    }
  };

  const flipCamera = async () => {
    const newFacing = cameraFacing === "user" ? "environment" : "user";
    setCameraFacing(newFacing);

    // stop old tracks
    const pc = Peer.getPeer();
    pc.getSenders()
      .filter((s) => s.track?.kind === "video")
      .forEach((sender) => sender.track?.stop());

    // get new stream
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: newFacing },
      audio: true,
    });

    // replace video track
    const videoSender = pc.getSenders().find((s) => s.track?.kind === "video");
    if (videoSender)
      await videoSender.replaceTrack(newStream.getVideoTracks()[0]);

    // update local preview
    if (localVideoRef.current) localVideoRef.current.srcObject = newStream;
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const handleCallAccepted = async ({ from, ans }) => {
      console.log("Call accepted");
      clearTimeout(timebound);
      await Peer.setRemoteDescription(ans);
      setCallConnected(true);
      setConnectionStatus("connected");
    };
    socket?.on("call:accepted", handleCallAccepted);

    socket.on("media:toggle", ({ type, enabled, userID }) => {
      console.log(`${type} from ${userID} is now ${enabled ? "on" : "off"}`);

      if (type === "video" && remoteVidRef.current?.srcObject) {
        const stream = remoteVidRef.current.srcObject;

        // Toggle video tracks
        stream.getVideoTracks().forEach((track) => {
          track.enabled = enabled;
        });

        // Toggle audio tracks in sync with video
        // stream.getAudioTracks().forEach((track) => {
        //   track.enabled = enabled;
        // });

        setRemoteVideoPaused(!enabled);
        // setRemoteAudioPaused(!enabled);
      }

      if (type === "audio" &&
        callType === "video" &&
        remoteVidRef.current?.srcObject
      ) {
        const stream = remoteVidRef.current.srcObject;
        // Toggle audio tracks in sync with video
        stream.getAudioTracks().forEach((track) => {
          track.enabled = enabled;
        });
        setRemoteAudioPaused(!enabled);
      }

      if (
        type === "audio" &&
        callType === "audio" &&
        remoteAudioRef.current?.srcObject
      ) {
        remoteAudioRef.current.srcObject.getAudioTracks().forEach((track) => {
          track.enabled = enabled;
        });
        setRemoteAudioPaused(!enabled);
      }

      // Optionally reflect changes visually (like fading out video)
    });

    return () => {
      socket?.off("call:accepted", handleCallAccepted);
      socket.off("media:toggle");
    };
  }, [socket]);

  useEffect(() => {
    if (!stream) return;

    if (callConnected) {
      if (callType === "video" && remoteVidRef?.current) {
        remoteVidRef.current.srcObject = stream;
        setConnectionStatus("connected");
      } else if (callType === "voice" && remoteAudioRef?.current) {
        remoteAudioRef.current.srcObject = stream;
        setConnectionStatus("connected");
      }
    }
  }, [stream, callType, remoteVidRef, remoteAudioRef]);

  // useEffect(() => {
  //   Peer.onTrack((ev) => {
  //     const remoteStream = ev.streams[0];

  //     if (callType === "video" && remoteVidRef?.current) {
  //       remoteVidRef.current.srcObject = remoteStream;
  //     } else if (callType === "voice" && remoteAudioRef?.current) {
  //       remoteAudioRef.current.srcObject = remoteStream;
  //     }

  //     setConnectionStatus("connected"); // ✅ Only set once remote stream is received
  //   });
  // }, [callType, remoteVidRef, remoteAudioRef]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !newMuted;
    });

    socket.emit("media:toggle", {
      type: "audio",
      enabled: !newMuted,
      userID: contact.fromUser || contact.receiver._id,
    });
  };

  // const toggleVideo = () => {
  //   const newVideoState = !isVideoOff;
  //   setIsVideoOff(!isVideoOff);
  //   console.log("Toggling video. isVideoOff:", newVideoState);

  //   if (localVideoRef.current) {
  //     if (isVideoOff) localVideoRef.current.play();
  //     else localVideoRef.current.pause();
  //   }

  // // Toggle LOCAL video tracks only
  // // if (localVideoRef.current?.srcObject) {
  // //   localVideoRef.current.srcObject.getVideoTracks().forEach((track) => {
  // //     track.enabled = isVideoOff;
  // //   });
  // // }

  //   console.log(contact.fromUser || contact.receiver._id);
  //   socket.emit("media:toggle", {
  //     type: "video",
  //     enabled: !newVideoState,
  //     userID: contact.fromUser || contact.receiver._id,
  //   });
  // };

  const toggleVideo = () => {
    const newVideoState = !isVideoOff;
    setIsVideoOff(newVideoState);

    // Toggle LOCAL video tracks only
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getVideoTracks().forEach((track) => {
        track.enabled = !newVideoState; // enabled when isVideoOff is false
      });
    }

    // Keep the video element playing even when track is disabled
    if (localVideoRef.current && localVideoRef.current.paused) {
      localVideoRef.current.play().catch(err => console.log("Play error:", err));
    }

    socket.emit("media:toggle", {
      type: "video",
      enabled: !newVideoState,
      userID: contact.fromUser || contact.receiver._id,
    });
  };


  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-black via-gray-900 to-black">
      {/* ---------------- VIDEO CALL ---------------- */}
      {callType === "video" && (
        <div className="relative h-full flex flex-col">
          {/* Remote feed */}
          <div className="flex-1 bg-black">
            {!callConnected && <Skeleton className="w-full h-full" />}
            {remoteVideoPaused && (
              <div className="absolute inset-0 flex items-center justify-center text-white/60 text-lg">
                Remote video paused
              </div>
            )}
            <video
              ref={remoteVidRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
            {remoteAudioPaused && (
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-medium">
                Muted
              </div>
            )}
          </div>

          {/* Local feed – portrait on mobile, landscape on ≥sm */}
          <div
            className="
              absolute bottom-24 right-3 z-20
              w-28 h-40 sm:w-60 sm:h-36
              rounded-2xl overflow-hidden
              border-2 border-white/20 bg-black/40 backdrop-blur-md
              aspect-[9/16] sm:aspect-video
            "
          >
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
              style={{ filter: isVideoOff ? "brightness(0.2)" : "none" }}
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm bg-black/60">
                Paused
              </div>
            )}
            <div className="absolute bottom-2 right-2">
              {isMuted ? (
                <MicOff size={17} className="text-red-400" />
              ) : (
                <Mic size={17} className="text-white" />
              )}
            </div>
          </div>

          {/* Screen-share indicator */}
          {isScreenSharing && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-yellow-400 text-black text-xs font-semibold">
              Sharing screen
            </div>
          )}

          {/* Caller info card */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2.5 rounded-2xl bg-gray-500 backdrop-blur-xl shadow-lg">
            <h2 className="text-white font-bold text-center text-base sm:text-lg">
              {contact?.receiver?.username}
            </h2>
            <p className="text-white/70 text-xs sm:text-sm text-center">
              {connectionStatus === "connecting" && "Connecting…"}
              {connectionStatus === "connected" && formatDuration(callDuration)}
              {connectionStatus === "failed" && "Connection failed"}
            </p>
          </div>
        </div>
      )}

      {/* ---------------- VOICE CALL ---------------- */}
      {callType === "voice" && (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/10 flex items-center justify-center text-white text-4xl ring-4 ring-white/20">
              {contact?.receiver?.username
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            {connectionStatus === "connecting" && (
              <LoaderCircle className="absolute inset-0 m-auto h-36 w-36 text-white/30 animate-spin" />
            )}
          </div>

          <h1 className="text-white text-2xl sm:text-3xl font-bold mt-4">
            {contact?.receiver?.username}
          </h1>
          <p className="text-white/70 mt-2">
            {connectionStatus === "connecting" && "Connecting…"}
            {connectionStatus === "connected" && formatDuration(callDuration)}
            {connectionStatus === "failed" && "Connection failed"}
          </p>
          <audio ref={remoteAudioRef} autoPlay hidden />
        </div>
      )}

      {/* ---------------- CONTROLS ---------------- */}
      <div className="absolute bottom-0 w-full p-4">
        <div className="max-w-md mx-auto flex items-center justify-around bg-white/10 backdrop-blur-xl rounded-2xl p-2">
          {/* Mic */}
          <ControlButton
            onClick={toggleMute}
            active={!isMuted}
            danger={isMuted}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </ControlButton>

          {/* Video toggle */}
          {callType === "video" && (
            <ControlButton
              onClick={toggleVideo}
              active={!isVideoOff}
              danger={isVideoOff}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </ControlButton>
          )}

          {/* Speaker */}
          <ControlButton
            onClick={toggleSpeaker}
            active={isSpeakerOn}
            success={isSpeakerOn}
          >
            {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </ControlButton>

          {/* Screen share (desktop only) */}
          {callType === "video" && (
            <ControlButton
              onClick={toggleScreenShare}
              active={isScreenSharing}
              success={isScreenSharing}
            >
              <Monitor size={20} />
            </ControlButton>
          )}

          {/* Camera flip (mobile only) */}
          {callType === "video" && hasMultipleCameras && (
            <button
              onClick={flipCamera}
              className="h-12 w-12 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition md:hidden"
            >
              <SwitchCameraIcon size={20} />
            </button>
          )}

          {/* End call */}
          <button
            onClick={onEndCall}
            className="h-12 w-12 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};


/* Helper for consistent glass buttons */
/* Re-usable glass button */
const ControlButton = ({
  children,
  active,
  danger,
  success,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "h-12 w-12 flex items-center justify-center rounded-full transition",
      danger
        ? "bg-red-500/80 text-white hover:bg-red-500"
        : success
          ? "bg-green-500/80 text-white hover:bg-green-500"
          : active
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-white/10 text-white/70 hover:bg-white/20"
    )}
  >
    {children}
  </button>
);

export default CallInterface;



// <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md">
//   <div className="h-full flex flex-col">
//     {/* Video Section */}
//     {callType === "video" && (
//       <div className="flex-1 relative h-96 bg-black/20">
//         {/* Remote Video */}
//         {!callConnected && <Skeleton className="w-full h-full" />}
//         {remoteVideoPaused && (
//           <div className="w-full h-full flex justify-center items-center">
//             Paused
//           </div>
//         )}
//         {remoteAudioPaused && (
//           <div className="absolute right-3 top-2 rounded-2xl px-3 py-1 bg-gray-500">
//             Mute
//           </div>
//         )}
//         <video
//           ref={remoteVidRef}
//           className="w-full h-full object-cover"
//           autoPlay
//           playsInline
//         />

//         {/* Local Video */}
//         <div className="absolute bottom-20 right-4 w-52 h-36 bg-black/50 rounded-lg overflow-hidden border-2 border-border/20">
//           {isVideoOff && (
//             <div className="w-full h-full backdrop-blur-sm flex justify-center items-center">
//               Paused
//             </div>
//           )}

//           <video
//             ref={localVideoRef}
//             className="w-full h-full object-cover backdrop-blur-sm"
//             autoPlay
//             playsInline
//             muted
//           />
//           <div className="absolute right-2 bottom-3">
//             {isMuted ? <MicOff /> : <Mic />}
//           </div>
//         </div>

//         {/* Screen Share Indicator */}
//         {isScreenSharing && (
//           <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
//             Screen Sharing
//           </div>
//         )}
//       </div>
//     )}

//     {/* Voice Call Avatar Section */}
//     {callType === "voice" && (
//       <div className="flex-1 flex items-center justify-center bg-gradient-to-br">
//         <div className="text-center">
//           <div className="relative mb-6">
//             <Avatar className="h-52 w-52 rounded-full overflow-hidden">
//               <AvatarImage
//                 src={contact?.receiver?.profilePicture}
//                 className="object-cover w-full h-full"
//               />
//               <AvatarFallback className="bg-white/10 text-white text-3xl flex items-center justify-center w-full h-full">
//                 {contact?.receiver?.username
//                   .split(" ")
//                   .map((n) => n[0])
//                   .join("")
//                   .toUpperCase()}
//               </AvatarFallback>
//             </Avatar>
//             {connectionStatus === "connecting" && (
//               <div className="absolute inset-0 rounded-full border-4 border-white/30 border-t-white animate-spin" />
//             )}
//           </div>
//           <h2 className="text-2xl font-semibold text-white mb-2">
//             {contact?.receiver?.username}
//           </h2>
//           <audio ref={remoteAudioRef} autoPlay hidden />
//           <p className="text-white/80 text-lg">
//             {connectionStatus === "connecting" && "Connecting..."}
//             {connectionStatus === "connected" &&
//               formatDuration(callDuration)}
//             {connectionStatus === "failed" && "Connection failed"}
//           </p>
//         </div>
//       </div>
//     )}

//     {/* Call Info for Video Calls */}
//     {callType === "video" && (
//       <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
//         <div className="text-center">
//           <p className="text-white font-medium">
//             {contact?.receiver?.username}
//           </p>
//           <p className="text-white/80 text-sm">
//             {connectionStatus === "connecting" && "Connecting..."}
//             {connectionStatus === "connected" &&
//               formatDuration(callDuration)}
//             {connectionStatus === "failed" && "Connection failed"}
//           </p>
//         </div>
//       </div>
//     )}

//     {/* Controls */}
//     <div className="p-2 absolute bottom-0 w-full backdrop-blur-sm bg-transparent">
//       <div className="flex items-center justify-center space-x-4">
//         {/* Mute */}
//         <Button
//           variant={isMuted ? "call-danger" : "glass"}
//           size="icon"
//           onClick={toggleMute}
//           className="h-12 w-12 rounded-full"
//         >
//           {isMuted ? (
//             <MicOff className="h-6 w-6" />
//           ) : (
//             <Mic className="h-6 w-6" />
//           )}
//         </Button>

//         {/* Video Toggle (only for video calls) */}
//         {callType === "video" && (
//           <Button
//             variant={isVideoOff ? "call-danger" : "glass"}
//             size="icon"
//             onClick={toggleVideo}
//             className="h-12 w-12 rounded-full"
//           >
//             {isVideoOff ? (
//               <VideoOff className="h-6 w-6" />
//             ) : (
//               <Video className="h-6 w-6" />
//             )}
//           </Button>
//         )}

//         {/* Speaker */}
//         <Button
//           variant={isSpeakerOn ? "call-success" : "glass"}
//           size="icon"
//           onClick={toggleSpeaker}
//           className="h-12 w-12 rounded-full"
//         >
//           {isSpeakerOn ? (
//             <Volume2 className="h-6 w-6" />
//           ) : (
//             <VolumeX className="h-6 w-6" />
//           )}
//         </Button>

//         {/* Screen Share (only for video calls) */}
//         {callType === "video" && (
//           <Button
//             variant={isScreenSharing ? "call-success" : "glass"}
//             size="icon"
//             onClick={toggleScreenShare}
//             className="h-12 w-12 rounded-full"
//           >
//             <Monitor className="h-6 w-6" />
//           </Button>
//         )}

//         {/* End Call */}
//         <Button
//           variant="call-danger"
//           size="icon"
//           onClick={onEndCall}
//           className="h-12 w-12 rounded-full hover:cursor-pointer"
//         >
//           <PhoneOff className="h-6 w-6" />
//         </Button>
//       </div>
//     </div>
//   </div>
// </div>