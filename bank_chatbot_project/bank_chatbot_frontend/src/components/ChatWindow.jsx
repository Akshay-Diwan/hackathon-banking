import React, { useState, useRef, useEffect } from 'react';

const ChatWindow = ({ chat = [], onSendMessage, onSendAudio, conversationId }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!conversationId) {
      console.error("Conversation ID is missing!");
      return;
    }
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          volume: 1.0
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm;codecs=opus' 
        });
        setAudioBlob(audioBlob);
        
        // Automatically send the audio after recording stops
        sendAudioMessage(audioBlob);
        
        // Stop all tracks to free up the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access denied or not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioMessage = async (blob) => {
    if (!conversationId) {
      console.error("Conversation ID is missing!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('audio', blob, 'audio.webm');
      formData.append('user_id', 'user124'); // Replace with actual user ID
      formData.append('conversation_id', conversationId);

      // Show loading state
      const loadingMessage = "🎤 Processing audio...";
      onSendMessage(loadingMessage);

      const response = await fetch('http://localhost:5001/audio_chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Audio response:', data);

      // Call the parent function to handle the audio response
      if (onSendAudio) {
        onSendAudio(data);
      }

    } catch (error) {
      console.error('Error sending audio:', error);
      // Remove loading message and show error
      onSendMessage("❌ Sorry, I couldn't process your audio. Please try again.");
    }
  };

  const playAudio = (audioUrl) => {
    // If same audio is playing, stop it
    if (isPlaying && currentAudioUrl === audioUrl) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsPlaying(false);
      setAudioInstance(null);
      setCurrentAudioUrl(null);
      return;
    }

    // Stop currently playing audio (if any)
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
    }

    const audio = new Audio(audioUrl);
    setAudioInstance(audio);
    setCurrentAudioUrl(audioUrl);
    setIsPlaying(true);

    audio.play();

    audio.onended = () => {
      setIsPlaying(false);
      setAudioInstance(null);
      setCurrentAudioUrl(null);
    };

    audio.onerror = () => {
      console.error('Error playing audio');
      setIsPlaying(false);
      setAudioInstance(null);
      setCurrentAudioUrl(null);
    };
  };


  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, message]);

  return (
    <div className="chat-window flex flex-col flex-1 p-4">
      <div className="messages flex-grow mb-4 overflow-y-auto">
        {chat.length === 0 ? (
          <div className="text-center text-gray-200 font-bold">What can I help with?</div>
        ) : (
          chat.map((msg, index) => (
            <div key={index} className="message-pair">
              <div className='py-2 flex justify-end'>
                {msg.user && (
                  <div className="user-message bg-[#3C3D37] p-4 rounded-full inline-block max-w-full">
                    <strong className='text-purple-300'>User:</strong> 
                    <span className="ml-2">{typeof msg.user === 'string' ? msg.user : JSON.stringify(msg.user)}</span>
                  </div>
                )}
              </div>
              <div className='py-2'>
                {msg.bot && (
                  <div className="bot-message text-left whitespace-pre-wrap leading-relaxed">
                    <strong className='text-purple-300'>Bot:</strong> 
                    <span className="ml-2">{typeof msg.bot === 'string' ? msg.bot : JSON.stringify(msg.bot)}</span>
                    
                    {/* Audio playback button */}
                    {msg.audioUrl && (
                      <div className="mt-2">
                        <button
                          onClick={() => playAudio(msg.audioUrl)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center gap-2"
                        >
                          {isPlaying && currentAudioUrl === msg.audioUrl ? '⏹️ Stop' : '🔊 Play Audio'}
                        </button>
                      </div>
                    )}
                    
                    {/* Language indicator */}
                    {msg.language && msg.language !== 'en' && (
                      <div className="mt-1">
                        <span className="text-xs text-purple-400 bg-purple-900 px-2 py-1 rounded">
                          {msg.language.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="flex-none flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message or use voice..."
          className="bg-white text-black border border-gray-300 rounded p-2 flex-grow placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isRecording}
        />
        
        {/* Microphone button */}
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-2 rounded-full transition-all duration-200 ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white`}
          title={isRecording ? 'Stop recording' : 'Start voice recording'}
        >
          {isRecording ? '⏹️' : '🎤'}
        </button>
        
        <button 
          type="submit" 
          className="bg-[#ECDFCC] text-gray-800 p-2 rounded hover:bg-opacity-90"
          disabled={isRecording}
        >
          Send
        </button>
      </form>
      
      {/* Recording indicator */}
      {isRecording && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
          🎤 Recording... Click stop when done
        </div>
      )}
    </div>
  );
};

export default ChatWindow;