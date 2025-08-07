import React, { useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import {
  Mic,
  MicOff,
  Phone,
  Settings,
  Video,
  VideoOff,
  Volume2,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useSidebar } from "@/hooks/MessageSidebarContext";
import useMessageStore from "@/lib/messageStore";
import Peer from "@/lib/Peer";
import { useSocketStore } from "@/lib/socketStore";
import useUserStore from "@/lib/store";

const CallLobby = ({
  isOpen,
  callType,
  contact,
  onStartCall,
  onCancel,
  remoteVidRef,
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === "video");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  // const [stream, setStream] = useState();
  const stream = useMessageStore((s) => s.stream);
  const setStream = useMessageStore((s) => s.setStream);
  const videoRef = useRef(null);
  // const contact = useMessageStore((s) => s.selectedChat);
  contact = contact || useMessageStore((s) => s.selectedChat);
  const setSelectedChat = useMessageStore((s)=> s.setSelectedChat);
  const socket = useSocketStore((s) => s.socket);
  const {user} = useUserStore();
  console.log(1,contact);

  useEffect(() => {
    // if (isOpen && callType === "video" && isVideoEnabled) {
      startCamera();
    // }

    return () => {
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, callType, isVideoEnabled]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      });
      setStream(mediaStream);
      if (isVideoEnabled && videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Failed to access camera/microphone:", error);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
      }
    }
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
      }
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  if (!isOpen) return null;

  // useEffect(() => {
  //   Peer.onTrack((ev) => {
  //     if (remoteVidRef.current) {
  //       remoteVidRef.current.srcObject = ev.streams[0];
  //     }
  //     console.log("REMOTE VIDEO REF 3", remoteVidRef);
  //   });
  // }, []);

  const startCall = async () => {
    console.log(stream);
    const offer = await Peer.createOffer(stream);

    // ✅ Send ICE candidates to receiver
    Peer.onIceCandidate((e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          to: contact.receiver._id,
          type: "userid",
          candidate: e.candidate,
        });
      }
    });

    // setSelectedChat({
    //   _id: contact.receiver._id,
    //   username: user.username,
    //   profilePicture: user.profilePicture,
    // });

    console.log(2, "offer");
    socket.emit("user:call", {
      to: contact.receiver._id,
      from: user._id,
      offer,
      callType,
      receiver: {
        _id: contact.receiver._id,
        username: user.username,
        profilePicture: user.profilePicture,
      },
    });
    onStartCall();
  };

  return (
    <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-glass backdrop-blur-md border border-border/20 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              {contact?.receiver?.profilePicture ? (
                <img
                  src={contact?.receiver?.profilePicture}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-violet-900 bg-gradient-to-br from-primary/0 flex items-center justify-center text-white font-semibold text-lg">
                  {contact?.receiver?.username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
              {contact?.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-600 rounded-full border-2 border-background"></div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {contact?.receiver?.username}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {callType === "video" ? "Video Call" : "Voice Call"}
                </Badge>
                {contact?.isOnline && (
                  <Badge
                    variant="outline"
                    className="text-xs text-call-success text-green-500"
                  >
                    Online
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Video Preview */}
        {callType === "video" && (
          <div className="relative mb-6 rounded-lg overflow-hidden bg-card/50">
            {isVideoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 object-cover bg-card/30"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-card/30 to-card/10 flex items-center justify-center">
                <div className="text-center">
                  <VideoOff className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Camera is off</p>
                </div>
              </div>
            )}

            {/* Preview Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button
                variant={isVideoEnabled ? "glass" : "secondary"}
                size="icon"
                onClick={toggleVideo}
                className="w-12 h-12 rounded-full"
              >
                {isVideoEnabled ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant={isAudioEnabled ? "glass" : "call-danger"}
                size="icon"
                onClick={toggleAudio}
                className="w-12 h-12 rounded-full"
              >
                {isAudioEnabled ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Audio Only Preview */}
        {callType === "voice" && (
          <div className="mb-6 p-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/0 border border-primary/20">
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-4">
                {contact?.receiver?.profilePicture ? (
                  <img
                    src={contact?.receiver.profilePicture}
                    className="w-30 h-30 rounded-full object-cover"
                  ></img>
                ) : (
                  <div className="w-30 h-30 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-2xl mx-auto ">
                    {contact?.receiver?.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Ready to call {contact?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Your microphone is {isAudioEnabled ? "ready" : "muted"}
              </p>
            </div>
          </div>
        )}

        {/* Settings Bar */}
        <div className="flex items-center justify-between mb-6 p-3 rounded-lg bg-card/30 border border-border/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Audio Quality: HD
              </span>
            </div>
            {callType === "video" && (
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Video Quality: 720p
                </span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            variant=""
            onClick={startCall}
            className="flex-1 text-lg font-semibold bg-green-500 hover:bg-green-600"
          >
            {callType === "video" ? (
              <>
                <Video className="h-5 w-5 mr-2" />
                Start Video Call
              </>
            ) : (
              <>
                <Phone className="h-5 w-5 mr-2" />
                Start Voice Call
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CallLobby;
