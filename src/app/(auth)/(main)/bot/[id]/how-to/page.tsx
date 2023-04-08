import { Title } from "@/components/title";
import { Link } from "@/components/ui/link";
import { Code } from "bright";
import Script from "next/script";
export const runtime = "nodejs";
Code.theme = "github-dark";

export default function Page({ params }: { params: { id: string } }) {
  const code =
    `<script src="https://www.sitesmind.com/embed.js" id="${params.id}"></script>`.trim();
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex flex-col items-center justify-center">
        <Title>How to use your chat on your website</Title>
      </div>
      <div className="flex flex-col items-center">
        <span className="max-w-sm text-center">
          Copy and paste the following code into your website to embed the chat
          You&apos;ll then have a chatbot box in the bottom right corner of your
          site like on this page
        </span>
        {/* @ts-expect-error */}
        <Code className="max-w-xl text-sm" lang="js">
          {code}
        </Code>
        <Link href={`/bot/${params.id}/chat`}>Go back to chat</Link>
      </div>
      <Script src="http://localhost:3000/embed.js" id={params.id} />
    </section>
  );
}
