import { Lightning, User } from "@/components/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Preview({
  startSentence,
  color,
}: {
  startSentence: string;
  color: string;
}) {
  const messages = [
    {
      role: "assistant",
      content: startSentence,
    },
  ];

  return (
    <div className="w-[20rem] rounded-xl bg-black/90 p-3 text-xs md:text-sm">
      <div>
        <div className="mb-4 flex max-w-sm flex-col  gap-4 overflow-scroll rounded-t-xl md:max-h-32 ">
          {messages.map((message, index) => {
            if (message.content == "") return;
            let icon;
            let roleClassName;

            if (message.role === "assistant") {
              icon = (
                <div>
                  <Lightning size={30} />
                </div>
              );
              roleClassName =
                "px-3 py-2 rounded-t-xl rounded-br-xl  text-white";
            } else {
              icon = (
                <div>
                  <User size={30} />
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
              <div
                style={{ backgroundColor: color ?? "#004584" }}
                className={roleClassName}
                key={index}
              >
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
        <form className="mt-2 flex gap-1">
          <textarea
            className="grow  resize-none rounded-full bg-gray-800 px-3 py-1 text-white outline-none"
            autoFocus={false}
            rows={1}
            maxLength={512}
            id="userInput"
            name="userInput"
          />
          <button
            className="inline-flex aspect-square h-6 items-center justify-center rounded-full border-white bg-gray-800 fill-white text-white md:h-8"
            type="submit"
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
    </div>
  );
}
