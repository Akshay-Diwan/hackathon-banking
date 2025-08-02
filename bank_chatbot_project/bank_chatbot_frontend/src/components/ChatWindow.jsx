import React, { useState, useRef, useEffect } from 'react';

const ChatWindow = ({ chat = [], onSendMessage, conversationId }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!conversationId) {
      console.error("Conversation ID is missing!");
      return;
    }
    if (message.trim()) {
      onSendMessage(message);
      setMessage(''); // Clear the input after sending
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, message]);

  // Debug: Log the chat messages to see what's being received
  useEffect(() => {
    if (chat.length > 0) {
      console.log("Latest chat message:", chat[chat.length - 1]);
      console.log("Bot response length:", chat[chat.length - 1]?.bot?.length);
      console.log("Bot response content:", JSON.stringify(chat[chat.length - 1]?.bot));
    }
  }, [chat]);

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
                    <strong className='text-purple-300'>User:</strong> {msg.user}
                  </div>
                )}
              </div>
              <div className='py-2'>
                {msg.bot && (
                  <div className="bot-message text-left whitespace-pre-wrap">
                    <strong className='text-purple-300'>Bot:</strong> {msg.bot}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex-none flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="bg-white text-black border border-gray-300 rounded p-2 flex-grow placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-[#ECDFCC] text-gray-800 p-2 ml-2 rounded hover:bg-opacity-90">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;