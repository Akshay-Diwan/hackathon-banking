import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hi there! 👋 How can I help you today?', sender: 'bot', isWelcome: true }
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  const suggestions = [
    '💰 Check my balance',
    '🏦 Open a new account',
    '📄 Show recent transactions',
    '💳 Apply for credit card'
  ];

  const toggleChat = () => setIsOpen((prev) => !prev);
  const handleSuggestionClick = (text) => {
    sendMessageFromSuggestion(text);
  };

  const sendMessageFromSuggestion = (text) => {
    const newUserMessage = { text, sender: 'user' };
    setMessages((prev) => [...prev, newUserMessage]);

    setTimeout(() => {
      const botResponse = {
        text: `You asked: "${text}". I'll handle that shortly!`,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    axios.post(
      'http://localhost:5001',
      {messages,
        user_id: "UserID",
      },
      
    )
    sendMessageFromSuggestion(trimmed);
    setInput('');
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const renderMessageBubble = (msg, index) => {
    const isUser = msg.sender === 'user';
    return (
      <div
        key={index}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
      >
        <div
          className={`max-w-[70%] px-4 py-2 rounded-lg text-sm shadow-sm ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-200 text-black rounded-bl-none'
          }`}
        >
          {msg.text}
        </div>
      </div>
    );
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 cursor-pointer right-6 bg-blue-600   text-white p-4 rounded-full shadow-[0_0_20px_rgba(255,12,144,1.2)] hover:bg-blue-700 transition duration-300 z-50"
        >
          Ask Anything 💬
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-110 max-w-[80vw] h-[500px] bg-[#ff7b005c] border border-gray-300 rounded-xl shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
            <h3 className="text-sm font-semibold">BankBot Assistant</h3>
            <button
              onClick={toggleChat}
              className="text-white cursor-pointer hover:opacity-80 text-xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            {messages.map((msg, index) => renderMessageBubble(msg, index))}

            {/* Suggested Questions (only after welcome message) */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(q)}
                    className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded-full border border-gray-300 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex items-center border-t px-3 py-2 gap-2"
          >
            <input
              type="text"
              className="flex-1 border border-blue-600 bg-amber-500 font-bold rounded-full px-4 py-2 text-sm focus:outline-none"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
