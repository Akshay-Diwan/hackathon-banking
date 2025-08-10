import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {toast} from "react-hot-toast"

const socket = io("http://localhost:5000");

const UserCallPage = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const [callStarted, setCallStarted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const iceServers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    async function setupLocalStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localVideoRef.current.srcObject = stream;

        peerConnectionRef.current = new RTCPeerConnection(iceServers);
        stream.getTracks().forEach((track) => {
          peerConnectionRef.current.addTrack(track, stream);
        });

        peerConnectionRef.current.ontrack = (event) => {
          remoteVideoRef.current.srcObject = event.streams[0];
        };

        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              to: null, // server will forward ICE to correct peer
              candidate: event.candidate,
            });
          }
        };
      } catch (err) {
        setErrorMsg(
          "Error accessing camera or microphone. Please allow permissions."
        );
      }
    }

    setupLocalStream();

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("call-answered", async (data) => {
      try {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
        setCallStarted(true);
        setCallEnded(false);
      } catch {
        setErrorMsg("Failed to establish connection.");
      }
    });

    socket.on("ice-candidate", (data) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(console.error);
      }
    });

    socket.on("no-admin", () => {
      setErrorMsg("No admin available right now. Please try later.");
    });

    return () => {
      socket.off("call-answered");
      socket.off("ice-candidate");
      socket.off("no-admin");
    };
  }, []);

  async function startCall() {
    if (!peerConnectionRef.current) return toast.error("Something is Wrong");

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      socket.emit("call-user", { offer }); // No 'to' needed
    } catch {
      setErrorMsg("Unable to start call. Try again.");
    }
  }

  function endCall() {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setCallStarted(false);
    setCallEnded(true);
    setErrorMsg("");
    socket.disconnect();
  }

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-blue-50 to-white flex flex-col items-center p-8 font-sans">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-4 text-center">
        Video KYC Verification
      </h1>
      <p className="max-w-xl text-center text-gray-700 mb-10 px-4">
        This video call allows you to connect securely with a bank employee for your KYC verification. Please enable camera and microphone.
      </p>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        <div className="flex flex-col items-center">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-72 h-56 rounded-xl border-4 border-blue-600 shadow-lg"
          />
          <span className="mt-3 text-blue-800 font-semibold">Your Camera</span>
        </div>
        <div className="flex flex-col items-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-72 h-56 rounded-xl border-4 shadow-lg ${
              callStarted ? "border-green-600" : "border-gray-300"
            }`}
          />
          <span
            className={`mt-3 font-semibold ${
              callStarted ? "text-green-700" : "text-gray-400"
            }`}
          >
            {callStarted ? "Bank Employee" : "Waiting for connection..."}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-6 p-3 bg-red-100 text-red-700 rounded-md max-w-md text-center font-medium">
          {errorMsg}
        </div>
      )}

      <div className="mt-10 flex space-x-6">
        {!callStarted && !callEnded && (
          <button
            onClick={startCall}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-lg shadow-md transition duration-300"
          >
            Start Call
          </button>
        )}

        {callStarted && (
          <button
            onClick={endCall}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg shadow-md transition duration-300"
          >
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCallPage;
