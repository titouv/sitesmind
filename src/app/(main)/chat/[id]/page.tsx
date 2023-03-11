"use client"
import { useState, useRef, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
// import ReactMarkdown from "react-markdown"
// import CircularProgress from "@mui/material/CircularProgress"
// import { fetchEventSource } from "@microsoft/fetch-event-source"
// import remarkGfm from "remark-gfm"
import { OpenAIMessages } from "@/app/api/chat/route"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
type Message = OpenAIMessages[number] & {
  streaming?: boolean
}

export default function Home({ params }: { params: { id: string } }) {
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)

  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello, I am a chatbot. How can I help you?",
      role: "assistant",
    },
  ])

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const question = userInput.trim()
    if (question === "") {
      return
    }

    // clean input
    setUserInput("")
    setLoading(true)
    let messagesToApi: Message[] = [
      ...messages,
      {
        content: question,
        role: "user",
      },
    ]
    setMessages((state) => [
      ...state,
      { content: question, role: "user" },
      { content: "", role: "assistant", streaming: true },
    ])

    const url = new URL(`api/chat/`, "http://localhost:3000")
    url.searchParams.set("messages", JSON.stringify(messagesToApi))

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const data = response.body
    if (!data) {
      return
    }
    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      if (value) {
        const decoded = decoder.decode(value)
        setMessages((state) =>
          // modify last element
          state.map((message, index) => {
            if (index === state.length - 1) {
              return {
                ...message,
                content: message.content + decoded,
              }
            }
            return message
          })
        )
      }
      done = doneReading
    }
    // remove streaming
    setMessages((state) =>
      state.map((message) => {
        if (message.streaming) {
          return {
            ...message,
            streaming: undefined,
          }
        }
        return message
      })
    )

    setLoading(false)
  }

  const messageListRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const lastMessage = messages[messages.length - 1].content

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight
    }
  }, [lastMessage])

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current?.focus()
  }, [loading])

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e: any) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e)
      }
    } else if (e.key === "Enter") {
      e.preventDefault()
    }
  }

  return (
    <div className="container flex flex-col items-center py-8">
      <div className="py-2  w-[75vw]">
        <span>This is a chabot for {params.id}</span>
      </div>
      <div className="w-[75vw] h-[65vh]  flex flex-col items-center  border overflow-hidden rounded-xl justify-center  border-slate-300">
        <div
          className="w-full h-full overflow-y-scroll scroll-smooth"
          ref={messageListRef}
        >
          {messages.map((message, index) => {
            if (message.content == "") return
            let icon
            let roleClassName

            if (message.role === "assistant") {
              icon = (
                // <Image
                //   src="/chatIcon.png"
                //   alt="AI"
                //   width="30"
                //   height="30"
                //   priority
                // />
                <div className="p-2 bg-white rounded-xl">
                  <Icons.bot
                    className="w-[20px] h-[20px]"
                    width={30}
                    height={30}
                  />
                </div>
              )
              roleClassName = "bg-slate-100"
            } else {
              icon = (
                //     <Image
                //       src="/usericon.png"
                //       alt="Me"
                //       width="30"
                //       height="30"
                //       priority
                //     />
                <div className="p-2 bg-slate-100 rounded-xl">
                  <Icons.user
                    className="w-[20px] h-[20px]"
                    width={30}
                    height={30}
                  />
                </div>
              )

              // The latest message sent by the user will be animated while waiting for a response
              roleClassName =
                index === messages.length - 2 &&
                messages[messages.length - 1].content == ""
                  ? "animate-pulse"
                  : ""
            }
            return (
              <div className={cn("px-6 py-4 flex ", roleClassName)} key={index}>
                <div className="mr-4">{icon}</div>
                <div>
                  {/* <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    linkTarget="_blank"
                  > */}
                  {message.content}
                  {/* </ReactMarkdown> */}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="w-[75vw] pt-4">
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
            className="resize-none w-full"
          />
          <Button type="submit" disabled={loading}>
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}
