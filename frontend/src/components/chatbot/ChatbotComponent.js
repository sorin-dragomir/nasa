import React, { useState, useRef, useEffect } from "react";
import { Container } from "../common";
import { playDirectSound } from "../../utils/directSoundManager";
import { sendMessageToChatbot } from "./chatbotService";
import "./ChatbotComponent.css";

const ChatbotComponent = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your NASA AI Assistant powered by advanced AI and space knowledge. Ask me anything about space, planets, missions, astronomy, or current NASA projects! 🚀🤖",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    const userQuestion = inputText;
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Play typing sound
    playDirectSound("typing");

    try {
      // Get response from backend chatbot API
      const { response } = await sendMessageToChatbot(userQuestion);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      
      // Play success sound for bot response
      playDirectSound("click");
    } catch (error) {
      console.error("Error getting chatbot response:", error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble processing your question right now. Please try again later! 🤖",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
      
      // Play warning sound for error
      playDirectSound("warning");
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Container className="chatbot-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="chatbot-header text-center mb-4">
              <h1 className="chatbot-title text-info">
                <i className="material-icons me-2">smart_toy</i>
                Ask NASA Assistant
              </h1>
              <p className="chatbot-description text-light">
                Your intelligent AI assistant powered by space knowledge and advanced AI
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="chatbot-window">
              <div className="chat-messages">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.sender}`}>
                    <div className="message-bubble">
                      <div className="message-text">{message.text}</div>
                      <div className="message-time">{formatTime(message.timestamp)}</div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="message bot">
                    <div className="message-bubble typing">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="chat-input-form">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control chat-input"
                    placeholder="Ask me about space, planets, missions..."
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={isTyping}
                  />
                  <button
                    className="btn btn-info"
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                  >
                    <i className="material-icons">send</i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="suggested-questions">
              <h5 className="text-info mb-3">
                <i className="material-icons me-2">help_outline</i>
                Try asking about:
              </h5>
              <div className="row">
                <div className="col-lg-3 col-md-6 mb-2">
                  <button
                    className="btn btn-outline-info btn-sm w-100"
                    onClick={() => setInputText("When will the next solar eclipse be?")}
                  >
                    Solar eclipses
                  </button>
                </div>
                <div className="col-lg-3 col-md-6 mb-2">
                  <button
                    className="btn btn-outline-info btn-sm w-100"
                    onClick={() => setInputText("What is a black hole?")}
                  >
                    Black holes
                  </button>
                </div>
                <div className="col-lg-3 col-md-6 mb-2">
                  <button
                    className="btn btn-outline-info btn-sm w-100"
                    onClick={() => setInputText("Tell me about Mars")}
                  >
                    Mars exploration
                  </button>
                </div>
                <div className="col-lg-3 col-md-6 mb-2">
                  <button
                    className="btn btn-outline-info btn-sm w-100"
                    onClick={() => setInputText("How fast does the ISS travel?")}
                  >
                    Space Station
                  </button>
                </div>
                <div className="col-lg-3 col-md-6 mb-2">
                  <button
                    className="btn btn-outline-info btn-sm w-100"
                    onClick={() => setInputText("Tell me about Jupiter")}
                  >
                    Jupiter & moons
                  </button>
                </div>
                <div className="col-lg-3 col-md-6 mb-2">
                  <button
                    className="btn btn-outline-info btn-sm w-100"
                    onClick={() => setInputText("What is the James Webb telescope?")}
                  >
                    Space telescopes
                  </button>
                </div>
                <div className="col-lg-3 col-md-6 mb-2">
                  <button
                    className="btn btn-outline-info btn-sm w-100"
                    onClick={() => setInputText("Is there life in space?")}
                  >
                    Life in space
                  </button>
                </div>
                <div className="col-lg-3 col-md-6 mb-2">
                  <button
                    className="btn btn-outline-info btn-sm w-100"
                    onClick={() => setInputText("How do rockets work?")}
                  >
                    Space travel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ChatbotComponent;
