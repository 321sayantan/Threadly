import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Phone, PhoneOff } from 'lucide-react';
import Peer from '@/lib/Peer';
import useMessageStore from '@/lib/messageStore';

const IncomingCall = ({
  isVisible,
  caller,
  callType,
  contact,
  onAccept,
  onDecline,
  remoteVidRef,
}) => {
  const [isRinging, setIsRinging] = useState(true);
  const setStream = useMessageStore((s)=> s.setStream);


  useEffect(() => {
    if (isVisible) {
      setIsRinging(true);
      const interval = setInterval(() => {
        setIsRinging((prev) => !prev);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  useEffect(() => {
    Peer.onTrack((ev) => {
      if (remoteVidRef.current) {
        remoteVidRef.current.srcObject = ev.streams[0];
      }
      console.log("REMOTE VIDEO REF 3", ev.streams[0]);
      setStream(ev.streams[0]);
    });
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex items-center justify-center">
      <div className="relative">
        {/* Ripple animation */}
        <div
          className={`absolute inset-0 rounded-full border-4 border-call animate-ping ${
            isRinging ? "opacity-75" : "opacity-0"
          }`}
          style={{
            width: "260px",
            height: "260px",
            left: "11%",
            top: "20%",
            // transform: "translate(-50%, -50%)",
          }}
        />
        {/* <div
          className={`absolute inset-0 rounded-full border-2 border-call/50 animate-pulse ${
            isRinging ? "opacity-50" : "opacity-0"
          }`}
          style={{
            width: "240px",
            height: "240px",
            left: "50%",
            top: "50%",
            // transform: "translate(-50%, -50%)",
          }}
        /> */}

        {/* Main content */}
        <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-border/20 min-w-[320px] text-center">
          {/* Call type indicator */}
          <div className="mb-4">
            <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              Incoming {callType} call
            </span>
          </div>

          {/* Caller avatar */}
          <div className="relative mb-6">
            <Avatar className="w-24 h-24 mx-auto ring-4 ring-call/20">
              <AvatarImage
                src={contact.receiver.profilePicture}
                alt={contact.receiver.username}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-call to-call-accent text-white">
                {contact.receiver.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {caller.isOnline && (
              <div className="absolute bottom-1 right-1/2 translate-x-6 w-6 h-6 bg-green-500 rounded-full border-2 border-card" />
            )}
          </div>

          {/* Caller name */}
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {contact.receiver.username}
          </h2>
          <p className="text-muted-foreground mb-8">is calling you...</p>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-8">
            {/* Decline button */}
            <Button
              variant="call-danger"
              size="lg"
              onClick={onDecline}
              className="w-16 h-16 rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>

            {/* Accept button */}
            <Button
              variant="call-success"
              size="lg"
              onClick={onAccept}
              className="w-16 h-16 rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:cursor-pointer"
            >
              <Phone className="w-6 h-6" />
            </Button>
          </div>

          {/* Pulse animation for accept button */}
          {/* <div className="absolute bottom-[72px] right-[72px]">
            <div className="w-16 h-16 rounded-full bg-call-success/20 animate-ping" />
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-call-success/10 animate-pulse" />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default IncomingCall