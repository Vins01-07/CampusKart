import React, { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import "./Chat.css"; // The CSS file for chat section

const Chat = () => {
  const [messages, setMessages] = useState([
    { user: "Chatbot", text: "Hello! How can I assist you today?" },
  ]);

  // Predefined responses for chatbot in different languages
  const predefinedResponses = {
    english: {
      hello: "Hi there! How can I help you?",
      "how are you?": "I'm just a bot, but I'm doing great! How about you?",
      bye: "Goodbye! Have a great day!",
    },
    hindi: {
      hello: "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?",
      "how are you?": "मैं एक बोट हूँ, लेकिन मैं अच्छे हूँ! आप कैसे हैं?",
      bye: "अलविदा! आपका दिन शुभ हो!",
    },
    marathi: {
      hello: "नमस्कार! मी तुमची कशी मदत करू शकतो?",
      "how are you?": "मी एक बोट आहे, पण मी छान आहे! तुम्ही कसे आहात?",
      bye: "निरोप! तुमचा दिवस शुभ होवो!",
    },
  };

  const addMessage = (user, text) => {
    setMessages((prevMessages) => [...prevMessages, { user, text }]);
  };

  // Detect language of the message (simple method based on predefined keywords)
  const detectLanguage = (text) => {
    if (/[a-zA-Z]/.test(text)) return "english";
    if (/[\u0900-\u097F]/.test(text)) return "hindi";
    if (/[\u0A00-\u0A7F]/.test(text)) return "marathi";
    return "english"; // Default language if none matched
  };

  // Function to simulate chatbot reply after a delay
  const handleBotResponse = (text) => {
    setTimeout(() => {
      const language = detectLanguage(text);
      const response =
        predefinedResponses[language][text.toLowerCase()] ||
        "I'm not sure how to respond to that.";
      addMessage("Chatbot", response);
    }, 1000); // Simulate a delay for the bot response
  };

  // Whenever a new message is added by the user, the bot replies
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.user !== "Chatbot") {
      handleBotResponse(lastMessage.text);
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <ChatWindow messages={messages} />
      <MessageInput addMessage={addMessage} />
    </div>
  );
};

export default Chat;
