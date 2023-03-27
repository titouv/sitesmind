"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lightning, User } from "@/components/icons";
import { Link } from "@/components/ui/link";
import { useToast } from "@/hooks/ui/use-toast";

type Message = {
  content: string;
  role: "user" | "assistant" | "system";
  streaming?: boolean;
};

export function Chat({
  bot,
}: {
  bot: { id: string; name: string; meta: string };
}) {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: `You are Q&A bot trained on the content : ${bot.meta}. A highly intelligent system that answers
user questions based on the information provided by the user above
each question. If the information can not be found in the information
provided by the user you truthfully say "I don't know"`,
    },
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
    const url = new URL(`api/bot/${bot.id}/chat`, window.location.origin);

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

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current?.focus();
  }, [loading]);

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

  const { toast } = useToast();

  return (
    <div className="container flex flex-col items-center py-8">
      <div className="flex w-full flex-col py-2 md:w-[75vw] md:flex-row md:items-center  md:justify-between">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter">
          {bot.name}
        </h1>
        <div className="flex gap-2">
          <Link variant="subtle" href={`/bot/${bot.id}/how-to`}>
            How to use
          </Link>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                `www.sitesmind.com/bot/${bot.id}/chat`
              );
              toast({
                title: "Copied",
                description: "Thanks for sharing this chat",
              });
            }}
          >
            Copy link to share
          </Button>
        </div>
      </div>
      <div className="flex h-[65vh] w-full flex-col items-center justify-center  overflow-hidden rounded-xl border border-slate-300  md:w-[75vw]">
        <div
          className="h-full w-full overflow-y-scroll scroll-smooth overflow-x-hidden  scrollbar-thin scrollbar-thumb-slate-400 "
          ref={messageListRef}
        >
          {messages.map((message, index) => {
            if (message.content == "") return;
            if (message.role == "system") return;
            let icon;
            let roleClassName;

            if (message.role === "assistant") {
              icon = (
                <div className="rounded-md bg-white p-2">
                  <Lightning
                    weight="fill"
                    className="h-[14px] w-[14px]"
                    width={30}
                    height={30}
                  />
                </div>
              );
              roleClassName = "bg-slate-100";
            } else {
              icon = (
                <div className="rounded-md bg-slate-100 p-2">
                  <User
                    weight="fill"
                    className="h-[14px] w-[14px]"
                    width={30}
                    height={30}
                  />
                </div>
              );

              // The latest message sent by the user will be animated while waiting for a response
              roleClassName =
                index === messages.length - 2 &&
                messages[messages.length - 1].content == ""
                  ? "animate-pulse"
                  : "";
            }
            return (
              <div className={cn("flex px-6 py-4 ", roleClassName)} key={index}>
                <div className="mr-4">{icon}</div>
                <ReactMarkdown
                  className="prose max-w-none"
                  remarkPlugins={[remarkGfm]}
                  linkTarget="_blank"
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full pt-4 md:w-[75vw]">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
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
            className="w-full resize-none"
          />
          <Button type="submit" disabled={loading}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
