import React, { useState } from 'react';
import { FaTrash, FaBars, FaTimes } from 'react-icons/fa';

const ChatSidebar = ({ chats, selectChat, deleteConversation, startNewConversation, selectedChatIndex }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 bg-[#ECDFCC] text-gray-800 rounded hover:bg-[#e2d9cc] fixed top-4 right-4 z-50"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
      <div className={`chat-sidebar w-2/3 sm:w-full h-full border-r p-4 fixed md:relative bg-[#1e201e] md:block ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <h2 className="text-xl mb-4">BoM Chatbot</h2>
        <ul>
          {chats.length === 0 ? (
            <li>No conversations yet</li>
          ) : (
            chats.map((chat, index) => (
              <li
                key={index}
                onClick={() => selectChat(index)}
                className={`cursor-pointer mb-2 p-2 hover:bg-[#6b7069] flex justify-between items-center ${selectedChatIndex === index ? 'bg-[#697565]' : ''}`}
              >
                <div className="flex-1">
                  Conversation {index + 1}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from bubbling up to the parent div
                    if (window.confirm('Are you sure you want to delete this conversation?')) {
                      deleteConversation(index);
                    }
                  }}
                  className="ml-2 p-1 text-white rounded hover:text-red-500"
                >
                  <FaTrash />
                </button>
              </li>
            ))
          )}
        </ul>
        <button
          onClick={startNewConversation}
          className="mt-4 p-2 bg-[#ECDFCC] text-gray-800 rounded hover:bg-[#e2d9cc]"
        >
          New Chat
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;