import React from "react";

const ChatWindow = ({ messages }) => {
  return (
    <div className="chat-window">
      {messages.map((message, index) => (
        <div className="chat-message" key={index}>
          <span className="chat-user">{message.user}:</span> {message.text}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
