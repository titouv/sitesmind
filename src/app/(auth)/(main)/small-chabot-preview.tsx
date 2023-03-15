"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// import {
//   ChatApiSchemaType,
//   OpenAIMessages,
// } from "@/app/(auth)/api/bot/[id]/chat/route";
import { Icons } from "@/components/icons";
import { BASE_URL } from "@/config/site";
import * as Popover from "@radix-ui/react-popover";

const botId = "3bcae46d-2796-4922-b84b-81cbc24befcf";

// type Message = OpenAIMessages[number] & {
//   streaming?: boolean;
// };
type Message = {
  content: string;
  role: "user" | "assistant" | "system";
  streaming?: boolean;
};

export default function SmallChabotPreview({
  params,
}: {
  params: { id: string };
}) {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello, I am a chatbot. How can I help you?",
      role: "assistant",
    },
  ]);

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const question = userInput.trim();
    if (question === "") {
      return;
    }

    // clean input
    setUserInput("");
    setLoading(true);
    let messagesToApi: Message[] = [
      ...messages,
      {
        content: question,
        role: "user",
      },
    ];
    setMessages((state) => [
      ...state,
      { content: question, role: "user" },
      { content: "", role: "assistant", streaming: true },
    ]);

    const url = new URL(`api/chat/${botId}`, window.location.origin);
    const searchParams: { messages: Message[] } = {
      messages: messagesToApi.map((message) => ({
        content: message.content,
        role: message.role,
      })),
    };

    url.searchParams.set("messages", JSON.stringify(searchParams.messages));

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      if (value) {
        const decoded = decoder.decode(value);
        setMessages((state) =>
          // modify last element
          state.map((message, index) => {
            if (index === state.length - 1) {
              return {
                ...message,
                content: message.content + decoded,
              };
            }
            return message;
          })
        );
      }
      done = doneReading;
    }
    // remove streaming
    setMessages((state) =>
      state.map((message) => {
        if (message.streaming) {
          return {
            ...message,
            streaming: undefined,
          };
        }
        return message;
      })
    );

    setLoading(false);
  };

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const lastMessage = messages[messages.length - 1].content;

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [lastMessage]);

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e: any) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="flex
          items-center justify-center gap-2 rounded-full bg-blue-500 p-2 text-white"
        >
          <Icons.messageCircle className="h-4 w-4" />

          {/* <PhChatTeardropFill className="h-6 w-6" /> */}
          {/* <span>Datapix GPT</span> */}
        </button>
      </Popover.Trigger>
      <Popover.Content
        side="top"
        sideOffset={10}
        align="end"
        className="max-w-xs rounded-xl bg-black/90 p-3 text-xs md:text-sm"
      >
        <div>
          <div
            ref={messageListRef}
            className="mb-4 flex max-w-sm flex-col  gap-4 overflow-scroll rounded-t-xl md:max-h-32 "
          >
            {messages.map((message, index) => {
              if (message.content == "") return;
              let icon;
              let roleClassName;

              if (message.role === "assistant") {
                icon = (
                  // <Image
                  //   src="/chatIcon.png"
                  //   alt="AI"
                  //   width="30"
                  //   height="30"
                  //   priority
                  // />
                  <div>
                    <Icons.bot width={30} height={30} />
                  </div>
                );
                roleClassName =
                  "px-3 py-2 rounded-t-xl rounded-br-xl bg-[#004584] text-white";
              } else {
                icon = (
                  //     <Image
                  //       src="/usericon.png"
                  //       alt="Me"
                  //       width="30"
                  //       height="30"
                  //       priority
                  //     />
                  <div>
                    <Icons.user width={30} height={30} />
                  </div>
                );

                // The latest message sent by the user will be animated while waiting for a response
                roleClassName =
                  index === messages.length - 2 &&
                  messages[messages.length - 1].content == ""
                    ? "px-3 py-2 rounded-t-xl rounded-bl-xl bg-gray-100 animate-pulse"
                    : "px-3 py-2 rounded-t-xl rounded-bl-xl bg-gray-100";
              }
              return (
                <div className={roleClassName} key={index}>
                  {/* <div>{icon}</div> */}
                  <div>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      linkTarget="_blank"
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="mt-2 flex gap-1">
            <textarea
              className="grow  resize-none rounded-full bg-gray-800 px-3 py-1 text-white outline-none"
              ref={textAreaRef}
              disabled={loading}
              onKeyDown={handleEnter}
              autoFocus={false}
              rows={1}
              maxLength={512}
              id="userInput"
              name="userInput"
              placeholder={
                loading ? "Waiting for response..." : "Type your question..."
              }
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              className="inline-flex aspect-square h-6 items-center justify-center rounded-full border-white bg-gray-800 fill-white text-white md:h-8"
              type="submit"
              disabled={loading}
            >
              <svg
                className="h-3 w-3 rotate-90 md:h-5 md:w-5"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </form>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
