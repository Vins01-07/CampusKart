import React, { useState } from "react";

const MessageInput = ({ addMessage }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      addMessage("You", message);
      setMessage(""); // Reset the input field
    }
  };

  return (
    <div className="message-input-container">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="message-input"
      />
      <button onClick={handleSendMessage} className="send-btn">
        Send
      </button>
    </div>
  );
};

export default MessageInput;
