import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
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
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: callType === "video",
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

  const toggleVideo = () => {
    const newVideoState = !isVideoOff;
    setIsVideoOff(newVideoState);

    if (localVideoRef.current) {
      if (isVideoOff) localVideoRef.current.play();
      else localVideoRef.current.pause();
    }

    //  stream.getVideoTracks().forEach((track) => {
    //    track.enabled = !newVideoState;
    //  });
    console.log(contact.fromUser || contact.receiver._id);
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
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md">
      <div className="h-full flex flex-col">
        {/* Video Section */}
        {callType === "video" && (
          <div className="flex-1 relative h-96 bg-black/20">
            {/* Remote Video */}
            {!callConnected && <Skeleton className="w-full h-full" />}
            {remoteVideoPaused && (
              <div className="w-full h-full flex justify-center items-center">
                Paused
              </div>
            )}
            {remoteAudioPaused && (
              <div className="absolute right-3 top-2 rounded-2xl px-3 py-1 bg-gray-500">
                Mute
              </div>
            )}
            <video
              ref={remoteVidRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />

            {/* Local Video */}
            <div className="absolute bottom-20 right-4 w-52 h-36 bg-black/50 rounded-lg overflow-hidden border-2 border-border/20">
              {isVideoOff && (
                <div className="w-full h-full backdrop-blur-sm flex justify-center items-center">
                  Paused
                </div>
              )}

              <video
                ref={localVideoRef}
                className="w-full h-full object-cover backdrop-blur-sm"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute right-2 bottom-3">
                {isMuted ? <MicOff /> : <Mic />}
              </div>
            </div>

            {/* Screen Share Indicator */}
            {isScreenSharing && (
              <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                Screen Sharing
              </div>
            )}
          </div>
        )}

        {/* Voice Call Avatar Section */}
        {callType === "voice" && (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br">
            <div className="text-center">
              <div className="relative mb-6">
                <Avatar className="h-52 w-52 rounded-full overflow-hidden">
                  <AvatarImage
                    src={contact?.receiver?.profilePicture}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="bg-white/10 text-white text-3xl flex items-center justify-center w-full h-full">
                    {contact?.receiver?.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {connectionStatus === "connecting" && (
                  <div className="absolute inset-0 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                )}
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {contact?.receiver?.username}
              </h2>
              <audio ref={remoteAudioRef} autoPlay hidden />
              <p className="text-white/80 text-lg">
                {connectionStatus === "connecting" && "Connecting..."}
                {connectionStatus === "connected" &&
                  formatDuration(callDuration)}
                {connectionStatus === "failed" && "Connection failed"}
              </p>
            </div>
          </div>
        )}

        {/* Call Info for Video Calls */}
        {callType === "video" && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
            <div className="text-center">
              <p className="text-white font-medium">
                {contact?.receiver?.username}
              </p>
              <p className="text-white/80 text-sm">
                {connectionStatus === "connecting" && "Connecting..."}
                {connectionStatus === "connected" &&
                  formatDuration(callDuration)}
                {connectionStatus === "failed" && "Connection failed"}
              </p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="p-2 absolute bottom-0 w-full backdrop-blur-sm bg-transparent">
          <div className="flex items-center justify-center space-x-4">
            {/* Mute */}
            <Button
              variant={isMuted ? "call-danger" : "glass"}
              size="icon"
              onClick={toggleMute}
              className="h-12 w-12 rounded-full"
            >
              {isMuted ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>

            {/* Video Toggle (only for video calls) */}
            {callType === "video" && (
              <Button
                variant={isVideoOff ? "call-danger" : "glass"}
                size="icon"
                onClick={toggleVideo}
                className="h-12 w-12 rounded-full"
              >
                {isVideoOff ? (
                  <VideoOff className="h-6 w-6" />
                ) : (
                  <Video className="h-6 w-6" />
                )}
              </Button>
            )}

            {/* Speaker */}
            <Button
              variant={isSpeakerOn ? "call-success" : "glass"}
              size="icon"
              onClick={toggleSpeaker}
              className="h-12 w-12 rounded-full"
            >
              {isSpeakerOn ? (
                <Volume2 className="h-6 w-6" />
              ) : (
                <VolumeX className="h-6 w-6" />
              )}
            </Button>

            {/* Screen Share (only for video calls) */}
            {callType === "video" && (
              <Button
                variant={isScreenSharing ? "call-success" : "glass"}
                size="icon"
                onClick={toggleScreenShare}
                className="h-12 w-12 rounded-full"
              >
                <Monitor className="h-6 w-6" />
              </Button>
            )}

            {/* End Call */}
            <Button
              variant="call-danger"
              size="icon"
              onClick={onEndCall}
              className="h-12 w-12 rounded-full hover:cursor-pointer"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
