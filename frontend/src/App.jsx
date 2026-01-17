import React, { useEffect, useRef, useState } from "react";
import { Login } from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import { ThemeProvider } from "./components/theme_Provider";
import {
  BrowserRouter,
  createBrowserRouter,
  Outlet,
  Route,
  RouterProvider,
  Routes,
  useLocation,
} from "react-router";
import HomeLayout from "./components/HomeLayout.jsx";
import { ClimbingBoxLoader, ScaleLoader } from "react-spinners";
import { CommentDialog } from "./components/Post/CommentDialog";
import CreatePost from "./components/CreatePost.jsx";
// import TestDialog from "./components/TestDialog";
import useUserStore from "./lib/store.js";
import ProfilePage from "./components/ProfilePage/ProfilePage.jsx";
import Feed from "./components/Feed.jsx";
import LeftSideBar from "./components/LeftSideBar.jsx";
import Messages from "./components/Message/Messages.jsx";
import { useSocketStore } from "./lib/socketStore.js";
import SelectedMessage from "./components/Message/selectedMessage.jsx";
import MessageLayout from "./components/Message/MessageLayout.jsx";
import ProtectedRoutes from "./lib/ProtectedRoutes.jsx";
import CallLobby from "./components/Call/CallLobby.jsx";
import IncomingCall from "./components/Call/IncomingCall.jsx";
import useMessageStore from "./lib/messageStore.js";
import { toast } from "sonner";
import CallInterface from "./components/Call/CallInterface.jsx";
import Peer from "./lib/Peer.js";
import { ClockFading, Phone } from "lucide-react";
import Login_new from "./components/Login_new.jsx";

const AuthLayout = () => (
  <>
    <Outlet />
  </>
);

const ProfileLayout = () => (
  <div className="flex relative bg-gray-100 dark:bg-transparent">
    <LeftSideBar />
    <Outlet />
  </div>
);

// const router = createBrowserRouter([
//   { path: "/",
//     element: <Layout />,
//     children: [
//       {path: "", element: <Home />},
//       {path: "/login", element: <Login />},
//       {path: "/Signup", element: <Signup />},
//       {path: "/createPost", element: <CreatePost/>},
//       {path: "/test", element: <TestDialog/>},
//       {path: "/profile", element: <ProfilePage/>},
//     ]
//   }
// ]);

// function App() {
//   return (
//     <>
//       <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
//       <RouterProvider router={router} />
//       </ThemeProvider>
//     </>
//   );
// }

function AppRoutes() {
  const location = useLocation();
  const state = location.state;
  // const background = state && state.backgroundLocation;
  const background = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={background || location}>
        <Route element={<AuthLayout />}>
          {/* <Route path="login" element={<Login />} /> */}
          <Route path="login" element={<Login_new />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/*------------------------- Protected Routes -----------------------------*/}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Feed />} />
          </Route>

          <Route element={<ProfileLayout />}>
            <Route path="profile/:id" element={<ProfilePage />} />
          </Route>

          <Route element={<MessageLayout />}>
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:id" element={<SelectedMessage />} />
          </Route>

          <Route element={<Outlet />}>
            <Route path="room" element={<CallLobby />} />
            {/* <Route path="room" element={<div>lsdkjflsdf</div>} /> */}
            <Route path="room/:id" element={<h1>inside room</h1>} />
          </Route>
        </Route>
      </Routes>

      {/* Modal Route */}
      {background && (
        <Routes>
          <Route path="/create-Post" element={<CreatePost />} />
          {/* <Route path="/test" element={<ChatSideBar />} /> */}
        </Routes>
      )}
    </>
  );
}

// export default function App() {
//   const { Theme } = useUserStore();
//   const { initSocket, disconnectSocket, onlineUsers } = useSocketStore();
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [isCallActive, setIsCallActive] = useState(false);
//   const [incomingOffer, setIncomingOffer] = useState(null);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const isCallLobbyOpen = useMessageStore((s) => s.isCallLobbyOpen);
//   const callType = useMessageStore((s) => s.callType);
//   const setCallType = useMessageStore((s) => s.setCallType);
//   const setIsCallLobbyOpen = useMessageStore((s) => s.setIsCallLobbyOpen);
//   let socket = useSocketStore.getState((s) => s.socket).socket;
//   var remoteVideoRef;

//   useEffect(() => {
//     console.log(onlineUsers);
//   }, [onlineUsers]);

//   useEffect(() => {
//     const token = document.cookie.includes("token="); // or your logic

//     if (token) {
//       socket = initSocket();
//     }

//     return () => {
//       disconnectSocket();
//     };
//   }, []);

//   useEffect(() => {
//     const handleIce = ({ candidate }) => {
//       Peer.addIceCandidate(candidate);
//     };

//     socket?.on("ice-candidate", handleIce);
//     return () => socket?.off("ice-candidate", handleIce);
//   }, [socket]);

//   useEffect(() => {
//     const handleIce = ({ candidate }) => {
//       Peer.addIceCandidate(candidate);
//     };

//     socket?.on("ice-candidate", handleIce);
//     return () => socket?.off("ice-candidate", handleIce);
//   }, [socket]);

//   useEffect(() => {
//     socket?.on("room:joined", ({ id }) => {
//       console.log(`${id} joined room`);
//     });

//     socket?.on("incomming", (data) => {
//       console.log("incomming call", data);
//       setCallType(data.callType);
//       setSelectedContact(data);
//       setIncomingOffer(data);
//       setIncomingCall(true);
//     });

//     // socket?.on("call:accepted", async ({from, ans})=>{
//     //   await Peer.setRemoteDescription(ans);
//     //   console.log("call accepted");
//     // })

//     return () => {
//       socket?.off("room:joined");
//       socket?.off("incomming");
//       // socket?.off("call:accepted");
//     };
//   }, [socket]);

//   const handleStartCall = () => {
//     console.log("call started");
//     setIsCallActive(true);
//     setIsCallLobbyOpen(false);
//     toast(
//       <div className="flex">
//         <Phone className="w-5 h-5 mr-3" /> Call Started
//       </div>
//     );
//   };

//   const handleCancelCall = () => {
//     setIsCallLobbyOpen(false);
//     toast(
//       <div className="flex">
//         <Phone className="w-5 h-5 mr-3" /> Call Cancelled
//       </div>
//     );
//   };

//   const handleEndCall = () => {
//     setIsCallActive(false);
//     toast("The call has been disconnected.");
//   };

//   const handleAcceptIncomingCall = async () => {
//     const { from, offer } = incomingOffer;
//     const localStream = await navigator.mediaDevices.getUserMedia(
//       callType === "video" ? { video: true, audio: true } : { audio: true }
//     );

//     // const pc = Peer.getPeer();
//     // localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

//     console.log(incomingOffer);
//     console.log(socket);
//     const ans = await Peer.createAnswer(offer, localStream);
//     socket.emit("call:accepted", { to: from, ans });

//     // 4. forward ICE candidates
//     Peer.onIceCandidate((e) => {
//       if (e.candidate) {
//         socket.emit("ice-candidate", {
//           to: from,
//           candidate: e.candidate,
//         });
//       }
//     });

//     // 5. remote track listener
//     Peer.onTrack((ev) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = ev.streams[0];
//       }
//     });

//     setIncomingCall(false);
//     setIsCallActive(true);
//     console.log(1, isCallActive);
//   };
//   const handleDeclineIncomingCall = () => {
//     setIncomingCall(false);
//   };

//   return (
//     <ThemeProvider defaultTheme={Theme} storageKey="vite-ui-theme">
//       {/* incomingCall */}
//       {incomingCall && (
//         <IncomingCall
//           isVisible={incomingCall}
//           caller={123}
//           callType={callType}
//           contact={selectedContact}
//           onAccept={handleAcceptIncomingCall}
//           onDecline={handleDeclineIncomingCall}
//         />
//       )}

//       {/* Call Lobby */}
//       {isCallLobbyOpen && (
//         <CallLobby
//           isOpen={isCallLobbyOpen}
//           callType={callType}
//           contact={selectedContact}
//           onStartCall={handleStartCall}
//           onCancel={handleCancelCall}
//         />
//       )}

//       {/* Call Interface Overlay */}
//       {isCallActive && (
//         <CallInterface
//           isActive={isCallActive}
//           callType={callType}
//           contact={selectedContact}
//           onEndCall={handleEndCall}
//           remoteVideoRef={remoteVideoRef}
//         />
//       )}

//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// }

// export default function App() {
//   const { Theme } = useUserStore();
//   const { initSocket, disconnectSocket, onlineUsers } = useSocketStore();
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [isCallActive, setIsCallActive] = useState(false);
//   const [incomingOffer, setIncomingOffer] = useState(null);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const isCallLobbyOpen = useMessageStore((s) => s.isCallLobbyOpen);
//   const callType = useMessageStore((s) => s.callType);
//   const setCallType = useMessageStore((s) => s.setCallType);
//   const setIsCallLobbyOpen = useMessageStore((s) => s.setIsCallLobbyOpen);
//   let socket = useSocketStore.getState((s) => s.socket).socket;
//   var remoteVideoRef;

//   useEffect(() => {
//     console.log(onlineUsers);
//   }, [onlineUsers]);

//   useEffect(() => {
//     const token = document.cookie.includes("token="); // or your logic

//     if (token) {
//       socket = initSocket();
//     }

//     return () => {
//       disconnectSocket();
//     };
//   }, []);

//   useEffect(() => {
//     const handleIce = ({ candidate }) => {
//       Peer.addIceCandidate(candidate);
//     };

//     socket?.on("ice-candidate", handleIce);
//     return () => socket?.off("ice-candidate", handleIce);
//   }, [socket]);

//   useEffect(() => {
//     const handleIce = ({ candidate }) => {
//       Peer.addIceCandidate(candidate);
//     };

//     socket?.on("ice-candidate", handleIce);
//     return () => socket?.off("ice-candidate", handleIce);
//   }, [socket]);

//   useEffect(() => {
//     socket?.on("room:joined", ({ id }) => {
//       console.log(`${id} joined room`);
//     });

//     socket?.on("incomming", (data) => {
//       console.log("incomming call", data);
//       setCallType(data.callType);
//       setSelectedContact(data);
//       setIncomingOffer(data);
//       setIncomingCall(true);
//     });

//     // socket?.on("call:accepted", async ({from, ans})=>{
//     //   await Peer.setRemoteDescription(ans);
//     //   console.log("call accepted");
//     // })

//     return () => {
//       socket?.off("room:joined");
//       socket?.off("incomming");
//       // socket?.off("call:accepted");
//     };
//   }, [socket]);

//   const handleStartCall = () => {
//     console.log("call started");
//     setIsCallActive(true);
//     setIsCallLobbyOpen(false);
//     toast(
//       <div className="flex">
//         <Phone className="w-5 h-5 mr-3" /> Call Started
//       </div>
//     );
//   };

//   const handleCancelCall = () => {
//     setIsCallLobbyOpen(false);
//     toast(
//       <div className="flex">
//         <Phone className="w-5 h-5 mr-3" /> Call Cancelled
//       </div>
//     );
//   };

//   const handleEndCall = () => {
//     setIsCallActive(false);
//     toast("The call has been disconnected.");
//   };

//   const handleAcceptIncomingCall = async () => {
//     const { from, offer } = incomingOffer;
//     const localStream = await navigator.mediaDevices.getUserMedia(
//       callType === "video" ? { video: true, audio: true } : { audio: true }
//     );

//     // const pc = Peer.getPeer();
//     // localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

//     console.log(incomingOffer);
//     console.log(socket);
//     const ans = await Peer.createAnswer(offer, localStream);
//     socket.emit("call:accepted", { to: from, ans });

//     // 4. forward ICE candidates
//     Peer.onIceCandidate((e) => {
//       if (e.candidate) {
//         socket.emit("ice-candidate", {
//           to: from,
//           candidate: e.candidate,
//         });
//       }
//     });

//     // 5. remote track listener
//     Peer.onTrack((ev) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = ev.streams[0];
//       }
//     });

//     setIncomingCall(false);
//     setIsCallActive(true);
//     console.log(1, isCallActive);
//   };
//   const handleDeclineIncomingCall = () => {
//     setIncomingCall(false);
//   };

//   return (
//     <ThemeProvider defaultTheme={Theme} storageKey="vite-ui-theme">
//       {/* incomingCall */}
//       {incomingCall && (
//         <IncomingCall
//           isVisible={incomingCall}
//           caller={123}
//           callType={callType}
//           contact={selectedContact}
//           onAccept={handleAcceptIncomingCall}
//           onDecline={handleDeclineIncomingCall}
//         />
//       )}

//       {/* Call Lobby */}
//       {isCallLobbyOpen && (
//         <CallLobby
//           isOpen={isCallLobbyOpen}
//           callType={callType}
//           contact={selectedContact}
//           onStartCall={handleStartCall}
//           onCancel={handleCancelCall}
//         />
//       )}

//       {remoteVideoRef && (
//         <video
//           ref={remoteVideoRef}
//           className="w-full h-full object-cover z-100"
//           autoPlay
//           playsInline
//           muted
//         />
//       )}

//       {/* Call Interface Overlay */}
//       {isCallActive && (
//         <CallInterface
//           isActive={isCallActive}
//           callType={callType}
//           contact={selectedContact}
//           onEndCall={handleEndCall}
//           remoteVideoRef={remoteVideoRef}
//         />
//       )}

//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// }

// export default App;

export default function App() {
  const { Theme } = useUserStore();
  const { initSocket, disconnectSocket, onlineUsers } = useSocketStore();
  const [incomingCall, setIncomingCall] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState(null);
  // const [selectedContact, setSelectedContact] = useState(null);
  const isCallLobbyOpen = useMessageStore((s) => s.isCallLobbyOpen);
  const callType = useMessageStore((s) => s.callType);
  const setCallType = useMessageStore((s) => s.setCallType);
  const setIsCallLobbyOpen = useMessageStore((s) => s.setIsCallLobbyOpen);
  const remoteVideoRef = useRef(null);
  const selectedContact = useMessageStore((s) => s.selectedChat);
  const setSelectedContact = useMessageStore((s) => s.setSelectedChat);
  const callContact = useMessageStore((s) => s.callContact);
  const setCallContact = useMessageStore((s) => s.setCallContact);
  const stream = useMessageStore((s) => s.stream);
  const setStream = useMessageStore((s) => s.setStream);
  const setCallConnected = useMessageStore((s) => s.setCallConnected);
  const { user } = useUserStore();
  const setTimebound = useMessageStore((s) => s.setTimebound);

  let socket = useSocketStore.getState().socket;

  useEffect(() => {
    const token = document.cookie.includes("token=");
    if (token) {
      socket = initSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    const handleIce = ({ candidate }) => {
      Peer.addIceCandidate(candidate);
      console.log("ice candidate added");
    };
    socket?.on("ice-candidate", handleIce);
    return () => socket?.off("ice-candidate", handleIce);
  }, [socket]);

  useEffect(() => {
    socket?.on("room:joined", ({ id }) => {
      console.log(`${id} joined room`);
    });

    socket?.on("incomming", (data) => {
      console.log("incomming call", data);
      setCallType(data.callType);
      // setSelectedContact(data);
      setCallContact(data);
      setIncomingOffer(data);
      setIncomingCall(true);
    });

    socket?.on("call:end", () => {
      console.log("Call ended by remote peer");

      const pc = Peer.getPeer();
      pc.getSenders().forEach((sender) => sender.track?.stop());
      pc.getReceivers().forEach((receiver) => receiver.track?.stop());

      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      Peer.close();

      setStream(null);
      setIsCallActive(false);
      setCallConnected(false);
      toast("The call has been disconnected.");
    });

    socket?.on("call:rejected", ({ msg }) => {
      setIsCallActive(false);
      setIncomingCall(false);
      const pc = Peer.getPeer();
      pc.getSenders().forEach((sender) => sender.track?.stop());
      pc.getReceivers().forEach((receiver) => receiver.track?.stop());
      if (!msg) toast("Call Rejected");
    });

    return () => {
      socket?.off("room:joined");
      socket?.off("incomming");
      socket?.off("call:end");
      socket?.off("call:rejected");
    };
  }, [socket]);

  const handleStartCall = () => {
    const timebound = setTimeout(() => {
      socket.emit("call:rejected", {
        to: callContact.fromUser || callContact.receiver._id,
        msg: "Call Timeout!",
      });
      setIsCallActive(false);
      const pc = Peer.getPeer();
      pc.getSenders().forEach((sender) => sender.track?.stop());
      pc.getReceivers().forEach((receiver) => receiver.track?.stop());
      toast("Call Timeout!");
    }, 10 * 1000);
    setTimebound(timebound);
    setIsCallActive(true);
    setIsCallLobbyOpen(false);
    toast(
      <div className="flex">
        <Phone className="w-5 h-5 mr-3" /> Call Started
      </div>
    );
  };

  const handleCancelCall = () => {
    setIsCallLobbyOpen(false);
    toast(
      <div className="flex">
        <Phone className="w-5 h-5 mr-3" /> Call Cancelled
      </div>
    );
  };

  const handleEndCall = () => {

    const remoteUserId =
      callContact?.fromUser ||
      callContact?.receiver?._id ||
      callContact?._id ||
      null;

    // Notify the other peer
    socket.emit("call:end", {
      to: remoteUserId,
    });


    const pc = Peer.getPeer();
    pc.getSenders().forEach((sender) => sender.track?.stop());
    pc.getReceivers().forEach((receiver) => receiver.track?.stop());

    // Clean up local peer connection

    // Stop local stream
    if (stream instanceof MediaStream) {
      console.log("closing local stream");
      stream.getTracks().forEach((track) => track.stop());
    }

    Peer.close();

    setStream(null);
    setIsCallActive(false);
    setCallConnected(false);
    toast("The call has been disconnected.");
  };

  const handleAcceptIncomingCall = async () => {
    const { from, offer, receiver } = incomingOffer;
    const localStream = await navigator.mediaDevices.getUserMedia(
      callType === "video" ? { video: true, audio: true } : { audio: true }
    );

    const ans = await Peer.createAnswer(offer, localStream);
    socket.emit("call:accepted", { to: from, ans });

    Peer.onIceCandidate((e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          to: from,
          type: "socketid",
          candidate: e.candidate,
        });
      }
    });

    // Peer.onTrack((ev) => {
    //   console.log("reciving tracks after accepting call");
    //   if (remoteVideoRef.current) {
    //     remoteVideoRef.current.srcObject = ev.streams[0];
    //   }
    // });
    console.log("REMOTE video ref", remoteVideoRef);

    setIncomingCall(false);
    setIsCallActive(true);
    setCallConnected(true);
  };

  const handleDeclineIncomingCall = () => {
    socket.emit("call:rejected", {
      to: callContact.fromUser || callContact.receiver._id,
    });
    setIncomingCall(false);
  };

  return (
    <ThemeProvider defaultTheme={Theme} storageKey="vite-ui-theme">
      {incomingCall && (
        <IncomingCall
          isVisible={incomingCall}
          caller={123}
          callType={callType}
          contact={callContact}
          onAccept={handleAcceptIncomingCall}
          onDecline={handleDeclineIncomingCall}
          remoteVidRef={remoteVideoRef}
        />
      )}

      {isCallLobbyOpen && (
        <CallLobby
          isOpen={isCallLobbyOpen}
          callType={callType}
          contact={selectedContact}
          onStartCall={handleStartCall}
          onCancel={handleCancelCall}
          remoteVidRef={remoteVideoRef}
        />
      )}

      {isCallActive && (
        <CallInterface
          isActive={isCallActive}
          callType={callType}
          contact={selectedContact}
          onEndCall={handleEndCall}
          remoteVidRef={remoteVideoRef}
        />
      )}

      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
