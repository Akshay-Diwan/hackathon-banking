import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

const ChatApp = () => {
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

    fetchChatHistory();
  }, [userId, conversations, selectedChatIndex]);

  const handleSendMessage = async (message) => {
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
        
        // The backend now returns the original RASA response format, but we're saving the combined text in the database
        // For immediate display, we need to combine the response parts here too
        let botResponse = 'No response';
        if (response.data && response.data.length > 0) {
            const textParts = response.data
                .filter(part => part.text) // Only get parts with text
                .map(part => part.text);
            botResponse = textParts.join('\n\n'); // Combine all parts
        }
        
        console.log("Combined bot response:", botResponse);
        
        updatedChats[selectedChatIndex].push({ bot: botResponse });
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

  const selectChat = (index) => {
    setSelectedChatIndex(index);
    localStorage.setItem('selectedChatIndex', index); // Store selectedChatIndex in localStorage
  };

  return (
    <div className="chat-app h-screen flex text-gray-100">
      <ChatSidebar
        chats={chats}
        selectChat={selectChat}
        startNewConversation={startNewConversation}
        deleteConversation={deleteConversation}
        selectedChatIndex={selectedChatIndex}
      />
      <ChatWindow
        chat={chats[selectedChatIndex] || []}
        onSendMessage={handleSendMessage}
        conversationId={conversations[selectedChatIndex]?.conversationId}
      />
    </div>
  );
};

export default ChatApp;