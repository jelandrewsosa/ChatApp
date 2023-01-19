import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import MessageContent from "./components/MessageContent.js";

function Chat({ socket, username, room }) {
  //to keep track of the message
  const [currentMessage, setCurrentMessage] = useState("");

  // list of all the message in the chat room
  const [messageList, setMessageList] = useState([]);

  const updateMessageList = async (newMessageList) => {
    await socket.emit("delete_message", messageList);
    setMessageList((list) => [...list, newMessageList]);
    setMessageList(messageList.filter((elem) => elem.length !== 0))
  };

  // function that will send message
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      // send_message is the event name
      // this will send the message to the server
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      // updates the messages from the chat room
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>FONEAPI Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            const messageIndex = index;
            return (
              <div
                key={index}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <MessageContent
                    className="message-content"
                    socket={socket}
                    username={username}
                    messageContent={messageContent}
                    messageIndex={messageIndex}
                    messageList={messageList}
                    updateMessageList={updateMessageList}
                  />
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Message..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
