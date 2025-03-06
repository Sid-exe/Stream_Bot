"use client";
import Image from "next/image";
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
      <Image
        src="/assets/stream_logo.svg"
        alt="Stream Logo"
        width="206"
        height="53"
      />
      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="starter-text">
              Welcome to the Stream Ecosystem ! I am a Chatbot designed to help
              you with your queries. Feel free to ask me some general questions
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
        <input
          className="question-box"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me something..."
        />
        <input type="submit" />
      </form>
    </main>
  );
};
export default Home;
