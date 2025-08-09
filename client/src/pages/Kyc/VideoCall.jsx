import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function VideoCall() {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef(null);
  const [incall, setInCall] = useState(false)
  const [roomId, setRoomId] = useState("room1");

  useEffect(() => {
    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Get media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream));
      });

    // Handle remote stream
    pcRef.current.ontrack = event => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // Send ICE candidates to server
    pcRef.current.onicecandidate = event => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate, roomId });
      }
    };

    // Listen for signaling data
    socket.on("offer", async (offer) => {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      socket.emit("answer", { answer, roomId });
    });

    socket.on("answer", async (answer) => {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error(err);
      }
    });
    return ()=> {
        endCall();
    }
  }, []);

  const startCall = async () => {
    setInCall(true);
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit("offer", { offer, roomId });
  };
  const endCall = async () => {
    setInCall(false);
  // Close peer connection
  if (pcRef.current) {
    pcRef.current.getSenders().forEach(sender => {
      if (sender.track) sender.track.stop();
    });
    pcRef.current.close();
    pcRef.current = null;
  }
  // Notify server (optional)
  socket.emit("hangup", { roomId });

  // Clear remote video
  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = null;
  }
  // Clear local video
  if (localVideoRef.current) {
    localVideoRef.current.srcObject = null;
  }
};

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted playsInline />
      <video ref={remoteVideoRef} autoPlay playsInline />
       <div class="mt-6 flex items-center justify-end gap-x-6">

    { incall?<button onClick={endCall} type="button" class="text-sm/6 font-semibold text-gray-900">End Call</button>:
    <button onClick={startCall} type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Start Call</button>}
  </div>
    </div>
  );
}
