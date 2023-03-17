import { Title } from "@/components/title";
import { Link } from "@/components/ui/link";
import { BASE_URL } from "@/config/site";
import { Code } from "bright";

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
        <span>
          Copy and paste the following code into your website to embed the chat
        </span>
        {/* @ts-expect-error */}
        <Code className="max-w-xl text-sm" lang="js">
          {code}
        </Code>
        <Link href={`/bot/${params.id}/chat`}>Go back to chat</Link>
      </div>
    </section>
  );
}
