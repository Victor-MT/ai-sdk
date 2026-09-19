"use client";

import { Bot, User2 } from "lucide-react";
import { ChatScrollToBottomButton } from "./chat-scroll-to-bottom-button";
import { useEffect, useRef, useState } from "react";
import { MessageInput } from "./message-input";
import { Markdown } from "./markdown";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, getToolName, isToolUIPart } from "ai";
import { ToolLoading } from "./tool-loading";
import { GithubProfile } from "./github-profile";
import { AIMessage } from "@/ai/tools";

export function Chat() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat<AIMessage>({
    transport: new DefaultChatTransport({ api: "/api/ai" }),
  });

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value);
  }

  function handleSubmit() {
    if (!input.trim() || status === "submitted" || status === "streaming") {
      return;
    }

    void sendMessage({ text: input });
    setInput("");
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 && status === 'streaming' && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [
    messages,
    status,
  ])

  return (
    <>
      <div className="flex-1 relative">
        <div
          ref={containerRef}
          className="space-y-6 absolute inset-0 overflow-y-scroll scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-zinc-900 scrollbar-track-transparent"
        >
          {messages.map(message => {
            return (
              <div key={message.id} className="flex items-start gap-3">
                {message.role === 'user' && (
                  <div className="size-7 rounded-md bg-zinc-900 flex items-center justify-center">
                    <User2 className="size-4 text-zinc-100" />
                  </div>
                )}

                {message.role === 'assistant' && (
                  <div className="size-7 rounded-md bg-zinc-900 flex items-center justify-center">
                    <Bot className="size-4 text-zinc-400" />
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {message.parts.filter(part => part.type === 'text').length > 0 && (
                    <div className="flex-1 prose prose-invert prose-zinc prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
                      <Markdown>
                        {message.parts
                          .filter((part) => part.type === "text")
                          .map((part) => part.text)
                          .join("")}
                      </Markdown>
                    </div>
                  )}

                  {message.parts.map(part => {
                    if (!isToolUIPart(part)) {
                      return null
                    }

                    if (part.state === "input-streaming" || part.state === "input-available") {
                      switch (getToolName(part)) {
                        case 'githubProfile':
                          return <ToolLoading key={part.toolCallId} text="Carregando informações do Github..." />

                        case 'httpFetch':
                          return <ToolLoading key={part.toolCallId} text="Realizando requisições HTTP..." />
                      }
                    }

                    if (part.type === "tool-githubProfile" && part.state === "output-available") {
                      return <GithubProfile key={part.toolCallId} user={part.output} />
                    }
                  })}
                </div>
              </div>
            )
          })}

          <div ref={bottomRef} />
        </div>

        <ChatScrollToBottomButton
          containerRef={containerRef}
          scrollRef={bottomRef}
        />
      </div>

      <MessageInput
        disabled={status === 'streaming' || status === 'submitted'}
        value={input}
        onValueChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}
