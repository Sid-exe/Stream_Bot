"use client";
import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { Message } from "ai";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionRow from "./components/PromptSuggestionRow";

const Home = () => {
  const {
    append,
    input,
    isLoading,
    messages,
    handleInputChange,
    handleSubmit,
  } = useChat();

  const noMessages = !messages || messages.length === 0;
  const chatContainerRef = useRef(null);


   // Scroll to the bottom when messages update
   useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePrompt = (promptText) => {
    const msg: Message = {
      id: Date.now().toString(),
      content: promptText,
      role: "user",
    };
    append(msg);
  };

  return (
    <main>
      <img src="/assets/stream_logo.svg" alt="Stream Logo"width="206" height="53"
      />
      <section className={noMessages ? "" : "populated"} ref={chatContainerRef}>
        {noMessages ? (
          <>
            <p className="starter-text">
              <span>Welcome to the Stream Ecosystem Chatbot</span><br/><br/> Feel free to ask me some general questions
              as well as some specific ones. Use the Learning Management System
              and Project Based Learning to expand your knowledge.
            </p>
            <br />
            <PromptSuggestionRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <>
            {messages.map((message, index) => (
              <Bubble key={`message-${index}`} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </>
        )}
      </section>
      <form onSubmit={handleSubmit}>
        <input className="question-box" onChange={handleInputChange}  value={input} placeholder="Ask me something..."/>  
        <button type="submit" className="send-button" aria-label="Send message">
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </main>
  );
};
export default Home;
