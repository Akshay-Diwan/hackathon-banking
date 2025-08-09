import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

const ChatApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState();
  const [chats, setChats] = useState(() => {
    const storedChats = localStorage.getItem('chats');
    return storedChats ? JSON.parse(storedChats) : [];
  });
  const [selectedChatIndex, setSelectedChatIndex] = useState(() => {
    const storedIndex = localStorage.getItem('selectedChatIndex');
    return storedIndex ? parseInt(storedIndex, 10) : 0;
  });
  const [conversations, setConversations] = useState(() => {
    const storedConversations = localStorage.getItem('conversations');
    return storedConversations ? JSON.parse(storedConversations) : [];
  });
  const userId = 'user124'; // Replace with actual user ID logic
  const toggleChat = async () => {
    console.log("Toggled chat!")
    if (!isOpen) {
    console.log("working");
    if(!localStorage.getItem('selectedChatIndex')){
      await startNewConversation();
    }
  }

setIsOpen((prev) => !prev);
    
  };
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const currentConversationId = conversations[selectedChatIndex]?.conversationId;
        if (currentConversationId) {
          const response = await axios.get(`http://localhost:5001/history?user_id=${userId}&conversation_id=${currentConversationId}`);
          const data = response.data;

          const formattedData = data.map(chat => ({
            user: chat.user_message,
            bot: chat.bot_response
          }));

          const updatedChats = [...chats];
          updatedChats[selectedChatIndex] = formattedData;
          setChats(updatedChats);
          localStorage.setItem('chats', JSON.stringify(updatedChats)); // Store chats in localStorage
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    console.log("Ye chala")
    fetchChatHistory();
  }, [userId, conversations, selectedChatIndex]);

  const handleSendMessage = async (message) => {
    if (typeof message !== 'string') return;

    if (
      message.includes("Processing audio") ||
      message.includes("couldn't process your audio")
    ) {
      // Just display, don't send to Rasa
      const updatedChats = [...chats];
      if (!updatedChats[selectedChatIndex]) updatedChats[selectedChatIndex] = [];
      updatedChats[selectedChatIndex].push({ user: message });
      setChats([...updatedChats]);
      return;
    }


    const updatedChats = [...chats];

    if (!updatedChats[selectedChatIndex]) {
        updatedChats[selectedChatIndex] = [];
    }
    updatedChats[selectedChatIndex].push({ user: message });
    setChats([...updatedChats]);
    localStorage.setItem('chats', JSON.stringify(updatedChats)); // Store chats in localStorage

    const currentConversationId = conversations[selectedChatIndex]?.conversationId;

    if (!currentConversationId) {
        console.error("Conversation ID is missing!");
        return;
    }

    try {
        const response = await axios.post('http://localhost:5001/chat', {
            message: message,
            user_id: userId,
            conversation_id: currentConversationId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("Full response from backend:", response.data);
        
        // Check if the response data is empty or undefined
        if (!response.data || response.data.length === 0) {
          updatedChats[selectedChatIndex].push({ bot: "⚠️ Sorry, something went wrong." });
          setChats([...updatedChats]);
          return;
        }

        // The backend now returns the original RASA response format, but we're saving the combined text in the database
        // For immediate display, we need to combine the response parts here too
        let botResponse = 'No response';
        let audioResponse = null;
        let detectedLanguage = 'en';

        if (response.data && response.data.length > 0) {
            const textParts = response.data
                .filter(part => part.text) // Only get parts with text
                .map(part => part.text);
            botResponse = textParts.join('\n\n'); // Combine all parts
            
            // Find audio response info (should be the last item we added)
            const audioInfo = response.data.find(part => part.hasOwnProperty('audio_response'));
            if (audioInfo) {
                audioResponse = audioInfo.audio_response;
                detectedLanguage = audioInfo.language || 'en';
            }
        }

        console.log("Combined bot response:", botResponse);
        console.log("Audio response:", audioResponse);

        // Create bot message with audio URL if available
        const botMessage = { 
            bot: botResponse,
            language: detectedLanguage
        };

        if (audioResponse) {
            botMessage.audioUrl = `http://localhost:5001/audio/${audioResponse}`;
        }

        updatedChats[selectedChatIndex].push(botMessage);
        setChats([...updatedChats]);
        localStorage.setItem('chats', JSON.stringify(updatedChats)); // Store chats in localStorage

    } catch (error) {
        console.error('Error sending message:', error);
    }
  };

  const startNewConversation = async () => {
    try {
        const response = await axios.post('http://localhost:5001/new_conversation', {
            user_id: userId
        });
        const newConversationId = response.data.conversation_id;  // Save the conversation ID
        const newConversations = [...conversations, { conversationId: newConversationId }];
        setConversations(newConversations);  // Update the conversations state
        localStorage.setItem('conversations', JSON.stringify(newConversations));  // Store conversations in localStorage
        const newChats = [...chats, []]; // Add a new empty chat array
        setChats(newChats);
        localStorage.setItem('chats', JSON.stringify(newChats)); // Store chats in localStorage
        const newIndex = newConversations.length - 1;
        setSelectedChatIndex(newIndex); // Select the new conversation
        localStorage.setItem('selectedChatIndex', newIndex); // Store selectedChatIndex in localStorage
        console.log('New conversation started:', newConversationId);
    } catch (error) {
        console.error('Error starting a new conversation:', error);
    }
  };

  const deleteConversation = async (index) => {
    const conversationId = conversations[index]?.conversationId;

    if (!conversationId) {
        console.error("Conversation ID is missing!");
        return;
    }

    try {
        await axios.delete(`http://localhost:5001/conversation`, {
            data: {
                user_id: userId,
                conversation_id: conversationId
            }
        });

        const newConversations = conversations.filter((_, i) => i !== index);
        const newChats = chats.filter((_, i) => i !== index);

        setConversations(newConversations);
        setChats(newChats);

        localStorage.setItem('conversations', JSON.stringify(newConversations));
        localStorage.setItem('chats', JSON.stringify(newChats));

        if (selectedChatIndex >= newConversations.length) {
            setSelectedChatIndex(newConversations.length - 1);
            localStorage.setItem('selectedChatIndex', newConversations.length - 1);
        }
    } catch (error) {
        console.error('Error deleting conversation:', error);
    }
  };

  const handleSendAudio = async (audioData) => {
    const updatedChats = [...chats];
    
    if (!updatedChats[selectedChatIndex]) {
      updatedChats[selectedChatIndex] = [];
    }

    // Remove loading message if it exists
    const lastMessage = updatedChats[selectedChatIndex][updatedChats[selectedChatIndex].length - 1];
    if (lastMessage && lastMessage.isLoading) {
      updatedChats[selectedChatIndex].pop();
    }

    // Add user's transcribed message
    updatedChats[selectedChatIndex].push({ 
      user: `🎤 "${audioData.transcribed_text}"`,
      language: audioData.language 
    });

    // Add bot response with audio
    const audioUrl = audioData.audio_response 
      ? `http://localhost:5001/audio/${audioData.audio_response}` 
      : null;
      
    updatedChats[selectedChatIndex].push({ 
      bot: audioData.bot_response,
      audioUrl: audioUrl,
      language: audioData.language
    });

    setChats([...updatedChats]);
    localStorage.setItem('chats', JSON.stringify(updatedChats));
  };

  const selectChat = (index) => {
    setSelectedChatIndex(index);
    localStorage.setItem('selectedChatIndex', index);
  };

    return (
    <>
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 cursor-pointer right-6 bg-blue-600 text-white p-4 rounded-full shadow-[0_0_20px_rgba(255,12,144,1.2)] hover:bg-blue-700 transition duration-300 z-50"
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
  
          {/* Messages & Chat Window */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <ChatWindow
              chat={chats[selectedChatIndex] || []}
              onSendMessage={handleSendMessage}
              onSendAudio={handleSendAudio}
              conversationId={conversations[selectedChatIndex]?.conversationId}
            />
            </div>
  
          {/* Input */}
          {/* <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input) handleSendMessage(input);
              setInput('');
            }}
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
        </form> */}
      </div>
    )}
  </>
);

  // <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
  //           <ChatSidebar
  //             chats={chats}
  //             selectChat={selectChat}
  //             startNewConversation={startNewConversation}
  //             deleteConversation={deleteConversation}
  //             selectedChatIndex={selectedChatIndex}
  //           />
  //           <ChatWindow
  //             chat={chats[selectedChatIndex] || []}
  //             onSendMessage={handleSendMessage}
  //             onSendAudio={handleSendAudio}
  //             conversationId={conversations[selectedChatIndex]?.conversationId}
  //           />
  // </div>
  // return (
  //   <div className="chat-app h-screen flex text-gray-100">
  //     <ChatSidebar
  //       chats={chats}
  //       selectChat={selectChat}
  //       startNewConversation={startNewConversation}
  //       deleteConversation={deleteConversation}
  //       selectedChatIndex={selectedChatIndex}
  //     />
  //     <ChatWindow
  //       chat={chats[selectedChatIndex] || []}
  //       onSendMessage={handleSendMessage}
  //       onSendAudio={handleSendAudio}
  //       conversationId={conversations[selectedChatIndex]?.conversationId}
  //     />
  //   </div>
  // );
};

export default ChatApp;